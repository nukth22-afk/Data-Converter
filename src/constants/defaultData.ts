import { TeamMapping } from '../types';

export const ZONE_MAP: Record<string, number | string> = {
  "คลองหลวง": 1, "ธัญบุรี": 2, "สามโคก": 3, "หนองเสือ": 4, "ลาดหลุมแก้ว": 5,
  "เมืองปทุมธานี": 6, "ลำลูกกา": 7, "ดอนเมือง": 8, "สายไหม": 9, "บางเขน": 10,
  "หนองจอก": 11, "คลองสามวา": 12, "หลักสี่": 13, "ไทรน้อย": 14, "บางบัวทอง": 15,
  "ปากเกร็ด": 16, "บางใหญ่": 17, "เมืองนนทบุรี": 18, "บางกรวย": 19, "บางซื่อ": 20,
  "จตุจักร": 21, "ดุสิต": 22, "บึงกุ่ม": 23, "คันนายาว": 24, "ลาดพร้าว": 25,
  "พญาไท": 26, "ราชเทวี": 27, "ดินแดง": 28, "ห้วยขวาง": 29, "วังทองหลาง": 30,
  "บางกะปิ": 31, "ทวีวัฒนา": 32, "ตลิ่งชัน": 33, "บางพลัด": 34, "บางกอกน้อย": 35,
  "บางกอกใหญ่": 36, "ภาษีเจริญ": 37, "บางแค": 38, "หนองแขม": 39, "ธนบุรี": 40,
  "คลองสาน": 41, "บางบอน": 42, "จอมทอง": 43, "บางขุนเทียน": 44, "ทุ่งครุ": 45,
  "ราษฎร์บูรณะ": 46, "ปทุมวัน": 47, "พระนคร": 48, "ป้อมปราบศัตรูพ่าย": 49, "สัมพันธวงศ์": 50,
  "บางรัก": 51, "สาทร": 52, "บางคอแหลม": 53, "ยานนาวา": 54, "คลองเตย": 55,
  "วัฒนา": 56, "สวนหลวง": 57, "สะพานสูง": 58, "พระโขนง": 59, "บางนา": 60,
  "ประเวศ": 61, "มีนบุรี": 62, "ลาดกระบัง": 63, "พระประแดง": 64, "พระสมุทรเจดีย์": 65,
  "เมืองสมุทรปราการ": 66, "บางพลี": 67, "บางเสาธง": 68, "บางบ่อ": 69,
  "เกาะสมุย": "เกาะสมุย", "หัวหิน": "หัวหิน"
};

export interface DistrictRule {
  match: string[];
  district: string;
}

export const EXACT_DISTRICT_RULES: DistrictRule[] = [
  // 1. จัดการแขวงในเขตวัฒนา (ป้องกันพระโขนงและคลองเตยแย่งจับคู่)
  { match: ["พระโขนงเหนือ", "คลองเตยเหนือ", "คลองตันเหนือ", "phrakhanongnuea", "klongtoeynuea", "khlongtoenuea"], district: "วัฒนา" },

  // 2. ป้องกันชื่อคอนโด/โครงการหลอกชนกับชื่อเขตอื่น
  { match: ["เดอะนิช รัชดา ห้วยขวาง", "เดอะนิชรัชดาห้วยขวาง", "เดอะนิช รัชดา-ห้วยขวาง"], district: "ดินแดง" },
  { match: ["บางนา-สวนหลวง", "บางนาสวนหลวง", "ดอกไม้ ประเวศ", "แขวงดอกไม้"], district: "ประเวศ" },

  // 3. ปรับสาทรและสวนหลวงให้ตรงตามการปกครองจริง
  { match: ["ถนนนราธิวาสราชนครินทร์ ยานนาวา", "ยานนาวา สาทร", "ยานนาวาสาทร"], district: "สาทร" },
  { match: ["พัฒนาการ50", "พัฒนาการ 50", "ซ.พัฒนาการ50"], district: "สวนหลวง" },

  // 4. แยกแยะเขตที่มักชนกันด้วยชื่อถนน/โครงการ หรือที่อยู่ภาษาอังกฤษ
  { match: ["tha raeng", "bang khen bangkok 10220", "ท่าแร้ง"], district: "บางเขน" },
  { match: ["วิภาวดีรังสิต 20", "วิภาวดีรังสิต20", "จอมพล"], district: "จตุจักร" },
  { match: ["สุขุมวิท 42", "สุขุมวิท42", "พระโขนง คลองเตย", "คลองเตย กรุงเทพ 10110"], district: "คลองเตย" },
  { match: ["ลาดพร้าว71", "ลาดพร้าว 71", "คลองเจ้าคุณสิงห์"], district: "วังทองหลาง" },
  { match: ["ลาดพร้าว94", "ลาดพร้าว 94", "พลับพลา"], district: "วังทองหลาง" },
  { match: ["บางรักน้อย", "เมืองนนทบุรี นนทบุรี 11000", "บางรักน้อย เมืองนนทบุรี"], district: "เมืองนนทบุรี" },
  { match: ["ศาลาธรรมสพน์", "พุทธมณฑลสาย 3"], district: "ทวีวัฒนา" },
  { match: ["เซนต์บางนา", "ราชาเทวะ", "10540"], district: "บางพลี" },
  { match: ["วงสว่าง", "บางเขน เมืองนนทบุรี", "11000"], district: "เมืองนนทบุรี" },
  { match: ["ซ.จอมทอง", "ถ.จอมทอง จอมทอง"], district: "จอมทอง" },
  { match: ["ต.บ้านใหม่ อ.เมือง จ.ปทุมธานี", "บ้านใหม่ เมืองปทุมธานี", "12000"], district: "เมืองปทุมธานี" },

  // 5. ปริมณฑลและตำบลเฉพาะ (กำหนดให้ชัดเจน ป้องกันชนโครงการเช่น "บ้านกลางเมือง")
  { match: ["ต.บ้านกลาง", "ตำบลบ้านกลาง", "บ้านกลาง เมืองปทุมธานี", "บ้านกลางเมืองปทุมธานี"], district: "เมืองปทุมธานี" },
  { match: ["บางเสาธง", "10570", "เคหะบางพลี"], district: "บางเสาธง" },
  { match: ["บางขุนเทียน", "ท่าข้าม"], district: "บางขุนเทียน" },
  { match: ["เกาะสมุย", "84140"], district: "เกาะสมุย" },
  { match: ["หัวหิน", "77110"], district: "หัวหิน" },
  { match: ["บึงคำพร้อย", "ลำลูกกา คลอง", "คูคต", "ลาดสวาย", "เปียร์นนท์"], district: "ลำลูกกา" },
  { match: ["ปากเกร็ด"], district: "ปากเกร็ด" },
  { match: ["บางบัวทอง", "บางคูรัด"], district: "บางบัวทอง" },
  { match: ["บางกรวย"], district: "บางกรวย" },
  { match: ["บางใหญ่"], district: "บางใหญ่" },
  { match: ["ไทรน้อย"], district: "ไทรน้อย" },
  { match: ["คลองหลวง"], district: "คลองหลวง" },
  { match: ["ธัญบุรี", "ประชาธิปัตย์ รังสิต"], district: "ธัญบุรี" },
  { match: ["หนองเสือ"], district: "หนองเสือ" },
  { match: ["สามโคก"], district: "สามโคก" },
  { match: ["บางพลี", "บางปลา", "ราชาเทวะ"], district: "บางพลี" },
  { match: ["บางบ่อ", "บางเพรียง"], district: "บางบ่อ" },
  { match: ["พระประแดง"], district: "พระประแดง" },
  { match: ["พระสมุทรเจดีย์"], district: "พระสมุทรเจดีย์" },
  { match: ["เมืองสมุทรปราการ", "ท้ายบ้าน", "บางเมือง"], district: "เมืองสมุทรปราการ" },
  { match: ["เมืองปทุมธานี"], district: "เมืองปทุมธานี" },
  { match: ["เมืองนนทบุรี"], district: "เมืองนนทบุรี" }
];

