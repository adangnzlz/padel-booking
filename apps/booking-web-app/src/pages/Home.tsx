import React, { FC, useEffect, useState } from 'react'
import BookingGrid from '../components/BookingGrid/BookingGrid'
import AvailableOptionsPanel from '../components/AvailableOptionsPanel/AvailableOptionsPanel'
import { availabilityService } from '../services/availability.context'
import { bookingService } from '../services/booking.service'
import type { Court, Reservation, StartTime, DurationMinutes } from '@booking/types'
import { generateTimeSlots } from '@booking/types'

const Home: FC = () => {
  const [hours, setHours] = useState<StartTime[]>([])
  const [courts, setCourts] = useState<Court[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [selectedDuration, setSelectedDuration] = useState<DurationMinutes>(90)

  const fetchData = async () => {
    const [fetchedHours, fetchedCourts, fetchedReservations] = await Promise.all([
      bookingService.getHours(),
      bookingService.getCourts(),
      bookingService.getReservations(),
    ])
    setHours(fetchedHours)
    setCourts(fetchedCourts)
    setReservations(fetchedReservations)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDurationChange = (duration: DurationMinutes) => {
    setSelectedDuration(duration);
  };

  const handleBookSlot = async (courtId: number, startTime: StartTime, duration: DurationMinutes) => {
    try {
      const result = await bookingService.createReservation({
        courtId,
        startTime,
        duration
      });
      
      if (result.success) {
        // Refresh data after successful booking
        await fetchData();
      }
    } catch (error) {
      console.error('Error booking slot:', error);
      // TODO: Add error handling UI
    }
  };

  const availableSlots = availabilityService.getAvailableSlots(reservations, courts, hours, selectedDuration)

  return (
    <div className="flex flex-row items-start min-h-screen">
      <div className="flex-1">
        <BookingGrid 
          hours={hours} 
          courts={courts} 
          reservations={reservations}
        />
      </div>

      <div className="flex-1 h-full">
        <div className="h-[calc(100vh-2rem)] overflow-y-auto">
          <AvailableOptionsPanel 
            slots={availableSlots} 
            courts={courts} 
            onDurationChange={handleDurationChange}
            onBookSlot={handleBookSlot}
          />
        </div>
      </div>
    </div>
  )
}

export default Home
