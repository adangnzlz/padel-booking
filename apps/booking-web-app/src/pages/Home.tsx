import React, { FC, useEffect, useState } from 'react'
import BookingGrid from '../components/BookingGrid/BookingGrid'
import AvailableOptionsPanel from '../components/AvailableOptionsPanel/AvailableOptionsPanel'
import { availabilityService } from '../services/availability.context'
import { bookingService } from '../services/booking.service'
import { Court } from '@booking/types'
import { UISlot } from '../services/booking.service'

const Home: FC = () => {
  const [hours, setHours] = useState<string[]>([])
  const [courts, setCourts] = useState<Court[]>([])
  const [reservations, setReservations] = useState<UISlot[]>([])

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

  const availableSlots = availabilityService.getAvailableSlots(reservations, courts, hours)

  return (
    <div className="flex flex-row items-center justify-center min-h-screen">
      <div className="flex-1">
        <BookingGrid 
          hours={hours} 
          courts={courts} 
          reservations={reservations}
        />
      </div>

      <div className="flex-1">
        <AvailableOptionsPanel slots={availableSlots} />
      </div>
    </div>
  )
}

export default Home