export const THAI_ALIASES: [string, string][] = [
  ["ป้อมปราบ", "ป้อมปราบศัตรูพ่าย"]
];

// Comprehensive English district names & variations (mapped to Thai canonical district)
export const EN_DISTRICTS: Record<string, string> = {
  // Ratchathewi
  "ratchathewi": "ราชเทวี",
  "rajthevi": "ราชเทวี",
  "ratchathewee": "ราชเทวี",
  "ratchathevi": "ราชเทวี",
  "makkasan": "ราชเทวี",
  // Bang Kapi
  "bangkapi": "บางกะปิ",
  "bang kapi": "บางกะปิ",
  "huamak": "บางกะปิ",
  "hua mak": "บางกะปิ",
  "khlongchan": "บางกะปิ",
  "klongchan": "บางกะปิ",
  // Huai Khwang
  "huaikhwang": "ห้วยขวาง",
  "huai khwang": "ห้วยขวาง",
  "huaikwang": "ห้วยขวาง",
  "huaykwang": "ห้วยขวาง",
  "huay kwang": "ห้วยขวาง",
  "samsennok": "ห้วยขวาง",
  "sam sen nok": "ห้วยขวาง",
  // Watthana
  "watthana": "วัฒนา",
  "wattana": "วัฒนา",
  "vadhana": "วัฒนา",
  "thonglor": "วัฒนา",
  "thong lo": "วัฒนา",
  "ekkamai": "วัฒนา",
  // Khlong Toei
  "khlongtoei": "คลองเตย",
  "khlong toei": "คลองเตย",
  "klongtoey": "คลองเตย",
  "klong toey": "คลองเตย",
  // Phaya Thai
  "phayathai": "พญาไท",
  "phaya thai": "พญาไท",
  "samsennai": "พญาไท",
  "sam sen nai": "พญาไท",
  // Din Daeng
  "dindaeng": "ดินแดง",
  "din daeng": "ดินแดง",
  // Chatuchak
  "chatuchak": "จตุจักร",
  "chatu chak": "จตุจักร",
  "jatujak": "จตุจักร",
  "jatu jak": "จตุจักร",
  "chomphon": "จตุจักร",
  // Lat Phrao
  "ladprao": "ลาดพร้าว",
  "latphrao": "ลาดพร้าว",
  "lat phrao": "ลาดพร้าว",
  // Wang Thonglang
  "wangthonglang": "วังทองหลาง",
  "wang thong lang": "วังทองหลาง",
  // Bang Na
  "bangna": "บางนา",
  "bang na": "บางนา",
  // Phra Khanong
  "phrakhanong": "พระโขนง",
  "phra khanong": "พระโขนง",
  "prakanong": "พระโขนง",
  "bangchak": "พระโขนง",
  // Prawet
  "prawet": "ประเวศ",
  "pravet": "ประเวศ",
  "dokmai": "ประเวศ",
  // Suan Luang
  "suanluang": "สวนหลวง",
  "suan luang": "สวนหลวง",
  // Sathon
  "sathon": "สาทร",
  "sathorn": "สาทร",
  // Bang Rak
  "bangrak": "บางรัก",
  "bang rak": "บางรัก",
  "silom": "บางรัก",
  // Pathum Wan
  "pathumwan": "ปทุมวัน",
  "pathum wan": "ปทุมวัน",
  // Dusit
  "dusit": "ดุสิต",
  // Phra Nakhon
  "phranakhon": "พระนคร",
  "phra nakhon": "พระนคร",
  // Pom Prap
  "pomprapsattruphai": "ป้อมปราบศัตรูพ่าย",
  "pom prap": "ป้อมปราบศัตรูพ่าย",
  // Samphanthawong
  "samphanthawong": "สัมพันธวงศ์",
  "yaowarat": "สัมพันธวงศ์",
  // Yan Nawa
  "yannawa": "ยานนาวา",
  "yan nawa": "ยานนาวา",
  // Bang Kho Laem
  "bangkholaem": "บางคอแหลม",
  "bang kho laem": "บางคอแหลม",
  // Bang Sue
  "bangsue": "บางซื่อ",
  "bang sue": "บางซื่อ",
  // Bang Khen
  "bangkhen": "บางเขน",
  "bang khen": "บางเขน",
  "tharaeng": "บางเขน",
  "tha raeng": "บางเขน",
  // Don Mueang
  "donmueang": "ดอนเมือง",
  "don mueang": "ดอนเมือง",
  "donmuang": "ดอนเมือง",
  // Sai Mai
  "saimai": "สายไหม",
  "sai mai": "สายไหม",
  // Lak Si
  "laksi": "หลักสี่",
  "lak si": "หลักสี่",
  // Khlong Sam Wa
  "khlongsamwa": "คลองสามวา",
  "khlong sam wa": "คลองสามวา",
  // Nong Chok
  "nongchok": "หนองจอก",
  "nong chok": "หนองจอก",
  // Min Buri
  "minburi": "มีนบุรี",
  "min buri": "มีนบุรี",
  // Lat Krabang
  "latkrabang": "ลาดกระบัง",
  "lat krabang": "ลาดกระบัง",
  // Saphan Sung
  "saphansung": "สะพานสูง",
  "saphan sung": "สะพานสูง",
  // Bueng Kum
  "buengkum": "บึงกุ่ม",
  "bueng kum": "บึงกุ่ม",
  // Khanna Yao
  "khannayao": "คันนายาว",
  "khanna yao": "คันนายาว",
  // Thawi Watthana
  "thawiwatthana": "ทวีวัฒนา",
  "thawi watthana": "ทวีวัฒนา",
  // Taling Chan
  "talingchan": "ตลิ่งชัน",
  "taling chan": "ตลิ่งชัน",
  // Bang Phlat
  "bangphlat": "บางพลัด",
  "bang phlat": "บางพลัด",
  // Bangkok Noi
  "bangkoknoi": "บางกอกน้อย",
  "bangkok noi": "บางกอกน้อย",
  // Bangkok Yai
  "bangkokyai": "บางกอกใหญ่",
  "bangkok yai": "บางกอกใหญ่",
  // Phasi Charoen
  "phasicharoen": "ภาษีเจริญ",
  "phasi charoen": "ภาษีเจริญ",
  // Bang Khae
  "bangkhae": "บางแค",
  "bang khae": "บางแค",
  // Nong Khaem
  "nongkhaem": "หนองแขม",
  "nong khaem": "หนองแขม",
  // Thon Buri
  "thonburi": "ธนบุรี",
  "thon buri": "ธนบุรี",
  // Khlong San
  "khlongsan": "คลองสาน",
  "khlong san": "คลองสาน",
  // Bang Bon
  "bangbon": "บางบอน",
  "bang bon": "บางบอน",
  // Chom Thong
  "chomthong": "จอมทอง",
  "chom thong": "จอมทอง",
  // Bang Khun Thian
  "bangkhunthian": "บางขุนเทียน",
  "bang khun thian": "บางขุนเทียน",
  // Thung Khru
  "thungkhru": "ทุ่งครุ",
  "thung khru": "ทุ่งครุ",
  // Rat Burana
  "ratburana": "ราษฎร์บูรณะ",
  "rat burana": "ราษฎร์บูรณะ",
  // Nonthaburi
  "muangnonthaburi": "เมืองนนทบุรี",
  "mueang nonthaburi": "เมืองนนทบุรี",
  "nonthaburi": "เมืองนนทบุรี",
  "pakkret": "ปากเกร็ด",
  "pak kret": "ปากเกร็ด",
  "bangbuathong": "บางบัวทอง",
  "bang bua thong": "บางบัวทอง",
  "bangyai": "บางใหญ่",
  "bang yai": "บางใหญ่",
  "bangkruai": "บางกรวย",
  "bang kruai": "บางกรวย",
  "sainoi": "ไทรน้อย",
  "sai noi": "ไทรน้อย",
  // Pathum Thani
  "muangpathumthani": "เมืองปทุมธานี",
  "mueang pathum thani": "เมืองปทุมธานี",
  "pathum thani": "เมืองปทุมธานี",
  "khlongluang": "คลองหลวง",
  "khlong luang": "คลองหลวง",
  "thanyaburi": "ธัญบุรี",
  "thanya buri": "ธัญบุรี",
  "lamlukka": "ลำลูกกา",
  "lam luk ka": "ลำลูกกา",
  "samkhok": "สามโคก",
  "sam khok": "สามโคก",
  "nongsua": "หนองเสือ",
  "nong sua": "หนองเสือ",
  "latlumkaeo": "ลาดหลุมแก้ว",
  "lat lum kaeo": "ลาดหลุมแก้ว",
  // Samut Prakan
  "muangsamutprakan": "เมืองสมุทรปราการ",
  "mueang samut prakan": "เมืองสมุทรปราการ",
  "samut prakan": "เมืองสมุทรปราการ",
  "bangphli": "บางพลี",
  "bang phli": "บางพลี",
  "bangbo": "บางบ่อ",
  "bang bo": "บางบ่อ",
  "bangsaothong": "บางเสาธง",
  "bang sao thong": "บางเสาธง",
  "phrapradaeng": "พระประแดง",
  "phra pradaeng": "พระประแดง",
  "phrasamutchedi": "พระสมุทรเจดีย์",
  "phra samut chedi": "พระสมุทรเจดีย์",
  // Others
  "kosamui": "เกาะสมุย",
  "koh samui": "เกาะสมุย",
  "samui": "เกาะสมุย",
  "huahin": "หัวหิน",
  "hua hin": "หัวหิน"
};

