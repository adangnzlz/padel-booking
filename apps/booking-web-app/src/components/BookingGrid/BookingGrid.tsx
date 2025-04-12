import React from "react";
import type { Court, Reservation, StartTime } from "@booking/types";
import HeaderRow from "./BookingGrid.HeaderRow";
import TimeRow from "./BookingGrid.TimeRow";
import { getUISlot } from "./utils";

interface BookingGridProps {
  hours: StartTime[];
  courts: Court[];
  reservations: Reservation[];
}

export default function BookingGrid({ hours, courts, reservations }: BookingGridProps) {
  if (!courts.length || !hours.length) {
    return <div className="p-4">Cargando reservas...</div>;
  }

  const getSlot = getUISlot(reservations);

  return (
    <div className="p-4">
      <div className={`grid grid-cols-[100px_repeat(${courts.length},160px)] border border-black`}>
        <HeaderRow courts={courts} />
        {hours.map((time) => (
          <TimeRow key={time} time={time} courts={courts} getSlot={getSlot} />
        ))}
      </div>
    </div>
  );
}
