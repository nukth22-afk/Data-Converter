import * as XLSX from 'xlsx';
import {
  ZONE_MAP,
  EXACT_DISTRICT_RULES,
  THAI_ALIASES,
  EN_DISTRICTS,
  SUBDISTRICT_MAP,
  POSTAL_CODE_DISTRICT_MAP,
} from '../constants/defaultData';
import { ProcessedRow, TeamMapping } from '../types';

const DISTRICT_NAMES_BY_LEN = Object.keys(ZONE_MAP).sort((a, b) => b.length - a.length);
const EN_KEYS_BY_LEN = Object.keys(EN_DISTRICTS).sort((a, b) => b.length - a.length);

const rxCache = new Map<string, RegExp>();

export function compactText(s: string | null | undefined): string {
  return String(s || '').toLowerCase().replace(/\s+/g, '');
}

export function normText(s: string | null | undefined): string {
  return String(s || '')
    .normalize('NFC')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function matchRx(pattern: string): RegExp {
  let rx = rxCache.get(pattern);
  if (!rx) {
    const p = compactText(pattern).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    rx = new RegExp((/^\d/.test(p) ? '(?<!\\d)' : '') + p + (/\d$/.test(p) ? '(?!\\d)' : ''));
    rxCache.set(pattern, rx);
  }
  return rx;
}

// Building, condo, project prefixes that indicate the following district name is part of the property name
const BUILDING_PREFIX_REGEX = /(?:อาคาร|คอนโด|โครงการ|หมู่บ้าน|เดอะ|เดอะมาร์ค|เน็กซ์|ไอดีโอ|ลุมพินี|แอสปาย|ริธึ่ม|เซ็นทริค|ศุภาลัย|พลัม|เศรษฐสิริ|เพอร์เฟค|ชีวาทัย|แชปเตอร์|ไซมิส|ยูคอนโด|ดิ\s*เอดเดรส|ซิตี้โฮม|วิลล่า|คาซ่า|มัณฑนา|ชัยพฤกษ์|บางกอก บูเลอวาร์ด|bangkok boulevard|condo|building|apartment|village)\s*/i;

// Road, soi, and transit prefixes
const ROAD_SOI_PREFIX_REGEX = /(?:ถนน|ถ\.|ซอย|ซ\.|แยก|สะพาน|ทางด่วน|สถานี|bts|mrt)\s*/i;

interface DistrictCandidate {
  district: string;
  score: number;
  matchedText: string;
  index: number;
}

/**
 * Advanced multi-stage district extractor:
 * 1. Checks explicit administrative prefixes ("เขต...", "อำเภอ...", "khet...", "district...")
 * 2. Checks high-priority anti-collision precise rules
 * 3. Scans for English district and subdistrict tokens in mixed & English addresses
 * 4. Context-aware & position-aware candidate scoring (penalizes condo/road names, rewards postal code & subdistrict matches)
 */
export function extractDistrictAdvanced(addressStr: string): string {
  if (!addressStr) return "";
  const raw = String(addressStr).trim();
  const addrLower = raw.toLowerCase();
  const addrCompact = compactText(raw);

  // Extract 5-digit postal code (if any)
  const postalMatch = raw.match(/\b(1[0-2]\d{3}|77110|84140)\b/);
  const postalCode = postalMatch ? postalMatch[1] : null;

  // -------------------------------------------------------------
  // Stage 1: Explicit Administrative Prefix (Highest Confidence)
  // -------------------------------------------------------------
  // Thai explicit prefix: เขต, อำเภอ, อ.เมือง
  const mmCity = addrCompact.match(/(?:อ\.|อำเภอ)เมือง(?:จ\.|จังหวัด)?(ปทุมธานี|นนทบุรี|สมุทรปราการ)/);
  if (mmCity) return "เมือง" + mmCity[1];

  for (const prefix of ["เขต", "อำเภอ", "อ."]) {
    let from = 0;
    let idx: number;
    while ((idx = addrCompact.indexOf(prefix, from)) !== -1) {
      const rest = addrCompact.slice(idx + prefix.length);
      const hit = DISTRICT_NAMES_BY_LEN.find((n) => rest.startsWith(compactText(n)));
      if (hit) return hit;
      const al = THAI_ALIASES.find((a) => rest.startsWith(a[0]));
      if (al) return al[1];
      from = idx + prefix.length;
    }
  }

  // English explicit prefix: khet, amphoe, amphur, district
  const enPrefixMatch = addrLower.match(/\b(?:khet|amphoe|amphur|district)\s+([a-z\s]+)/i);
  if (enPrefixMatch) {
    const rawEn = enPrefixMatch[1].replace(/[^a-z]/g, '');
    for (const k of EN_KEYS_BY_LEN) {
      if (rawEn.startsWith(k)) return EN_DISTRICTS[k];
    }
  }

  // -------------------------------------------------------------
  // Stage 2: Anti-Collision Specific Rules
  // -------------------------------------------------------------
  const strippedAddr2 = addrCompact
    .replace(/คลองถนน/g, 'คลองถะนน')
    .replace(/บางกรวย-ไทรน้อย|บางนา-ตราด|บางนาตราด|พระนครศรีอยุธยา/g, '');

  for (const rule of EXACT_DISTRICT_RULES) {
    if (rule.match.some((m) => matchRx(m).test(strippedAddr2))) {
      return rule.district;
    }
  }

  // -------------------------------------------------------------
  // Stage 3 & 4: Candidate Collection and Context-Aware Scoring
  // -------------------------------------------------------------
  const candidates: DistrictCandidate[] = [];

  // Helper to add candidate with scoring
  const addCandidate = (district: string, index: number, matchedText: string, baseScore = 200) => {
    let score = baseScore;

    // 1. Subdistrict match bonus (+800 points)
    // Check if any subdistrict belonging to this district is present in the address
    for (const [sub, targetDist] of Object.entries(SUBDISTRICT_MAP)) {
      if (targetDist === district) {
        if (addrLower.includes(sub.toLowerCase()) || addrCompact.includes(compactText(sub))) {
          score += 850;
          break;
        }
      }
    }

    // 2. Postal code match bonus (+500 points)
    if (postalCode && POSTAL_CODE_DISTRICT_MAP[postalCode]?.includes(district)) {
      score += 500;
    }

    // 3. Position in address (Administrative districts are at the end, before province/postal code)
    const lengthRatio = raw.length > 0 ? index / raw.length : 0;
    score += Math.round(lengthRatio * 400);

    // If followed by กรุงเทพ, กทม, bangkok, or postal code within 30 characters
    const textAfter = addrLower.slice(index + matchedText.length, index + matchedText.length + 35);
    if (/กรุงเทพ|กทม|bangkok|bkk|\d{5}/.test(textAfter)) {
      score += 650;
    }

    // 4. Building / Project name penalty (-700 points)
    const textBefore = addrLower.slice(Math.max(0, index - 25), index);
    if (BUILDING_PREFIX_REGEX.test(textBefore)) {
      score -= 700;
    }

    // 5. Road / Soi prefix penalty (-600 points)
    if (ROAD_SOI_PREFIX_REGEX.test(textBefore)) {
      score -= 600;
    }

    // 6. Followed by number or compound suffix (e.g., "ลาดพร้าว 44", "ลาดพร้าววังหิน", "บางนา-ตราด")
    const immediateAfter = textAfter.trim();
    if (/^\d{1,4}/.test(immediateAfter) || /^(วังหิน|ตราด|ไทรน้อย)/.test(immediateAfter)) {
      score -= 500;
    }

    candidates.push({ district, score, matchedText, index });
  };

  // --- Scan English districts & subdistricts (supports mixed Thai-English & pure English) ---
  for (const enKey of EN_KEYS_BY_LEN) {
    const compactEn = enKey.replace(/\s+/g, '');
    let pos = addrLower.indexOf(enKey);
    if (pos === -1 && addrCompact.includes(compactEn)) {
      pos = addrCompact.indexOf(compactEn);
    }
    if (pos !== -1) {
      addCandidate(EN_DISTRICTS[enKey], pos, enKey, 500);
    }
  }

  // --- Scan Thai districts in ZONE_MAP ---
  for (const dName of DISTRICT_NAMES_BY_LEN) {
    const dCompact = compactText(dName);
    let from = 0;
    let pos: number;
    while ((pos = addrCompact.indexOf(dCompact, from)) !== -1) {
      addCandidate(dName, pos, dName, 300);
      from = pos + dCompact.length;
    }
  }

  // --- Scan Thai Aliases ---
  for (const [alias, canonical] of THAI_ALIASES) {
    const pos = addrCompact.indexOf(alias);
    if (pos !== -1) {
      addCandidate(canonical, pos, alias, 400);
    }
  }

  // Sort candidates by score descending
  if (candidates.length > 0) {
    candidates.sort((a, b) => b.score - a.score);
    // Return highest scored candidate
    return candidates[0].district;
  }

  // Fallback: If only postal code exists and matches a single district
  if (postalCode && POSTAL_CODE_DISTRICT_MAP[postalCode]?.length === 1) {
    return POSTAL_CODE_DISTRICT_MAP[postalCode][0];
  }

  return "";
}

export function extractTime(v: unknown): string {
  const DEF = "09:00:00";
  if (v === undefined || v === null) return DEF;
  const s = String(v).trim();
  if (!s) return DEF;
  const pad = (n: number) => String(n).padStart(2, '0');

  // Excel serial number
  if (/^\d+(\.\d+)?$/.test(s)) {
    const n = parseFloat(s);
    if (n > 0 && (s.includes('.') || n >= 20000)) {
      const secs = Math.round((n - Math.floor(n)) * 86400) % 86400;
      return `${pad(Math.floor(secs / 3600))}:${pad(Math.floor((secs % 3600) / 60))}:${pad(secs % 60)}`;
    }
    return DEF;
  }

  const m = s.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s*([AaPp])\.?[Mm]\.?)?/);
  if (!m) return DEF;
  let h = parseInt(m[1], 10);
  const mi = parseInt(m[2], 10);
  const se = m[3] ? parseInt(m[3], 10) : 0;
  if (m[4]) {
    const pm = m[4].toLowerCase() === 'p';
    if (pm && h < 12) h += 12;
    if (!pm && h === 12) h = 0;
  }
  if (h > 23 || mi > 59 || se > 59) return DEF;
  return `${pad(h)}:${pad(mi)}:${pad(se)}`;
}

