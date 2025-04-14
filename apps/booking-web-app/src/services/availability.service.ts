// services/availability-context.ts

import { IAvailabilityStrategy } from "./strategies/availability.strategy";
import { Court, Reservation, HourString, DurationMinutes } from "@booking/types";
import { PlaytomicAvailabilityStrategy } from "./strategies/playtomic.strategy";

interface AvailabilityRequest {
  reservations: Reservation[];
  courts: Court[];
  hours: HourString[];
  durationMinutes: DurationMinutes;
}

let defaultStrategy: IAvailabilityStrategy = new PlaytomicAvailabilityStrategy();

export const availabilityService = {
  setStrategy: (strategy: IAvailabilityStrategy) => {
    defaultStrategy = strategy;
  },
  getAvailableSlots: (
    request: AvailabilityRequest,
    strategy: IAvailabilityStrategy = defaultStrategy
  ) => {
    return strategy.getAvailableSlots(
      request.reservations,
      request.courts,
      request.hours,
      request.durationMinutes
    );
  },
};
