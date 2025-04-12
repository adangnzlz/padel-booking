// components/BookingGrid.HeaderRow.tsx

import React from "react";
import type { Court } from "@booking/types";

interface HeaderRowProps {
  courts: Court[];
}

export default function HeaderRow({ courts }: HeaderRowProps) {
  return (
    <div className="grid grid-cols-[100px_repeat(auto-fit,minmax(100px,1fr))] border-b border-gray-200">
      {/* Celda vacía para la columna de horas */}
      <div className="bg-blue-800 text-white font-bold flex items-center justify-center p-2 rounded-tl-lg border-r border-gray-200">Hora</div>
      {courts.map((court, index) => (
        <div
          key={court.id}
          className={`bg-blue-800 text-white font-bold flex items-center justify-center p-2 ${index === courts.length - 1 ? 'rounded-tr-lg' : 'border-r'} border-r border-gray-200`}
        >
          {court.name}
        </div>
      ))}
    </div>
  );
}
