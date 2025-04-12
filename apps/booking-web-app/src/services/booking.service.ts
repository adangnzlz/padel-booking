import type {
  Court,
  Reservation,
  ReservationRequest,
  ReservationResult,
  StartTime,
} from "@booking/types";

import { courts, reservations } from "../data/data";

// Simulación de delay de red
const simulateDelay = <T>(data: T, ms = 300): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const bookingService = {
  getCourts: async (): Promise<Court[]> => simulateDelay(courts),

  getHours: async (): Promise<StartTime[]> =>
    simulateDelay(generateTimeSlots()),

  getReservations: async (): Promise<Reservation[]> =>
    simulateDelay(reservations),

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

export const generateTimeSlots = (): StartTime[] => {
  const slots: string[] = [];
  for (let hour = 8; hour < 23; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    slots.push(`${hour.toString().padStart(2, "0")}:30`);
  }
  return slots as StartTime[];
};
