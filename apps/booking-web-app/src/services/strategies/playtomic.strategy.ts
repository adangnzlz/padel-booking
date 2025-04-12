// services/strategies/playtomic.strategy.ts

import { AvailabilityStrategy } from "../availability.strategy";
import type {
  Court,
  Reservation,
  StartTime,
  DurationMinutes,
} from "@booking/types";

export class PlaytomicAvailabilityStrategy implements AvailabilityStrategy {
  getAvailableSlots(
    reservations: Reservation[],
    courts: Court[],
    hours: StartTime[],
    durationMinutes: DurationMinutes
  ): Reservation[] {
    const allSlots: Reservation[] = [];
    const disabledSlots = new Set<string>();

    // Generate all possible slots first
    courts.forEach((court) => {
      hours.forEach((hour, index) => {
        const durationSlots = durationMinutes / 30;
        const endSlotIndex = index + durationSlots;

        // Only create slots that fit within the hours array
        if (endSlotIndex <= hours.length) {
          const slot: Reservation = {
            id: `res-${Date.now()}`,
            courtId: court.id,
            startTime: hour,
            duration: durationMinutes,
          };
          allSlots.push(slot);
        }
      });
    });

    // Mark disabled slots based on existing reservations
    reservations.forEach((reservation) => {
      const durationSlots = reservation.duration / 30;
      const startHourIndex = hours.findIndex(h => h === reservation.startTime);
      
      if (startHourIndex !== -1) {
        // Mark all slots that overlap with the reservation
        for (let i = startHourIndex; i < startHourIndex + durationSlots; i++) {
          if (i < hours.length) {
            const disabledSlotId = `res-${reservation.courtId}-${hours[i]}`;
            disabledSlots.add(disabledSlotId);
          }
        }
      }
    });

    // Filter out disabled slots
    return allSlots.filter(slot => {
      const slotId = `res-${slot.courtId}-${slot.startTime}`;
      return !disabledSlots.has(slotId);
    });
  }
}
