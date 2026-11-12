import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, SearchX } from 'lucide-react';
import { ProcessedRow, ColumnDef, CardFilterType } from '../types';

interface DataTableProps {
  data: ProcessedRow[];
  totalInView: number;
  activeFilter: CardFilterType;
  sortColumn: keyof ProcessedRow | null;
  sortDirection: 'asc' | 'desc';
  onSort: (columnKey: keyof ProcessedRow) => void;
}

const COLUMNS: ColumnDef[] = [
  { key: 'symtom', label: 'Symtom' },
  { key: 'nonId', label: 'เลข non / TT' },
  { key: 'techName', label: 'ชื่อช่าง' },
  { key: 'sup', label: 'SUP' },
  { key: 'timeRaw', label: 'เวลา' },
  { key: 'address', label: 'ที่อยู่' },
  { key: 'district', label: 'เขต' },
  { key: 'slot', label: 'SLOT', bg: 'bg-amber-50 text-amber-900' },
  { key: 'translatedWork', label: 'งาน', bg: 'bg-indigo-50 text-indigo-900' },
  { key: 'team', label: 'ทีม', bg: 'bg-blue-50 text-blue-900' },
  { key: 'zone', label: 'โซน', bg: 'bg-emerald-50 text-emerald-800' },
];

export const DataTable: React.FC<DataTableProps> = ({
  data,
  totalInView,
  activeFilter,
  sortColumn,
  sortDirection,
  onSort,
}) => {
  let viewTitle = 'กำลังแสดง: ข้อมูลที่ผ่านการกรอง (Prepare / New / Scheduled)';
  if (activeFilter === 'filteredOut') {
    viewTitle = 'กำลังแสดง: ข้อมูลที่ถูกคัดกรองออก (พร้อมสาเหตุการคัดกรอง)';
  } else if (activeFilter === 'mapped') {
    viewTitle = 'กำลังแสดง: ข้อมูลที่แมปโซนสำเร็จ';
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Table status header bar */}
      <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-200 text-xs sm:text-sm text-slate-600 flex flex-wrap justify-between items-center gap-2">
        <span className="font-semibold text-slate-700 flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              activeFilter === 'filteredOut'
                ? 'bg-rose-500'
                : activeFilter === 'mapped'
                ? 'bg-emerald-500'
                : 'bg-indigo-500'
            }`}
          ></span>
          {viewTitle}
        </span>
        <span className="text-slate-500 text-xs bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs font-mono">
          แสดง {data.length.toLocaleString()} รายการ (จากกลุ่มนี้ {totalInView.toLocaleString()} รายการ)
        </span>
      </div>

      {/* Responsive table container */}
      <div className="overflow-x-auto max-h-[640px]">
        <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[1000px]">
          <thead className="bg-slate-100/90 text-slate-700 font-semibold sticky top-0 border-b border-slate-200 z-10 backdrop-blur-xs">
            <tr>
              {COLUMNS.map((col) => {
                const isSorted = sortColumn === col.key;
                return (
                  <th
                    key={col.key}
                    onClick={() => onSort(col.key)}
                    className={`p-3 border-r border-slate-200 whitespace-nowrap cursor-pointer hover:bg-slate-200/70 transition-colors select-none ${
                      col.bg ? col.bg : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <span>{col.label}</span>
                      <span className="text-slate-400">
                        {isSorted ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-indigo-600 font-bold" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-indigo-600 font-bold" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
                        )}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-indigo-50/20 transition-colors text-xs">
                {/* Symtom */}
                <td className="p-3 font-medium border-r border-slate-100 max-w-xs">
                  {activeFilter === 'filteredOut' && row.rejectReason && (
                    <span className="inline-block text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded mr-1.5">
                      [{row.rejectReason}]
                    </span>
                  )}
                  <span className="truncate block" title={row.symtom}>
                    {row.symtom}
                  </span>
                  {row.servicePackage && (
                    <span className="inline-block text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded mt-0.5 font-mono" title={`Package: ${row.servicePackage}`}>
                      Pkg: {row.servicePackage}
                    </span>
                  )}
                </td>

                {/* เลข non / TT */}
                <td className="p-3 border-r border-slate-100 font-mono text-indigo-600 font-semibold whitespace-nowrap">
                  {row.nonId}
                </td>

                {/* ชื่อช่าง */}
                <td className="p-3 border-r border-slate-100 whitespace-nowrap text-slate-700">
                  {row.techName}
                </td>

                {/* SUP */}
                <td className="p-3 border-r border-slate-100 max-w-[200px] truncate" title={row.sup}>
                  {row.sup}
                </td>

                {/* เวลา */}
                <td className="p-3 border-r border-slate-100 font-mono text-slate-600 whitespace-nowrap">
                  {row.timeRaw}
                </td>

                {/* ที่อยู่ */}
                <td className="p-3 border-r border-slate-100 max-w-xs truncate text-slate-600" title={row.address}>
                  {row.address}
                </td>

                {/* เขต */}
                <td className="p-3 border-r border-slate-100 font-semibold text-slate-700 whitespace-nowrap">
                  {row.district}
                </td>

                {/* SLOT */}
                <td className="p-3 border-r border-slate-100 font-mono bg-amber-50/70 text-amber-900 font-bold whitespace-nowrap text-center">
                  <span className="px-2 py-0.5 rounded bg-amber-100/70 border border-amber-200">
                    {row.slot}
                  </span>
                </td>

                {/* งาน */}
                <td className="p-3 border-r border-slate-100 font-mono bg-indigo-50/60 text-indigo-800 font-semibold whitespace-nowrap">
                  {row.translatedWork}
                </td>

                {/* ทีม */}
                <td className="p-3 border-r border-slate-100 font-bold bg-blue-50/60 text-blue-800 text-center whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded bg-blue-100/70 border border-blue-200">
                    {row.team}
                  </span>
                </td>

                {/* โซน */}
                <td className="p-3 font-bold bg-emerald-50/60 text-emerald-800 text-center whitespace-nowrap">
                  <span
                    className={`px-2 py-0.5 rounded ${
                      row.zone === '#N/A'
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {row.zone}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {data.length === 0 && (
        <div className="py-16 text-center text-slate-400">
          <SearchX className="w-12 h-12 mx-auto mb-3 stroke-[1.5] text-slate-300" />
          <p className="text-base font-medium text-slate-600">ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหาหรือตัวกรอง</p>
          <p className="text-xs text-slate-400 mt-1">ลองล้างคำค้นหาหรือเปลี่ยนตัวเลือกโซน</p>
        </div>
      )}
    </section>
  );
};
