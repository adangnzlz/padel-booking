import type { Court } from "@booking/types";
import type { Slot } from "@booking/types";

export interface UISlot extends Slot {
    courtId: number;
    isStart: boolean;
    label?: string;
  }
  

const hours: string[] = [
    // fmt: off 
    "8:00","8:30","9:00","9:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30","23:00",
    // fmt: on
];

const mockCourts: Court[] = [1, 2, 3, 4].map((id) => ({
  id,
  name: `Pista ${id}`,
  slots: hours.map((time) => ({ start: time, end: "", reserved: false })),
}));

const mockReservations: UISlot[] = [
  {
    courtId: 2,
    start: "18:00",
    end: "19:30",
    reserved: true,
    isStart: true,
    label: "90 min",
  },
  { courtId: 2, start: "18:30", end: "20:00", reserved: true, isStart: false },
  { courtId: 2, start: "19:00", end: "20:30", reserved: true, isStart: false },
  {
    courtId: 3,
    start: "20:00",
    end: "21:00",
    reserved: true,
    isStart: true,
    label: "60 min",
  },
  {
    courtId: 1,
    start: "21:30",
    end: "22:00",
    reserved: true,
    isStart: true,
    label: "30 min",
  },
];

// Simulación de delay de red
const simulateDelay = <T>(data: T, ms = 300): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

// Servicio
export const bookingService = {
  getHours: async (): Promise<string[]> => simulateDelay(hours),
  getCourts: async (): Promise<Court[]> => simulateDelay(mockCourts),
  getReservations: async (): Promise<UISlot[]> =>
    simulateDelay(mockReservations),
};
