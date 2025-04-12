// components/BookingGrid.TimeRow.tsx

import React from "react";
import type { GridRow } from "./BookingGrid.types";

interface TimeRowProps {
  row: GridRow;
  isLast: boolean;
}

export default function TimeRow({ row, isLast }: TimeRowProps) {
  return (
    <div className="grid grid-cols-[100px_repeat(auto-fit,minmax(100px,1fr))] border-b border-gray-300 h-[30px]">
      <div className={`bg-pink-400 text-black font-medium text-sm flex items-center justify-center px-1 py-0.5 border-r border-gray-300 ${isLast ? 'rounded-bl-lg' : 'border-r'}`}>
        {row.time}
      </div>
      {row.cells.map((cell, index) => (
        <div
          key={index}
          className={`px-1 py-0.5 text-center font-bold ${cell.occupied ? 'bg-gray-200' : 'bg-white'} ${index === row.cells.length - 1 && isLast ? 'rounded-br-lg' : 'border-r'} border-r border-gray-300`}
          title={cell.label}
        >
          {cell.label}
        </div>
      ))}
    </div>
  );
}
