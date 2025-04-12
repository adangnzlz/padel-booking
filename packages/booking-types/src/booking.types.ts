export type Slot = {
  start: string; // e.g. "18:00"
  end: string;   // e.g. "18:30"
  reserved: boolean;
};

export type Court = {
  id: number;
  name: string;
  slots: Slot[];
};

export type ReservationRequest = {
  start: string;
  durationMinutes: number;
};

export type ReservationResult = {
  success: boolean;
  courtId?: number;
  message?: string;
};

