export interface ProcessedRow {
  symtom: string;
  nonId: string;
  techName: string;
  sup: string;
  timeRaw: string;
  address: string;
  district: string;
  slot: string;
  translatedWork: string;
  team: string;
  zone: string | number;
  rejectReason?: string;
  processingStatus?: string;
  servicePackage?: string;
}

export interface TeamMapping {
  keyword: string;
  alias: string;
}

export type CardFilterType = 'passed' | 'filteredOut' | 'mapped';

export interface ColumnDef {
  key: keyof ProcessedRow;
  label: string;
  bg?: string;
  className?: string;
}
