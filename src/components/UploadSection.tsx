import React, { useRef, useState } from 'react';
import { FileSpreadsheet, UploadCloud, FileCheck, Trash2, Sparkles } from 'lucide-react';

interface UploadSectionProps {
  fileName: string | null;
  fileSizeText?: string;
  onFileLoaded: (file: File) => void;
  onClear: () => void;
  onLoadSampleData: () => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  fileName,
  fileSizeText,
  onFileLoaded,
  onClear,
  onLoadSampleData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onFileLoaded(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onFileLoaded(file);
      e.target.value = '';
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-5 sm:p-6 transition duration-200">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <label className="font-semibold text-slate-800 flex items-center gap-2.5 text-base sm:text-lg">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <span>อัปโหลดไฟล์ข้อมูลดิบ (Excel / CSV)</span>
        </label>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLoadSampleData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 border border-indigo-200 rounded-lg transition shadow-xs"
            title="ทดลองโหลดข้อมูลงานช่างจำลองเพื่อตรวจสอบผลลัพธ์ทันที"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>โหลดข้อมูลตัวอย่างเพื่อทดสอบ</span>
          </button>
          <span className="text-xs text-slate-400 hidden sm:inline">รองรับ .xlsx, .xls, .csv</span>
        </div>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 sm:p-10 text-center transition-all duration-200 cursor-pointer relative overflow-hidden ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/60 scale-[1.005]'
            : 'border-slate-300 hover:border-indigo-500 bg-slate-50/70 hover:bg-indigo-50/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx, .xls, .csv"
          className="hidden"
          onChange={handleInputChange}
        />
        <div className="flex flex-col items-center space-y-3 pointer-events-none">
          <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div>
            <div className="text-sm sm:text-base font-semibold text-slate-700">
              คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่
            </div>
            <div className="text-xs text-slate-400 mt-1">
              ระบบจะกรอง Status, คำนวณ Slot เวลา, สกัดเขตและโซน, และแปลงชื่องานอัตโนมัติ
            </div>
          </div>
        </div>
      </div>

      {fileName && (
        <div className="mt-4 p-3.5 bg-indigo-50/80 border border-indigo-100 rounded-xl text-sm text-indigo-900 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
              <FileCheck className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="font-semibold text-slate-800 truncate block">{fileName}</span>
              {fileSizeText && <span className="text-xs text-indigo-600 font-medium">{fileSizeText}</span>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs px-2.5 py-1.5 rounded-lg transition"
            title="ล้างไฟล์และข้อมูล"
          >
            <Trash2 className="w-4 h-4" />
            <span>ล้างไฟล์</span>
          </button>
        </div>
      )}
    </section>
  );
};
