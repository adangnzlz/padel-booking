// components/BookingGrid.SlotCell.tsx

import type { GridCell } from "./types";

interface SlotCellProps {
  courtId: number;
  time: string;
  getSlot: (courtId: number, time: string) => GridCell | null;
}

export default function SlotCell({ courtId, time, getSlot }: SlotCellProps) {
  const slot = getSlot(courtId, time);

  return (
    <div
      className={`h-8 flex items-center justify-center border border-black text-sm ${
        slot ? "bg-gray-500 text-white" : "bg-white"
      }`}
    >
      {slot?.label ||  ""}
    </div>
  );
}
