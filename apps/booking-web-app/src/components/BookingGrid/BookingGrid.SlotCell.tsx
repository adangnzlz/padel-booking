// components/BookingGrid.SlotCell.tsx

import React from "react";
import { UISlot } from "../../services/booking.service";

interface SlotCellProps {
  courtId: number;
  time: string;
  getSlot: (courtId: number, time: string) => UISlot | null;
}

export default function SlotCell({ courtId, time, getSlot }: SlotCellProps) {
  const slot = getSlot(courtId, time);

  return (
    <div
      className={`h-8 flex items-center justify-center border border-black text-sm ${
        slot ? "bg-gray-500 text-white" : "bg-white"
      } ${slot?.isStart ? "font-bold" : ""}`}
    >
      {slot?.isStart ? slot.label : ""}
    </div>
  );
}
