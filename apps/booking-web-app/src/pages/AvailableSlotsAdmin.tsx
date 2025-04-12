import React, { FC, useEffect, useState } from 'react';
import { Users } from 'react-feather';
import AvailableOptionsPanel from '../components/AvailableOptionsPanel/AvailableOptionsPanel';
import { availabilityService } from '../services/availability.context';
import { bookingService } from '../services/booking.service';
import type { Court, Reservation, StartTime, DurationMinutes } from '@booking/types';

const AvailableSlotsAdmin: FC = () => {
  const [hours, setHours] = useState<StartTime[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<DurationMinutes>(90);

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

  useEffect(() => {
    fetchData();
  }, []);

  const handleDurationChange = (duration: DurationMinutes) => {
    setSelectedDuration(duration);
  };

  const handleBookSlot = async (courtId: number, startTime: StartTime, duration: DurationMinutes) => {
    try {
      const result = await bookingService.createReservation({
        courtId,
        startTime,
        duration,
      });
      
      if (result.success) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error booking slot:', error);
    }
  };

  const availableSlots = availabilityService.getAvailableSlots(reservations, courts, hours, selectedDuration);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Users className="text-2xl text-gray-600" />
        <h1 className="text-2xl font-bold">Available Slots (Admin)</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <AvailableOptionsPanel
          slots={availableSlots}
          courts={courts}
          onDurationChange={handleDurationChange}
          onBookSlot={handleBookSlot}
        />
      </div>
    </div>
  );
};

export default AvailableSlotsAdmin;
