import React from 'react';
import { List, FilterX, MapPin, CheckCircle2 } from 'lucide-react';
import { CardFilterType } from '../types';

interface StatsCardsProps {
  totalPassed: number;
  totalFilteredOut: number;
  totalMapped: number;
  activeFilter: CardFilterType;
  onSelectFilter: (type: CardFilterType) => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalPassed,
  totalFilteredOut,
  totalMapped,
  activeFilter,
  onSelectFilter,
}) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. ผ่านการกรอง */}
      <div
        onClick={() => onSelectFilter('passed')}
        className={`bg-white p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md flex items-center space-x-4 transform hover:-translate-y-0.5 ${
          activeFilter === 'passed'
            ? 'border-indigo-600 ring-2 ring-indigo-100 bg-indigo-50/20'
            : 'border-transparent hover:border-indigo-400'
        }`}
      >
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl flex-shrink-0 shadow-sm">
          <List className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium text-slate-500 flex items-center justify-between">
            <span>ผ่านการกรอง</span>
            <span className="text-[10px] text-indigo-500 font-semibold bg-indigo-50 px-1.5 py-0.5 rounded">คลิกดู</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 tracking-tight mt-0.5">
            {totalPassed.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 2. ถูกคัดกรองออก */}
      <div
        onClick={() => onSelectFilter('filteredOut')}
        className={`bg-white p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md flex items-center space-x-4 transform hover:-translate-y-0.5 ${
          activeFilter === 'filteredOut'
            ? 'border-red-600 ring-2 ring-red-100 bg-red-50/20'
            : 'border-transparent hover:border-red-400'
        }`}
      >
        <div className="p-3 bg-red-50 text-red-600 rounded-xl flex-shrink-0 shadow-sm">
          <FilterX className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium text-slate-500 flex items-center justify-between">
            <span>ถูกคัดกรองออก</span>
            <span className="text-[10px] text-red-500 font-semibold bg-red-50 px-1.5 py-0.5 rounded">คลิกดู</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 tracking-tight mt-0.5">
            {totalFilteredOut.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 3. แมปโซนสำเร็จ */}
      <div
        onClick={() => onSelectFilter('mapped')}
        className={`bg-white p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md flex items-center space-x-4 transform hover:-translate-y-0.5 ${
          activeFilter === 'mapped'
            ? 'border-emerald-600 ring-2 ring-emerald-100 bg-emerald-50/20'
            : 'border-transparent hover:border-emerald-400'
        }`}
      >
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl flex-shrink-0 shadow-sm">
          <MapPin className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium text-slate-500 flex items-center justify-between">
            <span>แมปโซนสำเร็จ</span>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">คลิกดู</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 tracking-tight mt-0.5">
            {totalMapped.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 4. สถานะระบบ */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl flex-shrink-0 shadow-sm">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium text-slate-500">สถานะระบบ</div>
          <div className="text-base font-semibold text-emerald-600 flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            พร้อมใช้งาน
          </div>
        </div>
      </div>
    </section>
  );
};
