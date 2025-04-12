import type {
  Court,
  Reservation,
  ReservationRequest,
  ReservationResult,
  StartTime,
} from "@booking/types";

// Simulated data
const courts: Court[] = [
  {
    id: 1,
    name: "Pista 1",
    slots: [],
  },
  {
    id: 2,
    name: "Pista 2",
    slots: [],
  },
  {
    id: 3,
    name: "Pista 3",
    slots: [],
  },
  {
    id: 4,
    name: "Pista 4",
    slots: [],
  },
];

const reservations: Reservation[] = [
  {
    id: "1",
    courtId: 1,
    startTime: "18:00",
    duration: 90,
  },
  {
    id: "2",
    courtId: 2,
    startTime: "18:00",
    duration: 90,
  },
  {
    id: "3",
    courtId: 3,
    startTime: "19:00",
    duration: 60,
  },
  {
    id: "4",
    courtId: 4,
    startTime: "10:00",
    duration: 120,
  },
];

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
