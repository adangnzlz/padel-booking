// components/BookingGrid.TimeRow.tsx

import React from "react";
import type { Court } from "@booking/types";
import SlotCell from "./BookingGrid.SlotCell";
import { UISlot } from "../../services/booking.service";

interface TimeRowProps {
  time: string;
  courts: Court[];
  getSlot: (courtId: number, time: string) => UISlot | null;
}

export default function TimeRow({ time, courts, getSlot }: TimeRowProps) {
  return (
    <>
      <div className="bg-pink-400 text-black font-semibold flex items-center justify-center border border-black">
        {time}
      </div>
      {courts.map((court) => (
        <SlotCell key={`${court.id}-${time}`} courtId={court.id} time={time} getSlot={getSlot} />
      ))}
    </>
  );
}
