// services/availability.strategy.ts

import { Court } from "@booking/types";
import type { Reservation, HourString, DurationMinutes } from "@booking/types";

export interface IAvailabilityStrategy {
    getAvailableSlots(
        reservations: Reservation[],
        courts: Court[],
        hours: HourString[],
        durationMinutes: DurationMinutes
    ): {
        startTime: HourString;
        duration: DurationMinutes;
        court: Court;
    }[];
}