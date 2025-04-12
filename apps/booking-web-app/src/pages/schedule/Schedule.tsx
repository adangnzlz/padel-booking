import React, { FC, useEffect, useState } from 'react'
import BookingGrid from '../../components/BookingGrid/BookingGrid'
import { availabilityService } from '../../services/availability.context'
import { bookingService } from '../../services/booking.service'
import type { Court, Reservation, StartTime } from '@booking/types'
import { transformBookingData } from './Schedule.utils'

const Schedule: FC = () => {
  const [hours, setHours] = useState<StartTime[]>([])
  const [courts, setCourts] = useState<Court[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])

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

  const gridData = transformBookingData(courts, reservations, hours)

  return (
    <div className="flex-1">
      <BookingGrid 
        data={gridData}
      />
    </div>
  )
}

export default Schedule
