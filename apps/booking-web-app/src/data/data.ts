import type { Court, HourString, Reservation } from "@booking/types";

// Courts data
export const courts: Court[] = [
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

// Reservations data
const rawReservations: Reservation[] = [
  // Pista 1
  {
    id: "1",
    courtId: 1,
    startTime: "10:00",
    duration: 60,
  },
  {
    id: "20",
    courtId: 1,
    startTime: "14:30",
    duration: 60,
  },
  {
    id: "16",
    courtId: 1,
    startTime: "15:30",
    duration: 60,
  },
  {
    id: "4",
    courtId: 1,
    startTime: "18:30",
    duration: 90,
  },
  {
    id: "12",
    courtId: 1,
    startTime: "20:00",
    duration: 60,
  },

  // Pista 2
  {
    id: "2",
    courtId: 2,
    startTime: "11:00",
    duration: 90,
  },
  {
    id: "9",
    courtId: 2,
    startTime: "15:00",
    duration: 90,
  },
  {
    id: "21",
    courtId: 2,
    startTime: "16:30",
    duration: 90,
  },
  {
    id: "5",
    courtId: 2,
    startTime: "18:00",
    duration: 90,
  },
  {
    id: "13",
    courtId: 2,
    startTime: "21:00",
    duration: 90,
  },

  // Pista 3
  {
    id: "6",
    courtId: 3,
    startTime: "12:00",
    duration: 60,
  },
  {
    id: "10",
    courtId: 3,
    startTime: "15:00",
    duration: 60,
  },
  {
    id: "3",
    courtId: 3,
    startTime: "16:00",
    duration: 90,
  },

  // Pista 4
  {
    id: "7",
    courtId: 4,
    startTime: "13:00",
    duration: 90,
  },
  {
    id: "11",
    courtId: 4,
    startTime: "17:00",
    duration: 90,
  },
  {
    id: "19",
    courtId: 4,
    startTime: "21:30",
    duration: 90,
  },
];

// Clean up overlapping reservations
const cleanReservations = (reservations: Reservation[]): Reservation[] => {
  const cleanReservations: Reservation[] = [];

  // Group reservations by court
  const groupedReservations = reservations.reduce((acc, curr) => {
    if (!acc[curr.courtId]) {
      acc[curr.courtId] = [];
    }
    acc[curr.courtId].push(curr);
    return acc;
  }, {} as { [key: number]: Reservation[] });

  // Process each court's reservations
  Object.values(groupedReservations).forEach((courtReservations) => {
    // Sort by start time
    courtReservations.sort((a, b) => {
      const [aHours, aMinutes] = a.startTime.split(":").map(Number);
      const [bHours, bMinutes] = b.startTime.split(":").map(Number);
      return aHours * 60 + aMinutes - (bHours * 60 + bMinutes);
    });

    // Add non-overlapping reservations
    let lastEndTime = 0;
    courtReservations.forEach((reservation) => {
      const [hours, minutes] = reservation.startTime.split(":").map(Number);
      const startTime = hours * 60 + minutes;

      if (startTime >= lastEndTime) {
        cleanReservations.push(reservation);
        lastEndTime = startTime + reservation.duration;
      }
    });
  });

  return cleanReservations;
};

// Apply cleanup
export const reservations = cleanReservations(rawReservations);

export const TIME_SLOTS: HourString[] = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
];
