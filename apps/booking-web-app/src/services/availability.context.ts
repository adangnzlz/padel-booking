// services/availability-context.ts

import { AvailabilityStrategy } from "./availability.strategy";
import { Court } from "@booking/types";
import { PlaytomicAvailabilityStrategy } from "./strategies/playtomic.strategy";
import { UISlot } from "./booking.service";

let currentStrategy: AvailabilityStrategy = new PlaytomicAvailabilityStrategy();

export const availabilityService = {
  setStrategy: (strategy: AvailabilityStrategy) => {
    currentStrategy = strategy;
  },
  getAvailableSlots: (reservations: UISlot[], courts: Court[], hours: string[]) => {
    return currentStrategy.getAvailableSlots(reservations, courts, hours);
  },
};
