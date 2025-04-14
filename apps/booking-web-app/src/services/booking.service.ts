import {
  type Court,
  type Reservation,
  type ReservationRequest,
  type ReservationResult,
  type StartTime,
  type Slot,
  DURATION_MINUTES
} from "@booking/types";

import { courts, reservations } from "../data/data";
import { availabilityService } from "./availability.service";

// Simulación de delay de red
const simulateDelay = <T>(data: T, ms = 100): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const bookingService = {
  getCourts: async (): Promise<Court[]> => simulateDelay(courts),

  getHours: async (): Promise<StartTime[]> =>
    simulateDelay(generateTimeSlots()),

  getReservations: async (): Promise<Reservation[]> =>
    simulateDelay(reservations),

  getAvailableSlots: async (): Promise<Slot[]> => {
    const [hours, courts] = await Promise.all([
      bookingService.getHours(),
      bookingService.getCourts()
    ]);
    
    const reservations = await bookingService.getReservations();

    const allAvailableSlots = DURATION_MINUTES.flatMap(duration => {
      const slots = availabilityService.getAvailableSlots({
        reservations,
        courts,
        hours,
        durationMinutes: duration
      });
      
      return slots.map(slot => ({
        ...slot,
        courtId: slot.court.id,
        durationMinutes: duration
      }));
    });

    return allAvailableSlots;
  },

  createReservation: async (
    request: ReservationRequest
  ): Promise<ReservationResult> => {
    try {
      const newReservation: Reservation = {
        id: `res-${Date.now()}`,
        courtId: request.courtId,
        startTime: request.startTime,
        duration: request.duration,
      };

      reservations.push(newReservation);
      const court = courts.find((c) => c.id === request.courtId);
      if (court) {
        court.slots.push(newReservation);
      }

      return {
        success: true,
        courtId: request.courtId,
      };
    } catch (error) {
      return {
        success: false,
        message: "Error creating reservation",
      };
    }
  },
};

const generateTimeSlots = (): StartTime[] => {
  const start = 8; // 8:00 AM
  const end = 22; // 10:00 PM
  const slots: StartTime[] = [];

  for (let hour = start; hour <= end; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
  }

  return slots;
};
