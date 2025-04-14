import { FC } from 'react'
import BookingGrid from '../../components/BookingGrid/BookingGrid'
import AvailableOptionsPanel from '../../components/AvailableOptionsPanel/AvailableOptionsPanel'
import { transformBookingData } from './Schedule.utils'
import { useBooking } from '../../contexts/BookingContext'
import { bookingService } from '../../services/booking.service'
import type { BookingGridData } from '../../components/BookingGrid/BookingGrid.types'
import type { HourString, DurationMinutes } from '@booking/types'

const Schedule: FC = () => {
  const { hours, courts, reservations, slots, refreshData } = useBooking()

  const gridData: BookingGridData = transformBookingData(courts, reservations, hours)

  const handleBookSlot = async (courtId: number, startTime: HourString, duration: DurationMinutes) => {
    try {
      await bookingService.createReservation({
        courtId,
        startTime,
        duration
      });
      await refreshData();
    } catch (error) {
      console.error('Error booking slot:', error);
    }
  };
  return (
    <div className="flex h-full">
      <div className="flex-1">
        <BookingGrid
          data={gridData}
        />
      </div>
      <div className="flex-1">
        <AvailableOptionsPanel
          slots={slots}
          onBookSlot={handleBookSlot}
        />
      </div>
    </div>
  )
}

export default Schedule