export function getSlotByTime(timeStr: string): string {
  if (!timeStr) return "s1/";
  const cleanTime = String(timeStr).trim();
  const parts = cleanTime.split(':');
  if (parts.length < 2) return "s1/";

  const hour = parseInt(parts[0], 10);
  const minute = parseInt(parts[1], 10);
  const totalMinutes = hour * 60 + minute;

  if (totalMinutes >= 540 && totalMinutes < 660) return "s1/";
  if (totalMinutes >= 660 && totalMinutes < 780) return "s2/";
  if (totalMinutes >= 780 && totalMinutes < 900) return "s3/";
  if (totalMinutes >= 900 && totalMinutes < 1020) return "s4/";
  if (totalMinutes >= 1020) return "s5/";

  return "s1/";
}

export function mapContractTeamToAlias(contractTeamStr: string, mappings: TeamMapping[]): string {
  if (!contractTeamStr) return "#N/A";
  const nTeam = normText(contractTeamStr);
  for (const tm of mappings) {
    const nk = normText(tm.keyword);
    if (nk && nTeam.includes(nk)) {
      return tm.alias;
    }
  }
  return "#N/A";
}

export function isPackageGreaterThan1000(pkgStr: string | null | undefined): boolean {
  if (!pkgStr) return false;
  const s = String(pkgStr).trim().toLowerCase();
  if (!s) return false;

  // Check 2Gbps, 2.5Gbps, etc. (Gbps >= 2 is >= 2000 Mbps > 1000)
  if (/([2-9]|\d{2,})\s*g(?:bps)?/i.test(s)) return true;

  // Find all numbers
  const nums = s.match(/\d+(?:\.\d+)?/g);
  if (!nums) return false;

  return nums.some((n) => {
    const val = parseFloat(n);
    return !isNaN(val) && val > 1000;
  });
}

