// services/availability-context.ts

import { AvailabilityStrategy } from "./availability.strategy";
import { Court, Reservation, StartTime, DurationMinutes } from "@booking/types";
import { PlaytomicAvailabilityStrategy } from "./strategies/playtomic.strategy";

let currentStrategy: AvailabilityStrategy = new PlaytomicAvailabilityStrategy();

export const availabilityService = {
  setStrategy: (strategy: AvailabilityStrategy) => {
    currentStrategy = strategy;
  },
  getAvailableSlots: (reservations: Reservation[], courts: Court[], hours: StartTime[], durationMinutes: DurationMinutes) => {
    return currentStrategy.getAvailableSlots(reservations, courts, hours, durationMinutes);
  },
};
