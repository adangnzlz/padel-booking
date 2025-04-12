// components/BookingGrid.HeaderRow.tsx

import React from "react";
import type { GridHeader } from "./BookingGrid.types";

interface HeaderRowProps {
  headers: GridHeader[];
}

export default function HeaderRow({ headers }: HeaderRowProps) {
  return (
    <div className="grid grid-cols-[100px_repeat(auto-fit,minmax(100px,1fr))] border-b border-gray-200 h-[30px]">
      <div className="bg-blue-800 text-white font-bold flex items-center justify-center rounded-tl-lg border-r border-gray-200">
        Hora
      </div>
      {headers.map((header, index) => (
        <div
          key={header.id}
          className={`bg-blue-800 text-white font-bold flex items-center justify-center ${index === headers.length - 1 ? 'rounded-tr-lg' : 'border-r'} border-r border-gray-200`}
        >
          {header.label}
        </div>
      ))}
    </div>
  );
}