// Sub-districts (แขวง/ตำบล) dictionary for high precision mapping
export const SUBDISTRICT_MAP: Record<string, string> = {
  // ราชเทวี
  "มักกะสัน": "ราชเทวี",
  "ถนนเพชรบุรี": "ราชเทวี",
  "ทุ่งพญาไท": "ราชเทวี",
  "ถนนพญาไท": "ราชเทวี",
  // บางกะปิ
  "หัวหมาก": "บางกะปิ",
  "คลองจั่น": "บางกะปิ",
  // ห้วยขวาง
  "สามเสนนอก": "ห้วยขวาง",
  "ห้วยขวาง": "ห้วยขวาง",
  // วัฒนา
  "คลองเตยเหนือ": "วัฒนา",
  "คลองตันเหนือ": "วัฒนา",
  "พระโขนงเหนือ": "วัฒนา",
  // คลองเตย
  "คลองตัน": "คลองเตย",
  "พระโขนง": "คลองเตย",
  // ประเวศ
  "ดอกไม้": "ประเวศ",
  "หนองบอน": "ประเวศ",
  // สวนหลวง
  "สวนหลวง": "สวนหลวง",
  "พัฒนาการ": "สวนหลวง",
  // จตุจักร
  "จอมพล": "จตุจักร",
  "จันทรเกษม": "จตุจักร",
  "ลาดยาว": "จตุจักร",
  "เสนาคนิคม": "จตุจักร",
  // บางเขน
  "ท่าแร้ง": "บางเขน",
  "อนุสาวรีย์": "บางเขน",
  // วังทองหลาง
  "คลองเจ้าคุณสิงห์": "วังทองหลาง",
  "พลับพลา": "วังทองหลาง",
  "สะพานสอง": "วังทองหลาง",
  // ดินแดง
  "รัชดาภิเษก": "ดินแดง",
  // สาทร
  "ทุ่งมหาเมฆ": "สาทร",
  "ทุ่งวัดดอน": "สาทร",
  // ยานนาวา
  "ช่องนนทรี": "ยานนาวา",
  "บางโพงพาง": "ยานนาวา",
  // พระโขนง
  "บางจาก": "พระโขนง",
  // บางนา
  "บางนาเหนือ": "บางนา",
  "บางนาใต้": "บางนา",
  // หลักสี่
  "ทุ่งสองห้อง": "หลักสี่",
  "ตลาดบางเขน": "หลักสี่",
  // บางพลี
  "ราชาเทวะ": "บางพลี",
  "บางปลา": "บางพลี",
  "บางพลีใหญ่": "บางพลี",
  // บางเสาธง
  "เคหะบางพลี": "บางเสาธง",
  // เมืองสมุทรปราการ
  "ท้ายบ้าน": "เมืองสมุทรปราการ",
  "บางเมือง": "เมืองสมุทรปราการ",
  "แพรกษา": "เมืองสมุทรปราการ",
  "ปากน้ำ": "เมืองสมุทรปราการ",
  // ลำลูกกา
  "คูคต": "ลำลูกกา",
  "ลาดสวาย": "ลำลูกกา",
  "บึงคำพร้อย": "ลำลูกกา",
  // ธัญบุรี
  "ประชาธิปัตย์": "ธัญบุรี",
  // เมืองนนทบุรี
  "บางรักน้อย": "เมืองนนทบุรี",
  "สวนใหญ่": "เมืองนนทบุรี",
  "ตลาดขวัญ": "เมืองนนทบุรี",
  // ปทุมธานี
  "บ้านกลาง": "เมืองปทุมธานี",
  "บ้านใหม่": "เมืองปทุมธานี"
};