export function processRawData(
  dataList: Record<string, unknown>[],
  teamMappings: TeamMapping[],
  ignoredTitles: string[]
): { passed: ProcessedRow[]; filteredOut: ProcessedRow[] } {
  const passed: ProcessedRow[] = [];
  const filteredOut: ProcessedRow[] = [];

  dataList.forEach((row) => {
    const rowKeys = Object.keys(row);

    const getVal = (exactKeys: string[], fuzzyKeys: string[] = []): string => {
      for (const pk of exactKeys) {
        const p = pk.trim().toLowerCase();
        const k = rowKeys.find((item) => item.trim().toLowerCase() === p);
        if (k !== undefined && row[k] !== null && row[k] !== undefined) {
          return String(row[k]).trim();
        }
      }
      for (const pk of fuzzyKeys) {
        const p = pk.trim().toLowerCase();
        const k = rowKeys.find((item) => item.trim().toLowerCase().includes(p));
        if (k !== undefined && row[k] !== null && row[k] !== undefined) {
          return String(row[k]).trim();
        }
      }
      return "";
    };

    const processingStatus = getVal(
      ["Processing Status", "Task Status", "Status"],
      ["Processing Status", "Task Status"]
    );
    const symtom = getVal(["Title", "Symtom"], ["Title"]);
    const nonId = getVal(["Access Number", "เลข non / TT", "เลข non", "TT"], ["Access Number", "เลข non"]);
    const techName = getVal(["Field Engineer", "ชื่อช่าง"], ["Field Engineer", "ชื่อช่าง"]) || "system";
    const sup = getVal(["Contract Team", "SUP"], ["Contract Team"]) || "ROM-AIS_บจ";
    const planTimeVal = getVal(["Plan Arrival Time", "เวลา"], ["Plan Arrival Time"]);

    const address = getVal(
      ["Address", "ที่อยู่", "Installation Address", "Service Address", "Customer Address"],
      ["install", "service address", "customer address", "address", "ที่อยู่"]
    );

    const servicePackage = getVal(
      ["Service Package Name", "Service Package", "Package Name", "Package", "ชื่อแพ็กเกจ", "ชื่อ Package"],
      ["service package", "package name", "package"]
    );

    if (!symtom && !nonId && !address) return;

    let rejectReason = "";
    let shouldSkip = false;

    const allowedStatuses = ["prepare", "new", "scheduled"];
    if (processingStatus && !allowedStatuses.includes(processingStatus.toLowerCase())) {
      shouldSkip = true;
      rejectReason = `Status ไม่ตรงเงื่อนไข (${processingStatus})`;
    }

    if (!shouldSkip) {
      const nSym = normText(symtom);
      for (const ign of ignoredTitles) {
        const nIgn = normText(ign);
        if (nIgn && nSym.includes(nIgn)) {
          shouldSkip = true;
          rejectReason = `Title ตรงกับรายการละเว้น`;
          break;
        }
      }
    }

    if (!shouldSkip) {
      const symLower = symtom.toLowerCase();
      const symUpper = symtom.toUpperCase();
      if (nonId.startsWith("888") && symUpper.includes("FTTB")) {
        shouldSkip = true;
        rejectReason = "Access 888 + FTTB";
      } else if (nonId.startsWith("888") && symUpper.includes("3BB")) {
        shouldSkip = true;
        rejectReason = "Access 888 + 3BB";
      } else if (symLower.includes("support stream")) {
        shouldSkip = true;
        rejectReason = "มียกเว้น Support Stream";
      } else if (symtom.includes("ย้ายแนวสาย")) {
        shouldSkip = true;
        rejectReason = "มียกเว้น ย้ายแนวสาย";
      } else if (symLower.includes("camera")) {
        shouldSkip = true;
        rejectReason = "มียกเว้น Camera";
      }
    }

    if (!shouldSkip) {
      const supUpper = sup.toUpperCase();
      if (/(^|[^A-Z0-9])(RED|OSM)([^A-Z0-9]|$)/.test(supUpper)) {
        shouldSkip = true;
        rejectReason = `SUP มี RED หรือ OSM`;
      }
    }

    // เงื่อนไข: Service Package Name มากกว่า 1000
    // ข้อยกเว้น: หาก Title มีคำว่า PLAYBOX หรือ ATV ให้เก็บไว้ (ไม่คัดกรองออก)
    if (!shouldSkip && isPackageGreaterThan1000(servicePackage)) {
      const hasPlayboxOrAtv = /(playbox|atv)/i.test(symtom);
      if (!hasPlayboxOrAtv) {
        shouldSkip = true;
        rejectReason = `Service Package > 1000 (ไม่มี PLAYBOX/ATV)`;
      }
    }

    const timeStr = extractTime(planTimeVal);
    const district = extractDistrictAdvanced(address);
    const zone = ZONE_MAP[district] || (district ? district : "#N/A");
    const slot = getSlotByTime(timeStr);
    const districtDisplay = district || "ไม่ระบุเขต";

    let translatedWork = `${slot}${nonId}/${districtDisplay}/${timeStr}`;
    if (symtom.toUpperCase().includes("FTTB")) {
      translatedWork += " FTTB";
    }

    const teamAlias = mapContractTeamToAlias(sup, teamMappings);

    const itemObj: ProcessedRow = {
      symtom,
      nonId,
      techName,
      sup,
      timeRaw: timeStr,
      address,
      district: district || "#N/A",
      slot,
      translatedWork,
      team: teamAlias,
      zone,
      rejectReason,
      processingStatus,
      servicePackage: servicePackage || undefined
    };

    if (shouldSkip) {
      filteredOut.push(itemObj);
    } else {
      passed.push(itemObj);
    }
  });

  return { passed, filteredOut };
}

