
export type HourString = `${string}${":"}${"00" | "15" | "30" | "45"}`;

export const DURATION_MINUTES = [60, 90, 120] as const;
export type DurationMinutes = typeof DURATION_MINUTES[number];

export type CourtId = number;

export interface Reservation {
  id: string;
  courtId: CourtId;
  startTime: HourString;
  duration: DurationMinutes;
}

export interface Court {
  id: CourtId;
  name: string;
  slots: Reservation[];
}

export interface ReservationRequest {
  startTime: HourString;
  duration: DurationMinutes;
  courtId: CourtId;
  userId?: string;
}

export interface ReservationResult {
  success: boolean;
  courtId?: CourtId;
  message?: string;
}

export interface BookingConfig {
  availableDurations: DurationMinutes[];
}

export interface Slot {
  startTime: HourString;
  duration: DurationMinutes;
  court: Court;
}

export const generateTimeSlots = (): HourString[] => {
  const slots: string[] = [];
  for (let hour = 8; hour <= 22; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    if (hour !== 22) {
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
  }
  return slots as HourString[];
};
