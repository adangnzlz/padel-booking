import React from "react";
import type { GridData } from "./types";
import HeaderRow from "./BookingGrid.HeaderRow";
import TimeRow from "./BookingGrid.TimeRow";

interface BookingGridProps {
  data: GridData;
}

export default function BookingGrid({ data }: BookingGridProps) {
  if (!data.headers.length || !data.rows.length) {
    return <div className="p-4">Cargando reservas...</div>;
  }

  return (
    <div className="p-4">
      <div className={`grid grid-cols-[100px_repeat(${data.headers.length},160px)] border border-gray-200 rounded-lg`}>
        <HeaderRow headers={data.headers} />
        {data.rows.map((row, index) => (
          <TimeRow key={row.time} row={row} isLast={index === data.rows.length - 1} />
        ))}
      </div>
    </div>
  );
}
