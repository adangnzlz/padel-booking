import { Slot } from "./booking.types";

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function generateSlots(start: string, end: string): Slot[] {
  const slots: Slot[] = [];
  let current = timeToMinutes(start);
  const endMins = timeToMinutes(end);
  while (current < endMins) {
    const slotStart = minutesToTime(current);
    const slotEnd = minutesToTime(current + 30);
    slots.push({ start: slotStart, end: slotEnd, reserved: false });
    current += 30;
  }
  return slots;
}
