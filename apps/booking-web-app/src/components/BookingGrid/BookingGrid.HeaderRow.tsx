// components/BookingGrid.HeaderRow.tsx

import React from "react";
import type { Court } from "@booking/types";

interface HeaderRowProps {
  courts: Court[];
}

export default function HeaderRow({ courts }: HeaderRowProps) {
  return (
    <>
      {/* Celda vacía para la columna de horas */}
      <div className="bg-blue-800 text-white font-bold flex items-center justify-center border border-black" />
      {courts.map((court) => (
        <div
          key={court.id}
          className="bg-blue-800 text-white font-bold flex items-center justify-center border border-black"
        >
          {court.name}
        </div>
      ))}
    </>
  );
}
