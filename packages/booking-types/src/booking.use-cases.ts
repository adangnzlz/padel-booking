import { Court, ReservationRequest, ReservationResult } from "./booking.types";
import { timeToMinutes } from "./booking.utils";

export function canReserve(court: Court, req: ReservationRequest): boolean {
  const startMins = timeToMinutes(req.start);
  const endMins = startMins + req.durationMinutes;

  const requiredSlots = court.slots.filter(slot => {
    const slotStart = timeToMinutes(slot.start);
    const slotEnd = timeToMinutes(slot.end);
    return slotStart >= startMins && slotEnd <= endMins;
  });

  if (requiredSlots.length !== req.durationMinutes / 30) return false;
  if (requiredSlots.some(slot => slot.reserved)) return false;

  // Aquí entra tu lógica de huecos:
  // Comprobar si deja un hueco de 30 min antes o después entre reservas ya existentes

  const slotIndexStart = court.slots.findIndex(s => s.start === req.start);
  const slotIndexEnd = slotIndexStart + requiredSlots.length - 1;

  const prev = court.slots[slotIndexStart - 1];
  const next = court.slots[slotIndexEnd + 1];

  // Evitar dejar hueco de 30 min entre reservas
  if (prev && !prev.reserved && (slotIndexStart - 2 < 0 || court.slots[slotIndexStart - 2].reserved)) {
    return false;
  }
  if (next && !next.reserved && (slotIndexEnd + 2 >= court.slots.length || court.slots[slotIndexEnd + 2].reserved)) {
    return false;
  }

  return true;
}

export function assignReservation(courts: Court[], req: ReservationRequest): ReservationResult {
  for (const court of courts) {
    if (canReserve(court, req)) {
      // Marcar como reservado
      const startMins = timeToMinutes(req.start);
      const endMins = startMins + req.durationMinutes;
      court.slots.forEach(slot => {
        const slotStart = timeToMinutes(slot.start);
        if (slotStart >= startMins && slotStart < endMins) {
          slot.reserved = true;
        }
      });
      return { success: true, courtId: court.id };
    }
  }
  return { success: false, message: 'No court available for the requested time' };
}