// Postal codes map
export const POSTAL_CODE_DISTRICT_MAP: Record<string, string[]> = {
  "10400": ["ราชเทวี", "พญาไท", "ดินแดง"],
  "10240": ["บางกะปิ"],
  "10310": ["ห้วยขวาง", "วังทองหลาง"],
  "10110": ["คลองเตย", "วัฒนา"],
  "10120": ["บางคอแหลม", "ยานนาวา", "สาทร"],
  "10140": ["ราษฎร์บูรณะ", "ทุ่งครุ"],
  "10150": ["บางขุนเทียน", "จอมทอง", "บางบอน"],
  "10160": ["บางแค", "หนองแขม", "ภาษีเจริญ"],
  "10170": ["ตลิ่งชัน", "ทวีวัฒนา", "บางพลัด", "บางกอกน้อย"],
  "10200": ["พระนคร", "ป้อมปราบศัตรูพ่าย", "สัมพันธวงศ์", "ดุสิต"],
  "10210": ["หลักสี่", "ดอนเมือง"],
  "10220": ["บางเขน", "สายไหม"],
  "10230": ["คันนายาว", "บึงกุ่ม", "ลาดพร้าว"],
  "10250": ["สวนหลวง", "ประเวศ", "สะพานสูง"],
  "10260": ["บางนา", "พระโขนง"],
  "10300": ["ดุสิต"],
  "10320": ["วังทองหลาง"],
  "10330": ["ปทุมวัน"],
  "10500": ["บางรัก"],
  "10510": ["มีนบุรี", "คลองสามวา"],
  "10520": ["ลาดกระบัง"],
  "10530": ["หนองจอก"],
  "10540": ["บางพลี"],
  "10560": ["บางบ่อ"],
  "10570": ["บางเสาธง"],
  "10600": ["ธนบุรี", "คลองสาน", "บางกอกใหญ่"],
  "11000": ["เมืองนนทบุรี"],
  "11110": ["บางบัวทอง"],
  "11120": ["ปากเกร็ด"],
  "11130": ["บางกรวย"],
  "11140": ["บางใหญ่"],
  "11150": ["ไทรน้อย"],
  "12000": ["เมืองปทุมธานี"],
  "12110": ["ธัญบุรี", "หนองเสือ"],
  "12120": ["คลองหลวง"],
  "12130": ["ธัญบุรี"],
  "12140": ["ลาดหลุมแก้ว"],
  "12150": ["ลำลูกกา"],
  "12160": ["สามโคก"],
  "10270": ["เมืองสมุทรปราการ"],
  "10280": ["เมืองสมุทรปราการ"],
  "10290": ["พระสมุทรเจดีย์"],
  "10130": ["พระประแดง"],
  "77110": ["หัวหิน"],
  "84140": ["เกาะสมุย"]
};

