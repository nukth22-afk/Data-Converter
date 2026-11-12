import React, { useState } from 'react';
import { Search, RotateCcw, Copy, Download, Check } from 'lucide-react';
import { ZONE_MAP } from '../constants/defaultData';
import { CardFilterType } from '../types';

interface TableControlsProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedZone: string;
  onZoneChange: (zone: string) => void;
  activeCardFilter: CardFilterType;
  onResetCardFilter: () => void;
  onCopyTable: () => Promise<void>;
  onExportExcel: () => void;
  hasData: boolean;
}

export const TableControls: React.FC<TableControlsProps> = ({
  searchQuery,
  onSearchChange,
  selectedZone,
  onZoneChange,
  activeCardFilter,
  onResetCardFilter,
  onCopyTable,
  onExportExcel,
  hasData,
}) => {
  const [copied, setCopied] = useState(false);

  // Distinct sorted zone list
  const sortedZones = Array.from(new Set(Object.values(ZONE_MAP))).sort((a, b) => {
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return String(a).localeCompare(String(b));
  });

  const handleCopy = async () => {
    try {
      await onCopyTable();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // error handled in parent or alert
    }
  };

  return (
    <section className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
      <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ค้นหาข้อมูลทุกคอลัมน์ (ช่าง, ที่อยู่, non)..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        {/* Zone Dropdown */}
        <div className="min-w-[160px]">
          <select
            value={selectedZone}
            onChange={(e) => onZoneChange(e.target.value)}
            className="w-full py-2 px-3 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none cursor-pointer"
          >
            <option value="">-- ทุกโซน --</option>
            <option value="#N/A">-- ไม่พบโซน (#N/A) --</option>
            {sortedZones.map((z) => (
              <option key={String(z)} value={String(z)}>
                {typeof z === 'number' ? `โซน ${z}` : `เขต: ${z}`}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Card Filter button (shown when active card filter is not passed or user filtered) */}
        {activeCardFilter !== 'passed' && (
          <button
            type="button"
            onClick={onResetCardFilter}
            className="px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ล้างตัวกรองการ์ด (แสดงทั้งหมดที่ผ่าน)</span>
          </button>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={handleCopy}
          disabled={!hasData}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition flex items-center gap-1.5 border border-slate-200 shadow-xs"
          title="คัดลอกข้อมูลตารางในรูปแบบ TSV เพื่อนำไปวางลง Excel ได้ทันที"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">คัดลอกแล้ว!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-600" />
              <span>คัดลอกตาราง</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onExportExcel}
          disabled={!hasData}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-semibold shadow-sm transition flex items-center gap-1.5"
          title="ดาวน์โหลดไฟล์ข้อมูลเป็น Excel (.xlsx)"
        >
          <Download className="w-4 h-4" />
          <span>ส่งออกเป็น Excel (.xlsx)</span>
        </button>
      </div>
    </section>
  );
};
