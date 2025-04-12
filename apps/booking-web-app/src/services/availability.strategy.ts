// services/availability.strategy.ts

import { Court } from "@booking/types";
import type { UISlot } from "../services/booking.service";

export interface AvailabilityStrategy {
    getAvailableSlots(reservations: UISlot[], courts: Court[], hours: string[]): UISlot[];
  }
  