export interface GridHeader {
  id: string;
  label: string;
}

export interface GridCell {
  occupied: boolean;
  label?: string;
}

export interface GridRow {
  time: string;
  cells: GridCell[];
}

export interface GridData {
  headers: GridHeader[];
  rows: GridRow[];
}