export const DEFAULT_TEAM_MAPPINGS: TeamMapping[] = [
  { keyword: "AFPL_MA_KT (BKK)_4T_87325_FTH,PLB", alias: "KT.1" },
  { keyword: "AFPL_MA_KT (Phra Pradaeng)_4T_87325_FTH,PLB", alias: "KT.2" },
  { keyword: "AFPL_MA_KT (Samut Prakan)_4T_87325_FTH,PLB", alias: "KT.3" },
  { keyword: "AFPL_MA_K.T. Wireless_(BKK)_4T_(EPL-Playbox)_82841_FTH", alias: "KT.4" },
  { keyword: "AFPL_MA_K.T. Wireless_(Phra Pradaeng)_4T_(EPL-Playbox)_82841_FTH", alias: "KT.5" },
  { keyword: "AFPL_MA_K.T. Wireless_(Samut Prakan)_4T_(EPL-Playbox)_82841_FTH", alias: "KT.6" },
  { keyword: "AFPL_MA_ICT_ICT Corperation (BKK)_4T_16054_82841_FTH,PLB", alias: "ICT.1" },
  { keyword: "AFPL_MA_ICT_Corperation (BKK)_4T_(EPL-Playbox)_82841_FTH", alias: "ICT.2" },
  { keyword: "AFPL_MA_บจ.ออริจิ้น ไฟเบอร์_1012905_PLB,CAP,FTH", alias: "Origin.1" },
  { keyword: "AFPL_MA_Origin Fiber (BKK)_4T_(EPL-Playbox)_1012905_FTH", alias: "Origin.2" },
  { keyword: "AFPL_MA_AFP MA Monthly_WNP (BKK)_LT_FTH,+++", alias: "AFPL_WNP+++" }
];

