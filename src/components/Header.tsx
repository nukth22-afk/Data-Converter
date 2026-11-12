import React from 'react';
import { Database, Settings, Sparkles } from 'lucide-react';

interface HeaderProps {
  configCount: number;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ configCount, onOpenSettings }) => {
  return (
    <header className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 text-white shadow-lg border-b border-indigo-500/20 sticky top-0 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white shadow-inner">
            <Database className="w-6 h-6 text-indigo-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                ระบบแปลงและกรองข้อมูลงานดิบอัตโนมัติ
              </h1>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 text-[11px] font-semibold bg-indigo-500/50 text-indigo-100 rounded-full border border-indigo-400/30">
                PRO v2.0
              </span>
            </div>
            <p className="text-indigo-200 text-xs sm:text-sm mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span>Status: Prepare / New / Scheduled</span>
              <span className="text-indigo-400">•</span>
              <span>กรอง Package &gt; 1000 (ยกเว้น PLAYBOX / ATV)</span>
              <span className="text-indigo-400">•</span>
              <span>คำนวณ Slot &amp; Zone แม่นยำ</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSettings}
            className="group inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 active:bg-white/25 text-white text-xs sm:text-sm font-medium px-3.5 py-2 rounded-xl transition duration-150 border border-white/15 shadow-sm hover:shadow"
            title="จัดการทีมและ Title ที่ต้องการกรอง"
          >
            <Settings className="w-4 h-4 text-indigo-200 group-hover:rotate-45 transition-transform duration-300" />
            <span>จัดการทีม & Title</span>
            <span className="ml-1 px-2 py-0.5 bg-indigo-500 text-white text-[11px] font-semibold rounded-full border border-indigo-400/40">
              {configCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
