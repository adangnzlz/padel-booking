export interface BookingGridHeader {
  id: string;
  label: string;
}

export interface BookingGridCell {
  occupied: boolean;
  label?: string;
}

export interface BookingGridRow {
  time: string;
  cells: BookingGridCell[];
}

export interface BookingGridData {
  headers: BookingGridHeader[];
  rows: BookingGridRow[];
}

