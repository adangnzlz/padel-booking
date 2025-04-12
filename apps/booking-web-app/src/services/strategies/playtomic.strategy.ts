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
    const availableSlots: Reservation[] = [];

    courts.forEach((court) => {
      hours.forEach((hour, index) => {
        const durationSlots = durationMinutes / 30;
        const hasAvailableSlot = hours
          .slice(index, index + durationSlots)
          .every((h) =>
            reservations.every(
              (r) => r.courtId !== court.id || r.startTime !== h
            )
          );

        if (hasAvailableSlot) {
          availableSlots.push({
            id: `res-${Date.now()}`,
            courtId: court.id,
            startTime: hour,
            duration: durationMinutes,
          });
        }
      });
    });

    return availableSlots;
  }
}
