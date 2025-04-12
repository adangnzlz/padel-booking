// components/BookingGrid.TimeRow.tsx

import React from "react";
import type { Court, StartTime } from "@booking/types";

interface TimeRowProps {
  time: StartTime;
  courts: Court[];
  getSlot: (court: Court, time: StartTime) => { reserved: boolean; label?: string };
}

export default function TimeRow({ time, courts, getSlot }: TimeRowProps) {
  return (
    <div className="grid grid-cols-[100px_repeat(auto-fit,minmax(160px,1fr))] border-b border-black h-[30px]">
      <div className="bg-pink-400 text-black font-medium text-sm flex items-center justify-center border border-black px-1 py-0.5">
        {time}
      </div>
      {courts.map((court) => {
        const slot = getSlot(court, time);
        return (
          <div
            key={court.id}
            className={`px-1 py-0.5 border text-center font-bold border-black ${slot.reserved ? 'bg-red-200' : 'bg-white'}`}
            title={slot.label}
          >
            {slot.label}
          </div>
        );
      })}
    </div>
  );
}
