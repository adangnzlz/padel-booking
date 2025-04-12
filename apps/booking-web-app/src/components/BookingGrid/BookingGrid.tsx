import React from "react";
import type { Court } from "@booking/types";
import { UISlot } from "../../services/booking.service";
import HeaderRow from "./BookingGrid.HeaderRow";
import TimeRow from "./BookingGrid.TimeRow";
import { getUISlot } from "./utils";

interface BookingGridProps {
  hours: string[];
  courts: Court[];
  reservations: UISlot[];
}

export default function BookingGrid({ hours, courts, reservations }: BookingGridProps) {
  if (!courts.length || !hours.length) {
    return <div className="p-4">Cargando reservas...</div>;
  }

  return (
    <div className="overflow-x-auto p-4">
      <div className={`grid grid-cols-[100px_repeat(${courts.length},160px)] border border-black`}>
        <HeaderRow courts={courts} />
        {hours.map((time) => (
          <TimeRow key={time} time={time} courts={courts} getSlot={getUISlot(reservations)} />
        ))}
      </div>
    </div>
  );
}
