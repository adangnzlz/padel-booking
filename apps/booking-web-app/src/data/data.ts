import type {
  Court,
  Reservation,
  StartTime,
} from "@booking/types";

// Helper function to check if two reservations overlap
const doReservationsOverlap = (r1: Reservation, r2: Reservation): boolean => {
  const [r1Hours, r1Minutes] = r1.startTime.split(':').map(Number);
  const [r2Hours, r2Minutes] = r2.startTime.split(':').map(Number);
  
  const r1Start = r1Hours * 60 + r1Minutes;
  const r1End = r1Start + r1.duration;
  
  const r2Start = r2Hours * 60 + r2Minutes;
  const r2End = r2Start + r2.duration;
  
  return !(r1End <= r2Start || r1Start >= r2End);
};

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
  }
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
  Object.values(groupedReservations).forEach(courtReservations => {
    // Sort by start time
    courtReservations.sort((a, b) => {
      const [aHours, aMinutes] = a.startTime.split(':').map(Number);
      const [bHours, bMinutes] = b.startTime.split(':').map(Number);
      return (aHours * 60 + aMinutes) - (bHours * 60 + bMinutes);
    });

    // Add non-overlapping reservations
    let lastEndTime = 0;
    courtReservations.forEach(reservation => {
      const [hours, minutes] = reservation.startTime.split(':').map(Number);
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
