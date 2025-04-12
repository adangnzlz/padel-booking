export type TimeSlot = `${`${8 | 9 | 1 | 2}${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`}:${"00" | "30"}`;

export type StartTime = string; // e.g. "08:00", "08:30", ..., "22:30"

export type DurationMinutes = 60 | 90 | 120;

export type CourtId = number;

export interface Reservation {
  id: string;
  courtId: CourtId;
  startTime: StartTime;
  duration: DurationMinutes;
}

export interface Court {
  id: CourtId;
  name: string;
  slots: Reservation[];
}

export interface ReservationRequest {
  startTime: StartTime;
  duration: DurationMinutes;
  courtId: CourtId;
  userId?: string;
}

export interface ReservationResult {
  success: boolean;
  courtId?: CourtId;
  message?: string;
}

export const generateTimeSlots = (): StartTime[] => {
  const slots: string[] = [];
  for (let hour = 8; hour <= 22; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    if (hour !== 22) {
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
  }
  return slots as StartTime[];
};
