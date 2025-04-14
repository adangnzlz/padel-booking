import React, { createContext, useContext, useState, useEffect } from 'react';
import { bookingService } from '../services/booking.service';
import type { Court, Reservation, HourString, DurationMinutes, Slot, BookingConfig } from '@booking/types';

interface BookingContextType {
  hours: HourString[];
  courts: Court[];
  reservations: Reservation[];
  availableDurations: DurationMinutes[];
  slots: Slot[];
  refreshData: () => Promise<void>;
  updateConfig: (config: BookingConfig) => void;
}

const defaultConfig: BookingConfig = {
  availableDurations: [60, 90, 120] as DurationMinutes[]
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode; config?: BookingConfig }> = ({ children, config = defaultConfig }) => {
  const [hours, setHours] = useState<HourString[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [availableDurations, setAvailableDurations] = useState<DurationMinutes[]>(config.availableDurations);
  const [slots, setSlots] = useState<Slot[]>([]);

  const fetchData = async () => {
    const [fetchedHours, fetchedCourts, fetchedReservations] = await Promise.all([
      bookingService.getHours(),
      bookingService.getCourts(),
      bookingService.getReservations(),
    ]);
    setHours(fetchedHours);
    setCourts(fetchedCourts);
    setReservations(fetchedReservations);
  };

  const fetchAvailableSlots = async () => {
    const slots = await bookingService.getAvailableSlots();
    setSlots(slots);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchAvailableSlots();
  }, [availableDurations, reservations]);

  const refreshData = async () => {
    await fetchData();
    await fetchAvailableSlots();
  };

  const updateConfig = (newConfig: BookingConfig) => {
    setAvailableDurations(newConfig.availableDurations);
  };

  return (
    <BookingContext.Provider
      value={{
        hours,
        courts,
        reservations,
        availableDurations,
        slots,
        refreshData,
        updateConfig,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
