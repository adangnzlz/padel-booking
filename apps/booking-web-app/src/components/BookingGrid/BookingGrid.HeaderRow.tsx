// components/BookingGrid.HeaderRow.tsx

import React from "react";
import type { Court } from "@booking/types";

interface HeaderRowProps {
  courts: Court[];
}

export default function HeaderRow({ courts }: HeaderRowProps) {
  return (
    <div className="grid grid-cols-[100px_repeat(auto-fit,minmax(160px,1fr))] border-b border-black">
      {/* Celda vacía para la columna de horas */}
      <div className="bg-blue-800 text-white font-bold flex items-center justify-center border border-black p-2">Hora</div>
      {courts.map((court) => (
        <div
          key={court.id}
          className="bg-blue-800 text-white font-bold flex items-center justify-center border border-black p-2"
        >
          {court.name}
        </div>
      ))}
    </div>
  );
}
