
import { UISlot } from "../../services/booking.service";

/**
 * Recibe la lista de reservas y devuelve una función que busca
 * un UISlot dado un courtId y una hora.
 */
export const getUISlot = (reservations: UISlot[]) => (courtId: number, time: string): UISlot | null => {
  return reservations.find((s) => s.courtId === courtId && s.start === time) || null;
};
