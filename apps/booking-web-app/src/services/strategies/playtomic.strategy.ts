// services/strategies/playtomic.strategy.ts

import { AvailabilityStrategy } from "../availability.strategy";
import type { Court } from "@booking/types";
import type { UISlot } from "../booking.service";

export class PlaytomicAvailabilityStrategy implements AvailabilityStrategy {
  getAvailableSlots(reservations: UISlot[], courts: Court[], hours: string[]): UISlot[] {
    // Aplica aquí la lógica actual que usas para calcular slots disponibles
    return reservations.filter(slot => slot);
  }
}