export function exportToExcelFile(data: ProcessedRow[], filterType: string) {
  if (data.length === 0) return;

  const exportData = data.map((item) => ({
    "Symtom": item.symtom,
    "เลข non / TT": item.nonId,
    "ชื่อช่าง": item.techName,
    "SUP": item.sup,
    "เวลา": item.timeRaw,
    "ที่อยู่": item.address,
    "เขต": item.district,
    "SLOT": item.slot,
    "งาน": item.translatedWork,
    "ทีม": item.team,
    "โซน": item.zone,
    "Service Package Name": item.servicePackage || "",
    ...(filterType === 'filteredOut' ? { "เหตุผลที่คัดกรองออก": item.rejectReason } : {})
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "ข้อมูล");
  XLSX.writeFile(workbook, `ข้อมูลส่งออก_${filterType}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function copyTableToClipboard(data: ProcessedRow[], isFilteredOut: boolean): Promise<void> {
  if (data.length === 0) return Promise.reject(new Error("ไม่มีข้อมูลให้คัดลอก"));

  let tsv = "Symtom\tเลข non / TT\tชื่อช่าง\tSUP\tเวลา\tที่อยู่\tเขต\tSLOT\tงาน\tทีม\tโซน";
  if (isFilteredOut) tsv += "\tเหตุผลที่คัดกรองออก";
  tsv += "\n";

  data.forEach((d) => {
    const c = (v: unknown) => String(v ?? '').replace(/[\t\r\n]+/g, ' ');
    const cols = [
      d.symtom,
      d.nonId,
      d.techName,
      d.sup,
      d.timeRaw,
      d.address,
      d.district,
      d.slot,
      d.translatedWork,
      d.team,
      d.zone
    ];
    if (isFilteredOut) cols.push(d.rejectReason || '');
    tsv += cols.map(c).join('\t') + '\n';
  });

  return navigator.clipboard.writeText(tsv);
}
