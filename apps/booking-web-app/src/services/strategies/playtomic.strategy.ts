// services/strategies/playtomic.strategy.ts

import { IAvailabilityStrategy } from "./availability.strategy";
import type {
  Court,
  Reservation,
  HourString,
  DurationMinutes,
  Slot,
} from "@booking/types";

export class PlaytomicAvailabilityStrategy implements IAvailabilityStrategy {
  getAvailableSlots(
    reservations: Reservation[],
    courts: Court[],
    hours: HourString[],
    durationMinutes: DurationMinutes
  ): Slot[] {
    const allSlots: Slot[] = [];
    const disabledSlots = new Set<string>();

    // Generate all possible slots first
    courts.forEach((court) => {
      hours.forEach((hour, index) => {
        const durationSlots = durationMinutes / 30;
        const endSlotIndex = index + durationSlots;

        // Only create slots that fit within the hours array
        if (endSlotIndex <= hours.length) {
          const slot = {
            startTime: hour,
            duration: durationMinutes,
            court: court,
          };
          allSlots.push(slot);
        }
      });
    });

    // Mark disabled slots based on existing reservations
    reservations.forEach((reservation) => {
      const durationSlots = reservation.duration / 30;
      const startHourIndex = hours.findIndex((h) => h === reservation.startTime);

      if (startHourIndex !== -1) {
        // Mark all slots that overlap with the reservation
        for (let i = startHourIndex; i < startHourIndex + durationSlots; i++) {
          if (i < hours.length) {
            const disabledSlotId = `${reservation.courtId}-${hours[i]}`;
            disabledSlots.add(disabledSlotId);
          }
        }
      }
    });

    // Filter out disabled slots
    return allSlots.filter((slot) => {
      const durationSlots = slot.duration / 30;
      const startHourIndex = hours.findIndex((h) => h === slot.startTime);

      // Ensure the entire slot duration is available
      for (let i = startHourIndex; i < startHourIndex + durationSlots; i++) {
        if (i >= hours.length) return false; // Out of bounds
        const slotId = `${slot.court.id}-${hours[i]}`;
        if (disabledSlots.has(slotId)) return false; // Overlaps with a reservation
      }

      return true;
    });
  }
}
