import React, { FC } from 'react';
import { useBooking } from '../contexts/BookingContext';
import { Users } from 'react-feather';
import AvailableOptionsPanel from '../components/AvailableOptionsPanel/AvailableOptionsPanel';
import type { HourString, DurationMinutes } from '@booking/types';

const AvailableSlotsAdmin: FC = () => {
  const { slots, refreshData } = useBooking();

  const handleBookSlot = async (courtId: number, startTime: HourString, duration: DurationMinutes) => {
    try {
      await refreshData()
    } catch (error) {
      console.error('Error booking slot:', error);
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-1">
        <div className="flex items-center space-x-3">
          <Users className="text-2xl text-gray-600" />
          <h1 className="text-2xl font-bold">Available Slots (Admin)</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <AvailableOptionsPanel
            slots={slots}
            onBookSlot={handleBookSlot}
          />
        </div>
      </div>
    </div>
  );
};

export default AvailableSlotsAdmin;
