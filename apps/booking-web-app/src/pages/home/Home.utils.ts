import type { Court, Reservation, StartTime } from "@booking/types";
import type { GridData } from "../../components/BookingGrid/BookingGrid.types";

/**
 * Recibe la lista de reservas y devuelve una función que busca
 * un UISlot dado un courtId y una hora.
 */
export const getUISlot = (reservations: Reservation[]) => {
  // Helper function to get all hours
  const hours: StartTime[] = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
    "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"
  ];

  return (court: Court, time: StartTime): { reserved: boolean; label?: string } => {
    // Check if any reservation for this court includes this time
    const isPartOfReservation = reservations.some((reservation) => {
      if (reservation.courtId !== court.id) return false;

      const slotsSpanned = reservation.duration / 30;
      const reservationStartIndex = hours.indexOf(reservation.startTime);
      const reservationEndIndex = reservationStartIndex + slotsSpanned - 1;
      const currentTimeIndex = hours.indexOf(time);

      return currentTimeIndex >= reservationStartIndex && currentTimeIndex <= reservationEndIndex;
    });

    if (!isPartOfReservation) {
      return { reserved: false };
    }

    // Find the specific reservation that includes this time
    const specificReservation = reservations.find((reservation) => {
      if (reservation.courtId !== court.id) return false;

      const slotsSpanned = reservation.duration / 30;
      const reservationStartIndex = hours.indexOf(reservation.startTime);
      const reservationEndIndex = reservationStartIndex + slotsSpanned - 1;
      const currentTimeIndex = hours.indexOf(time);

      return currentTimeIndex >= reservationStartIndex && currentTimeIndex <= reservationEndIndex;
    });

    if (!specificReservation) {
      return { reserved: true };
    }

    // Only show the label in the first slot of the reservation
    const showLabel = hours.indexOf(time) === hours.indexOf(specificReservation.startTime);
    return {
      reserved: true,
      label: showLabel ? `${specificReservation.duration} min` : undefined,
    };
  };
};

/**
 * Transforma los datos de reservas en el formato necesario para el BookingGrid
 */
export const transformBookingData = (
  courts: Court[],
  reservations: Reservation[],
  hours: StartTime[]
): GridData => {
  const getSlot = getUISlot(reservations);

  const headers = courts.map((court) => ({
    id: court.id.toString(),
    label: court.name
  }));

  const rows = hours.map((time) => ({
    time,
    cells: courts.map((court) => {
      const slot = getSlot(court, time);
      return {
        occupied: slot.reserved,
        label: slot.label
      };
    })
  }));

  return {
    headers,
    rows
  };
};
