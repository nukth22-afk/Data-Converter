import React, { useState, useEffect } from 'react';
import { Settings, X, Users, ListFilter, Trash2, RotateCcw, Plus } from 'lucide-react';
import { TeamMapping } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamMappings: TeamMapping[];
  ignoredTitles: string[];
  onAddTeamMapping: (keyword: string, alias: string) => void;
  onRemoveTeamMapping: (index: number) => void;
  onAddIgnoredTitle: (title: string) => void;
  onRemoveIgnoredTitle: (index: number) => void;
  onResetToDefault: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  teamMappings,
  ignoredTitles,
  onAddTeamMapping,
  onRemoveTeamMapping,
  onAddIgnoredTitle,
  onRemoveIgnoredTitle,
  onResetToDefault,
}) => {
  const [newKeyword, setNewKeyword] = useState('');
  const [newAlias, setNewAlias] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [teamSearch, setTeamSearch] = useState('');
  const [titleSearch, setTitleSearch] = useState('');

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim() || !newAlias.trim()) {
      alert('กรุณากรอกข้อมูลให้ครบทั้ง Keyword และชื่อทีมย่อ');
      return;
    }
    onAddTeamMapping(newKeyword.trim(), newAlias.trim());
    setNewKeyword('');
    setNewAlias('');
  };

  const handleAddTitle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('กรุณากรอกข้อความ Title ที่ต้องการละเว้น');
      return;
    }
    if (ignoredTitles.includes(newTitle.trim())) {
      alert('รายการนี้มีอยู่ในระบบแล้ว');
      return;
    }
    onAddIgnoredTitle(newTitle.trim());
    setNewTitle('');
  };

  const filteredTeamMappings = teamMappings.filter(
    (tm) =>
      tm.keyword.toLowerCase().includes(teamSearch.toLowerCase()) ||
      tm.alias.toLowerCase().includes(teamSearch.toLowerCase())
  );

  const filteredIgnoredTitles = ignoredTitles.filter((t) =>
    t.toLowerCase().includes(titleSearch.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-opacity animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[88vh] border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white/10 rounded-lg">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-snug">
                จัดการข้อมูลทีม (Contract Team) และ Title
              </h3>
              <p className="text-indigo-200 text-xs">
                กำหนดการแปลงชื่อทีมย่อ และรายการ Title ที่ระบบต้องคัดกรองออก
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-indigo-200 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition"
            title="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto text-xs sm:text-sm">
          {/* Section 1: Team Mapping */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>จัดการ Mapping ชื่อทีม Contract Team ➔ ชื่อทีมย่อ</span>
                <span className="text-xs font-normal text-slate-400">({teamMappings.length} รายการ)</span>
              </h4>
              <input
                type="text"
                placeholder="ค้นหาทีม..."
                value={teamSearch}
                onChange={(e) => setTeamSearch(e.target.value)}
                className="text-xs px-2.5 py-1 border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none w-36"
              />
            </div>

            <form onSubmit={handleAddTeam} className="flex flex-wrap sm:flex-nowrap gap-2">
              <input
                type="text"
                placeholder="ข้อความใน Contract Team เช่น AFPL_MA_KT (BKK)..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="ชื่อย่อ (เช่น KT.1)..."
                value={newAlias}
                onChange={(e) => setNewAlias(e.target.value)}
                className="w-full sm:w-36 px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 justify-center shrink-0 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>เพิ่มทีม</span>
              </button>
            </form>

            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto bg-slate-50/50">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="p-2.5">Keyword ใน Contract Team</th>
                    <th className="p-2.5 w-32">ชื่อทีมย่อ</th>
                    <th className="p-2.5 w-16 text-right">ลบ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredTeamMappings.map((tm, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2.5 font-mono text-slate-700 max-w-xs truncate" title={tm.keyword}>
                        {tm.keyword}
                      </td>
                      <td className="p-2.5 font-bold text-indigo-700 bg-indigo-50/40">
                        {tm.alias}
                      </td>
                      <td className="p-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`คุณต้องการลบทีม ${tm.alias} (${tm.keyword}) ใช่หรือไม่?`)) {
                              onRemoveTeamMapping(teamMappings.indexOf(tm));
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                          title="ลบรายการนี้"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredTeamMappings.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-slate-400">
                        ไม่พบข้อมูลทีมที่ค้นหา
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Section 2: Ignored Titles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <ListFilter className="w-4 h-4 text-indigo-600" />
                <span>จัดการรายการ Title ที่ต้องการคัดกรองออก</span>
                <span className="text-xs font-normal text-slate-400">({ignoredTitles.length} รายการ)</span>
              </h4>
              <input
                type="text"
                placeholder="ค้นหา Title..."
                value={titleSearch}
                onChange={(e) => setTitleSearch(e.target.value)}
                className="text-xs px-2.5 py-1 border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none w-36"
              />
            </div>

            <form onSubmit={handleAddTitle} className="flex gap-2">
              <input
                type="text"
                placeholder="พิมพ์ข้อความ Title ที่ต้องการคัดกรองออก..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>เพิ่ม Title</span>
              </button>
            </form>

            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-52 overflow-y-auto bg-slate-50/50">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="p-2.5">ข้อความ Title ที่ถูกละเว้น</th>
                    <th className="p-2.5 w-16 text-right">ลบ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredIgnoredTitles.map((title, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-700 font-medium">{title}</td>
                      <td className="p-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`คุณต้องการลบ Title นี้ใช่หรือไม่?\n\n"${title}"`)) {
                              onRemoveIgnoredTitle(ignoredTitles.indexOf(title));
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                          title="ลบรายการนี้"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredIgnoredTitles.length === 0 && (
                    <tr>
                      <td colSpan={2} className="p-4 text-center text-slate-400">
                        ไม่พบข้อมูล Title ที่ค้นหา
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex flex-wrap gap-3 justify-between items-center text-xs">
          <button
            type="button"
            onClick={() => {
              if (confirm('คุณต้องการรีเซ็ตข้อมูล Mapping ทีม และ Title ที่ละเว้น กลับเป็นค่าเริ่มต้นใช่หรือไม่?')) {
                onResetToDefault();
              }
            }}
            className="px-3 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg font-medium transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>คืนค่าเริ่มต้น (Reset Defaults)</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 hidden sm:inline text-xs">
              💾 บันทึกข้อมูลอัตโนมัติในเบราว์เซอร์ (Local Storage)
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold transition"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