export const DEFAULT_IGNORED_TITLES: string[] = [
  "FTTH - L1 - (Unable to use) User Offline พบไฟ Status PON/LOS ติดสีแดง",
  "FTTH - L1 - (Unable to use) User Online แต่ใช้งานไม่ได้ ตรวจสอบพบค่า Power Low",
  "FTTH - Customer Request - ส่งช่างเข้าตรวจสอบ Mesh Home FibreLAN",
  "FTTR - L1 - (Unable to use) User Offline พบไฟ Status PON/LOS ติดสีแดง",
  "FTTH - (ใช้เฉพาะ OS Assigner) Support Heat Map",
  "FTTH - (Request) ChangePackDevice - เปลี่ยนอุปกรณ์ Special_WiFi7",
  "Fixed Line VoIP - L1 - อุปกรณ์ Router ไม่รองรับ Fixed Line",
  "FTTH - (ใช้เฉพาะ NOC) Home Wi-Fi Procare - AP Long Offline/Weak Signal Detected",
  "FTTH - (ใช้เฉพาะ NOC) Monitor 1Gbps Every Room (Mesh Fibre Optic Los)",
  "FTTH - L1 - (Customer Request) ย้ายจุดใช้งาน / ย้ายอุปกรณ์ภายในบ้านเลขที่เดิม (เก็บเงินหน้างาน)",
  "FTTH - L1 - (Customer Request) ขอ Sub เข้าเดินสาย LAN เพิ่ม (เก็บเงินหน้างาน)",
  "FTTH - (ใช้เฉพาะ OS Assigner) งานเก็บอุปกรณ์ SP L3",
  "FTTH - L1 - (Request) สายหย่อน/ไม่เป็นระเบียบ [ระบุ AIS Fibre ID ได้]",
  "FTTR - L1 - (Welve) (Unable to use) User Offline พบไฟ Status PON/LOS ติดสีแดง",
  "FTTH - L3 - Application - Website AISPLAY ดูไม่ได้/กระตุก บน Computer/Mobile Device",
  "FTTH - L3 - Application - เล่น Game online ไม่ได้/หลุดบ่อย ผ่านสัญญาณ Wi-Fi",
  "FTTR - L1 - (Unable to use) User Online แต่ใช้งานไม่ได้ ตรวจสอบพบค่า Power Low",
  "FTTH - L1 - (Unable to use) Drop optic cable ภายนอกบ้านลูกค้ามีปัญหา ขาด/หัก/เสียหาย",
  "FTTH - (ใช้เฉพาะ NOC Event Based) 1 Disconnect over criteria, Cannot reboot - IP not change",
  "FTTH - (ใช้เฉพาะ NOC Event Based) 4 Disconnect over criteria, Still disconnect - within 24 hrs after reboot",
  "FTTH - L3 - (Request) ตรวจสอบการตั้งค่ากล้อง CCTV แบบไม่ Forward Port ผ่าน Wi-Fi",
  "FTTH - ลูกค้าขอ Renew ส่งช่างไปติดตั้งอุปกรณ์ใหม่",
  "FTTH - L2 - Slow Speed - ใช้งานได้ช้า ไม่สามารถ Call Lan Sync ได้",
  "Fixed Line VoIP – L3 – โทรเข้า-รับสายไม่ได้ทุกเบอร์",
  "FTTH - Customer Request - ส่งช่างเข้าตรวจสอบ Router Net SmartBackup",
  "FTTH - L1 - (Unable to use) Drop optic cable ภายในบ้านลูกค้ามีปัญหา ขาด/หัก/เสียหาย",
  "FTTH - Proactive customer experience",
  "FTTH - (Customer Request) Home FibreLan 1Gbps ย้ายจุดใช้งาน / ย้ายอุปกรณ์ภายในบ้านเลขที่เดิม (เก็บเงินหน้างาน)",
  "FTTH – L1 - (Empowerment) ส่งช่างเข้าเดินสาย LAN",
  "FTTH - Customer Request - ส่งช่างเข้าตรวจสอบ Mesh Office FibreLAN 1Gbps",
  "FTTH - L2 - (Request) อุปกรณ์ Access point มีปัญหา ต้องการให้เจ้าหน้าที่เข้าแก้ไข",
  "FTTH - (ใช้เฉพาะ NOC Existing) Signal Quality Low - Request Indoor",
  "FTTR - L1 - (Customer Request) ขอ Sub เข้าเดินสาย LAN เพิ่ม (เก็บเงินหน้างาน)",
  "FTTR - L1 - (Request) (Account Test AWN) นิติฯโครงการขอย้ายจุดติดตั้ง",
  "FTTR - L1 - (Welve) (Unable to use) User Online แต่ใช้งานไม่ได้ ตรวจสอบพบค่า Power Low",
  "FTTH - L1 - (Request) (Account Test AWN) นิติฯ โครงการขอย้ายจุดติดตั้ง",
  "FTTH - L1 - Customer Request - Customer Complaint ติดตั้งไม่เรียบร้อย",
  "FTTH - (ใช้เฉพาะ NOC) Application - Device Performance Prove",
  "FTTR - Customer Request - ส่งช่างเข้าตรวจสอบ Mesh Home FibreLAN",
  "FTTR - (ใช้เฉพาะ NOC) Home Wi-Fi Procare - AP Long Offline/Weak Signal Detected",
  "FTTH - (Request) ChangePackDevice - เปลี่ยนอุปกรณ์ Office FibreLAN 1Gbps (2 Room)",
  "FTTR - L1 - (Unable to use) Drop optic cable ภายในบ้านลูกค้ามีปัญหา ขาด/หัก/เสียหาย",
  "FTTR - L1 - (Empowerment) ย้ายจุดติดตั้ง ONU ภายในบ้าน",
  "Fixed Line VoIP – L3 – โทรออกหรือรับสายแล้วได้ยินเสียงเงียบ",
  "FTTH - L1 - (Welve) (Unable to use) User Online แต่ใช้งานไม่ได้ ตรวจสอบพบค่า Power Low",
  "FTTR - L1 - (Request) สายหย่อน/ไม่เป็นระเบียบ [ระบุ AIS Fibre ID ได้]",
  "FTTR - L1 - (Customer Request) ย้ายจุดใช้งาน / ย้ายอุปกรณ์ภายในบ้านเลขที่เดิม (เก็บเงินหน้างาน)",
  "FTTH - (Cloud IP Camera) - L1 - Unable to Use ตัวกล้องไฟไม่เข้า/ปุ่ม Reset ไม่ตอบสนอง",
  "Fixed Line VoIP – L3 – อุปกรณ์ ATA มีปัญหา",
  "FTTH - (Cloud IP Camera) - L3 - Unable to Use ฟังก์ชั่นการทำงานกล้องผิดปกติ",
  "FTTR - L1 - (Welve) (Unable to use) Drop optic cable ภายในบ้านลูกค้ามีปัญหา ขาด/หัก/เสียหาย",
  "FTTH - L1 - (Welve) (Unable to use) User Offline พบไฟ Status PON/LOS ติดสีแดง",
  "FTTH - L1 - (Request) Campaign ขอ Empowerment ลูกค้า Nokia B1 เปลี่ยน Router หลักเป็น Super Mesh Wifi Router",
  "FTTH – L1 - (Empowerment) ย้ายจุดติดตั้ง ONU ภายในบ้าน",
  "FTTH - (ใช้เฉพาะ OS Assigner) Support Stream",
  "FTTH - (ใช้เฉพาะ OS Assigner) Support Operation FTTH",
  "FTTH - (ใช้เฉพาะ OS Assigner) Support Activity Fault MEA",
  "FTTH - L2 - Unstable - Log Smart และ LAN Loss หลุดมากกว่า 12 ครั้ง",
  "FTTH - L1 - (Empowerment) ย้ายจุดติดตั้ง ONU ภายในบ้าน",
  "FTTH - (Request) ChangePackDevice - เปลี่ยนอุปกรณ์ Home FibreLAN PLUS III หรือ MAX 2Gbps (2 Room)",
  "SOUNDBAR - L2 - กล่อง SOUNDBAR มีภาพ ไม่มีเสียง",
  "FTTR - (ใช้เฉพาะ NOC) Monitor 1Gbps Every Room (Mesh Fibre Optic Los)",
  "SOUNDBAR - L2 - กล่อง SOUNDBAR หน้าจอ TV ขึ้นไม่มีสัญญาณ",
  "FTTH - L3 - (Request) ตรวจสอบการตั้งค่า Forward Port กล้อง CCTV (ไม่ได้ใช้กับ THDDNS)",
  "FTTR - ลูกค้าขอ Renew ส่งช่างไปติดตั้งอุปกรณ์ใหม่",
  "FTTH - (ใช้เฉพาะ NOC Event Based) 3 Disconnect criteria, Cannot reboot / CPE unbind",
  "FTTH - L3 - (ใช้เฉพาะ Branch) Internet ใช้งานไม่ได้",
  "FTTR - L1 - (Empowerment) ย้ายจุดติดตั้ง Router ภายในห้อง",
  "FTTH - L3 - (Request) ตรวจสอบการตั้งค่ากล้อง CCTV แบบไม่ Forward Port ผ่านสาย LAN",
  "FTTR - Proactive customer experience",
  "FTTH - (ใช้เฉพาะ FSS) Improvement & Solution",
  "FTTR - (Last mile) (เฉพาะ NOC) ส่งติดตั้ง 4G Router ระหว่างรอแก้ไขแนวสาย Fiber Optic",
  "FTTH (FTTR) - L1 - (Unable to use) User Offline พบไฟ Status PON/LOS ติดสีแดง",
  "FTTR - L1 - Customer Request – Customer Complaint ติดตั้งไม่เรียบร้อย",
  "FTTR - (ใช้เฉพาะ NOC Event Based) 1 Disconnect over criteria, Cannot reboot - IP not change",
  "FTTR - (ใช้เฉพาะ NOC Event Based) 4 Disconnect over criteria, Still disconnect - within 24 hrs after reboot",
  "FTTR - Customer Request - ส่งช่างเข้าตรวจสอบ Router WiFi7",
  "FTTH - Customer Request - ส่งช่างเข้าตรวจสอบ Router WiFi7",
  "FTTH - (ใช้เฉพาะ FSS) Support Case VIP Group",
  "FTTH - L1 - (Customer Request) ขอ Sub เข้าดำเนินการเดินสายร้อยท่อ/เดินรางครอบสาย/เข้าหัว LAN (เก็บเงินหน้างาน)",
  "FTTH - (ใช้เฉพาะ OS Assigner) Support เก็บสายหย่อน",
  "FTTH - L3 - (ใช้เฉพาะ NOC) VIP internal - Slow Speed",
  "FTTH - (Request) ChangePackDevice - เปลี่ยนอุปกรณ์ Standard_High (with Mesh)",
  "FTTR - L1 - Customer Request – Customer Complaint ทำทรัพย์สินเสียหาย",
  "FTTH - (Request) ChangePackDevice - เปลี่ยนอุปกรณ์ Standard_High 1Gbps (with Mesh)",
  "FTTH - (Request) ChangePackDevice - เปลี่ยนอุปกรณ์ Special 1 ตัว",
  "SOUNDBAR - L1 - กล่อง SOUNDBAR ไฟไม่เข้า",
  "FTTH - L1 - (Empowerment) ส่งช่างเดินสายร้อยท่อ/underground ใหม่ (ติดสัญญา 12 เดือน)",
  "FTTH - L3 - (ใช้เฉพาะ Branch) Internet ใช้งานได้ช้า",
  "3BB GIGATV BOX - L1 - กล่อง GIGATV BOX ไม่ทำงาน (ไฟไม่ติด)",
  "FTTH - (ใช้เฉพาะ NOC) Proactive High Latency Monitoring",
  "FTTH - (ใช้เฉพาะ OS Assigner) Support ย้าย Splitter",
  "FTTH - (ใช้เฉพาะ NOC) Router Replacement",
  "FTTH - (ใช้เฉพาะทีม NOC) Engineering Reserve Time Slot",
  "3BB GIGATV App - Unable to use - ดู Live TV ไม่ได้ /หน้าจอดำ",
  "3BB GIGATV BOX - Unable to use - กล่อง GIGATV BOX ต่อผ่าน LAN หรือ WiFi แจ้งเตือนแสดง Error Code",
  "FTTH - (ใช้เฉพาะ NOC Existing) Signal Quality Low",
  "FTTH - (ใช้เฉพาะ Engineer Region) Signal Quality Low (Lastmile)",
  "FTTH - (ใช้เฉพาะ Engineer Region) ใช้งาน Internet ได้ไม่เสถียร (Disconnected)",
  "3BB GIGATV BOX - Unable to use - ดู Live TV ไม่ได้ /หน้าจอดำ",
  "3BB GIGATV BOX - Unable to use - ปัญหา GIGATV BOX WI-FI หรือ สาย LAN ขึ้นสถานะไม่เชื่อมต่อ",
  "3BB GIGATV BOX - Unstable - ดู Live TV ไม่คมชัด /สะดุด",
  "3BB GIGATV App - Unable to use - ปัญหารับชม Content VOD ไม่ได้/หน้าจอดำ/มี Error",
  "FTTH - (ใช้เฉพาะ OS Assigner) Support งานแก้ไข Repeat job",
  "FTTH - (ใช้เฉพาะทีมช่าง 3BB) เพื่อเข้าแก้ไขงานติดตั้ง/งานซ่อมไม่ได้มาตรฐาน",
  "FTTH - (3BB IP Camera) - L2 - Unable to Use - ดูกล้องไม่ได้/กล้องเชื่อม WIFI ไม่ได้",
  "FTTB - L1 - (Empowerment) ย้ายจุดติดตั้ง Router ภายในห้อง",
  "FTTH - (Request) ChangePackDevice - เปลี่ยนอุปกรณ์ Home FibreLAN PLUS (2 Room)",
  "FTTR - (Cloud IP Camera) - L3 - Unable to Use ปัญหาเชื่อมต่อผ่านสัญญาณ Wi-Fi 2.4 ไม่ได้",
  "AIS PLAYBOX - L1 - ส่งช่างเข้าเปลี่ยน Remote AIS PLAYBOX รุ่นใหม่ ปี 2022",
  "FTTH - L3 - Customer Request - ตรวจสอบการเชื่อมต่อกับ Printer",
  "FTTH - L1 - (Empowerment) ส่งช่างติดตั้งอุปกรณ์ใหม่เนื่องจากน้ำท่วม",
  "FTTR - L1 - (Empowerment) ส่งช่างติดตั้งอุปกรณ์ใหม่เนื่องจากน้ำท่วม",
  "FTTB - L1 - (Empowerment) ส่งช่างติดตั้งอุปกรณ์ใหม่เนื่องจากน้ำท่วม",
  "FTTH - L3 - (ใช้เฉพาะ Branch) Internet ใช้งานหลุดบ่อย",
  "FTTH - L1 - (Request) สายหย่อน/ไม่เป็นระเบียบ [ไม่ทราบ AIS Fibre ID-กรุงเทพฯ/ปริมณฑล]",
  "FTTH - (ใช้เฉพาะ NOC) Application - Performance Prove อุปกรณ์ 1Gbps Every Room"
];

