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
    <div className="grid grid-cols-[100px_repeat(auto-fit,minmax(100px,1fr))] border-b border-gray-200 h-[30px]">
      <div className={`bg-pink-400 text-black font-medium text-sm flex items-center justify-center px-1 py-0.5 border-r border-gray-200 ${time === "22:30" ? 'rounded-bl-lg' : 'border-r'}`}>
        {time}
      </div>
      {courts.map((court, index) => {
        const slot = getSlot(court, time);
        return (
          <div
            key={court.id}
            className={`px-1 py-0.5 text-center font-bold ${slot.reserved ? 'bg-red-200' : 'bg-white'} ${index === courts.length - 1 && time === "22:30" ? 'rounded-br-lg' : 'border-r'} border-r border-gray-200`}
            title={slot.label}
          >
            {slot.label}
          </div>
        );
      })}
    </div>
  );
}
