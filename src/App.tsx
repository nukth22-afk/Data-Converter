import React, { useState, useEffect, useMemo, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { UploadSection } from './components/UploadSection';
import { TableControls } from './components/TableControls';
import { DataTable } from './components/DataTable';
import { SettingsModal } from './components/SettingsModal';
import {
  DEFAULT_TEAM_MAPPINGS,
  DEFAULT_IGNORED_TITLES,
  SAMPLE_RAW_DATA,
} from './constants/defaultData';
import { ProcessedRow, TeamMapping, CardFilterType } from './types';
import {
  processRawData,
  exportToExcelFile,
  copyTableToClipboard,
} from './utils/dataProcessor';

export default function App() {
  // 1. Settings state (with localStorage sync)
  const [teamMappings, setTeamMappings] = useState<TeamMapping[]>(() => {
    try {
      const saved = localStorage.getItem('custom_team_mappings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load team mappings from localStorage', e);
    }
    return DEFAULT_TEAM_MAPPINGS;
  });

  const [ignoredTitles, setIgnoredTitles] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('custom_ignored_titles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load ignored titles from localStorage', e);
    }
    return Array.from(new Set(DEFAULT_IGNORED_TITLES));
  });

  // Modal open/close
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 2. Data processing state
  const [rawRows, setRawRows] = useState<Record<string, unknown>[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSizeText, setFileSizeText] = useState<string>('');
  const [passedData, setPassedData] = useState<ProcessedRow[]>([]);
  const [filteredOutData, setFilteredOutData] = useState<ProcessedRow[]>([]);

  // 3. Filtering & Sorting state
  const [activeCardFilter, setActiveCardFilter] = useState<CardFilterType>('passed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof ProcessedRow | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Reprocess whenever rawRows, teamMappings, or ignoredTitles change
  const runDataProcessing = useCallback(
    (rows: Record<string, unknown>[], currentMappings = teamMappings, currentIgnored = ignoredTitles) => {
      if (rows.length === 0) {
        setPassedData([]);
        setFilteredOutData([]);
        return;
      }
      const result = processRawData(rows, currentMappings, currentIgnored);
      setPassedData(result.passed);
      setFilteredOutData(result.filteredOut);
    },
    [teamMappings, ignoredTitles]
  );

  // Effect to reprocess if settings change and there are already raw rows
  useEffect(() => {
    if (rawRows.length > 0) {
      runDataProcessing(rawRows, teamMappings, ignoredTitles);
    }
  }, [teamMappings, ignoredTitles, rawRows, runDataProcessing]);

  // Handle file select/drop
  const handleFileLoaded = (file: File) => {
    setFileName(file.name);
    const sizeKb = (file.size / 1024).toFixed(1);
    setFileSizeText(`${sizeKb} KB`);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', raw: true });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });

        if (!jsonData || jsonData.length === 0) {
          alert('ไม่พบข้อมูลในไฟล์ Excel ที่เลือก');
          return;
        }

        setRawRows(jsonData);
        runDataProcessing(jsonData);
        setActiveCardFilter('passed');
      } catch (err: unknown) {
        const error = err as Error;
        alert('เกิดข้อผิดพลาดในการอ่านไฟล์ Excel: ' + (error?.message || 'รูปแบบไฟล์ไม่ถูกต้อง'));
        console.error(err);
      }
    };
    reader.onerror = () => alert('ไม่สามารถอ่านไฟล์ได้');
    reader.readAsArrayBuffer(file);
  };

  // Load sample data
  const handleLoadSampleData = () => {
    setFileName('ข้อมูลตัวอย่าง_ระบบแปลงข้อมูลช่าง (Sample Data).xlsx');
    setFileSizeText('ตัวอย่างจำลองระบบ');
    setRawRows(SAMPLE_RAW_DATA);
    runDataProcessing(SAMPLE_RAW_DATA);
    setActiveCardFilter('passed');
  };

  // Clear data
  const handleClear = () => {
    setFileName(null);
    setFileSizeText('');
    setRawRows([]);
    setPassedData([]);
    setFilteredOutData([]);
    setActiveCardFilter('passed');
    setSearchQuery('');
    setSelectedZone('');
    setSortColumn(null);
  };

  // Sorting
  const handleSort = (columnKey: keyof ProcessedRow) => {
    if (sortColumn === columnKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  // Settings management
  const handleAddTeamMapping = (keyword: string, alias: string) => {
    const updated = [...teamMappings, { keyword, alias }];
    setTeamMappings(updated);
    try {
      localStorage.setItem('custom_team_mappings', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  };

  const handleRemoveTeamMapping = (index: number) => {
    const updated = teamMappings.filter((_, i) => i !== index);
    setTeamMappings(updated);
    try {
      localStorage.setItem('custom_team_mappings', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  };

  const handleAddIgnoredTitle = (title: string) => {
    const updated = [...ignoredTitles, title];
    setIgnoredTitles(updated);
    try {
      localStorage.setItem('custom_ignored_titles', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  };

  const handleRemoveIgnoredTitle = (index: number) => {
    const updated = ignoredTitles.filter((_, i) => i !== index);
    setIgnoredTitles(updated);
    try {
      localStorage.setItem('custom_ignored_titles', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  };

  const handleResetToDefault = () => {
    const defaultTeams = [...DEFAULT_TEAM_MAPPINGS];
    const defaultIgnored = Array.from(new Set(DEFAULT_IGNORED_TITLES));
    setTeamMappings(defaultTeams);
    setIgnoredTitles(defaultIgnored);
    try {
      localStorage.setItem('custom_team_mappings', JSON.stringify(defaultTeams));
      localStorage.setItem('custom_ignored_titles', JSON.stringify(defaultIgnored));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  };

  // Stats calculation
  const mappedCount = useMemo(() => {
    return passedData.filter((d) => d.zone !== '#N/A').length;
  }, [passedData]);

  // Determine current active dataset based on card filter
  const currentDataset = useMemo(() => {
    if (activeCardFilter === 'passed') return passedData;
    if (activeCardFilter === 'filteredOut') return filteredOutData;
    if (activeCardFilter === 'mapped') return passedData.filter((d) => d.zone !== '#N/A');
    return passedData;
  }, [activeCardFilter, passedData, filteredOutData]);

  // Apply search query, zone dropdown filter, and sorting
  const visibleRows = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    let rows = currentDataset.filter((item) => {
      const matchesSearch =
        q === '' ||
        Object.values(item).some((val) => String(val ?? '').toLowerCase().includes(q));
      const matchesZone =
        selectedZone === '' || String(item.zone) === String(selectedZone);
      return matchesSearch && matchesZone;
    });

    if (sortColumn) {
      rows = [...rows].sort((a, b) => {
        const valA = a[sortColumn] ?? '';
        const valB = b[sortColumn] ?? '';
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }
        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        if (strA < strB) return sortDirection === 'asc' ? -1 : 1;
        if (strA > strB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return rows;
  }, [currentDataset, searchQuery, selectedZone, sortColumn, sortDirection]);

  // Export handlers
  const handleExportExcel = () => {
    if (visibleRows.length === 0) {
      alert('ไม่มีข้อมูลสำหรับส่งออก');
      return;
    }
    exportToExcelFile(visibleRows, activeCardFilter);
  };

  const handleCopyTable = async () => {
    if (visibleRows.length === 0) {
      alert('ไม่มีข้อมูลสำหรับคัดลอก');
      return;
    }
    try {
      await copyTableToClipboard(visibleRows, activeCardFilter === 'filteredOut');
    } catch (err) {
      alert('คัดลอกไม่สำเร็จ: ' + (err as Error).message);
    }
  };

  const hasData = rawRows.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Prompt',sans-serif]">
      {/* 1. Header Bar */}
      <Header
        configCount={teamMappings.length + ignoredTitles.length}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* 2. Main Central Container Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 flex-1 w-full">
        {/* Stats Overview Cards */}
        <StatsCards
          totalPassed={passedData.length}
          totalFilteredOut={filteredOutData.length}
          totalMapped={mappedCount}
          activeFilter={activeCardFilter}
          onSelectFilter={(type) => setActiveCardFilter(type)}
        />

        {/* Upload Dropzone Section */}
        <UploadSection
          fileName={fileName}
          fileSizeText={fileSizeText}
          onFileLoaded={handleFileLoaded}
          onClear={handleClear}
          onLoadSampleData={handleLoadSampleData}
        />

        {/* Search, Filter & Export Controls (only shown when data exists) */}
        {hasData && (
          <TableControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedZone={selectedZone}
            onZoneChange={setSelectedZone}
            activeCardFilter={activeCardFilter}
            onResetCardFilter={() => setActiveCardFilter('passed')}
            onCopyTable={handleCopyTable}
            onExportExcel={handleExportExcel}
            hasData={visibleRows.length > 0}
          />
        )}

        {/* Data Table */}
        {hasData && (
          <DataTable
            data={visibleRows}
            totalInView={currentDataset.length}
            activeFilter={activeCardFilter}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white/50 text-slate-400 text-xs py-4 text-center">
        <div className="max-w-7xl mx-auto px-4">
          Data Mapper & Filter Pro • ระบบแปลงและกรองข้อมูลงานดิบอัตโนมัติ สำหรับทีมประสานงานและทีมช่าง
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        teamMappings={teamMappings}
        ignoredTitles={ignoredTitles}
        onAddTeamMapping={handleAddTeamMapping}
        onRemoveTeamMapping={handleRemoveTeamMapping}
        onAddIgnoredTitle={handleAddIgnoredTitle}
        onRemoveIgnoredTitle={handleRemoveIgnoredTitle}
        onResetToDefault={handleResetToDefault}
      />
    </div>
  );
}