// Sample rows including the user's test cases
export const SAMPLE_RAW_DATA: Record<string, string | number>[] = [
  {
    "Processing Status": "Scheduled",
    "Title": "FTTH - ติดตั้งอินเทอร์เน็ตความเร็วสูง",
    "Access Number": "8801928374",
    "Service Package Name": "Home Fibre 1000/500 Mbps",
    "Field Engineer": "สมชาย ใจมั่น",
    "Contract Team": "AFPL_MA_KT (BKK)_4T_87325_FTH,PLB",
    "Plan Arrival Time": "09:30:00",
    "Installation Address": "274 เดอะ มาร์ค รัชดา-แอร์พอร์ต ลิงค์ (ไฟเบอร์) - 18 Makkasan Ratchathewi Bangkok 10400"
  },
  {
    "Processing Status": "Scheduled",
    "Title": "FTTH - ตรวจสอบเราเตอร์และสัญญาณ Wi-Fi",
    "Access Number": "8802839182",
    "Service Package Name": "Broadband 500/500 Mbps",
    "Field Engineer": "สุรชัย มีสุข",
    "Contract Team": "AFPL_MA_KT (BKK)_4T_87325_FTH,PLB",
    "Plan Arrival Time": "11:15:00",
    "Installation Address": "99/4 เศรษฐสิริ กรุงเทพกรีฑา Hua Mak Bang Kapi Bangkok 10240"
  },
  {
    "Processing Status": "Prepare",
    "Title": "FTTH - เปลี่ยนอุปกรณ์ตัวลูก Mesh Wi-Fi",
    "Access Number": "8802368295",
    "Service Package Name": "Home Fibre 1000/1000 Mbps",
    "Field Engineer": "วิชัย บริการดี",
    "Contract Team": "AFPL_MA_KT (BKK)_4T_87325_FTH,PLB",
    "Plan Arrival Time": "15:00:00",
    "Installation Address": "2/135 อาคารเดอะ เน็กซ์ ลาดพร้าว 44 เอ ชั้น2 สามเสนนอก ห้วยขวาง กรุงเทพ 10310"
  },
  {
    "Processing Status": "Scheduled",
    "Title": "FTTH - ติดตั้งกล่อง AIS PLAYBOX เพิ่มเติม",
    "Access Number": "8809988333",
    "Service Package Name": "Broadband24 2000/1000 Mbps",
    "Field Engineer": "วิชัย บริการดี",
    "Contract Team": "AFPL_MA_KT (BKK)_4T_87325_FTH,PLB",
    "Plan Arrival Time": "14:00:00",
    "Installation Address": "88/5 สุขุมวิท 55 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110"
  },
  {
    "Processing Status": "Scheduled",
    "Title": "FTTH - ตรวจสอบการรับชมสัญญาณผ่านกล่อง ATV",
    "Access Number": "8809988444",
    "Service Package Name": "POWER4 Special 1500/500 Mbps",
    "Field Engineer": "นที สินทรัพย์",
    "Contract Team": "AFPL_MA_KT (BKK)_4T_87325_FTH,PLB",
    "Plan Arrival Time": "16:00:00",
    "Installation Address": "100/12 ซอยสุขุมวิท 42 แขวงพระโขนง เขตคลองเตย กรุงเทพ 10110"
  },
  {
    "Processing Status": "Scheduled",
    "Title": "FTTH - ความเร็วอินเทอร์เน็ตไม่เต็มสปีด",
    "Access Number": "8809988555",
    "Service Package Name": "Super Fibre 2000/1000 Mbps",
    "Field Engineer": "อนุชา ว่องไว",
    "Contract Team": "AFPL_MA_Origin Fiber (BKK)_4T_(EPL-Playbox)_1012905_FTH",
    "Plan Arrival Time": "11:00:00",
    "Installation Address": "15/9 ซอยลาดพร้าว 71 แขวงคลองเจ้าคุณสิงห์ เขตวังทองหลาง กรุงเทพฯ 10310"
  },
  {
    "Processing Status": "New",
    "Title": "FTTH - เดินสาย LAN ภายในบ้าน",
    "Access Number": "8809988221",
    "Service Package Name": "Broadband 500/500",
    "Field Engineer": "เกรียงไกร ชำนาญ",
    "Contract Team": "AFPL_MA_ICT_ICT Corperation (BKK)_4T_16054_82841_FTH,PLB",
    "Plan Arrival Time": "13:45:00",
    "Installation Address": "99/4 กรุงเทพกรีฑา Hua Mak Bang Kapi Bangkok 10240"
  },
  {
    "Processing Status": "Scheduled",
    "Title": "FTTH - ติดตั้ง Mesh Wi-Fi เพิ่มเติมจุดชั้น 2",
    "Access Number": "8805938271",
    "Service Package Name": "Home Fibre 1000/500",
    "Field Engineer": "ชาญชัย มั่นคง",
    "Contract Team": "AFPL_MA_AFP MA Monthly_WNP (BKK)_LT_FTH,+++",
    "Plan Arrival Time": "16:45:00",
    "Installation Address": "512 Soi Tha Raeng, Bang Khen Bangkok 10220"
  },
  {
    "Processing Status": "Scheduled",
    "Title": "FTTH - L1 - (Unable to use) User Offline พบไฟ Status PON/LOS ติดสีแดง",
    "Access Number": "8803928172",
    "Service Package Name": "Broadband 500/500",
    "Field Engineer": "ประสิทธิ์ งานไว",
    "Contract Team": "AFPL_MA_KT (BKK)_4T_87325_FTH,PLB",
    "Plan Arrival Time": "10:00:00",
    "Installation Address": "45/2 ซอยลาดพร้าว 71 แขวงคลองเจ้าคุณสิงห์ เขตวังทองหลาง กรุงเทพฯ 10310"
  },
  {
    "Processing Status": "Completed",
    "Title": "FTTH - ซ่อมแซมสาย Drop Optic แล้วเสร็จ",
    "Access Number": "8804829103",
    "Service Package Name": "Broadband 500/500",
    "Field Engineer": "อนุชา ว่องไว",
    "Contract Team": "AFPL_MA_Origin Fiber (BKK)_4T_(EPL-Playbox)_1012905_FTH",
    "Plan Arrival Time": "15:20:00",
    "Installation Address": "77/4 หมู่ 2 ตำบลคลองหลวง อำเภอคลองหลวง จังหวัดปทุมธานี 12120"
  },
  {
    "Processing Status": "Prepare",
    "Title": "FTTB - ปัญหาความเร็วอินเทอร์เน็ตคอนโดมิเนียม",
    "Access Number": "8881234567",
    "Service Package Name": "FTTB 500/500",
    "Field Engineer": "system",
    "Contract Team": "AFPL_MA_KT (BKK)_4T_87325_FTH,PLB",
    "Plan Arrival Time": "14:10:00",
    "Installation Address": "33/5 ซอยพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900"
  },
  {
    "Processing Status": "New",
    "Title": "FTTH - ตรวจสอบสัญญาณ Wi-Fi อ่อน",
    "Access Number": "8806938210",
    "Service Package Name": "Broadband 500/500",
    "Field Engineer": "นที สินทรัพย์",
    "Contract Team": "AFPL_MA_RED_TEAM_SPECIAL",
    "Plan Arrival Time": "10:15:00",
    "Installation Address": "88/19 ถนนนราธิวาสราชนครินทร์ ยานนาวา สาทร กรุงเทพฯ 10120"
  }
];
