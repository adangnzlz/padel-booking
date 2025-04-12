// services/availability.strategy.ts

import { Court } from "@booking/types";
import type { Reservation } from "@booking/types";

export interface AvailabilityStrategy {
    getAvailableSlots(reservations: Reservation[], courts: Court[], hours: string[], durationMinutes: 60 | 90 | 120): Reservation[];
  }
  