// components/AvailableOptionsPanel.tsx

import React, { useMemo, useState } from "react";
import type { Court, Reservation, StartTime, DurationMinutes } from "@booking/types";

interface AvailableOptionsPanelProps {
  slots: { courtId: number; startTime: StartTime; duration: DurationMinutes }[];
  courts: Court[];
  onDurationChange: (duration: DurationMinutes) => void;
  onBookSlot: (courtId: number, startTime: StartTime, duration: DurationMinutes) => Promise<void>;
}

const DURATIONS: DurationMinutes[] = [60, 90, 120];

export default function AvailableOptionsPanel({ 
  slots, 
  courts, 
  onDurationChange,
  onBookSlot,
}: AvailableOptionsPanelProps) {
  const [selectedCourtId, setSelectedCourtId] = useState<number | null>(courts[0]?.id ?? null);
  const [selectedDuration, setSelectedDuration] = useState<DurationMinutes>(90);

  const filteredSlots = useMemo(() => {
    if (selectedCourtId === null) return slots;
    return slots.filter(slot => slot.courtId === selectedCourtId);
  }, [slots, selectedCourtId]);

  const handleCourtChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const courtId = event.target.value === "all" ? null : parseInt(event.target.value);
    setSelectedCourtId(courtId);
  };

  const handleDurationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const duration = parseInt(event.target.value) as DurationMinutes;
    setSelectedDuration(duration);
    onDurationChange(duration);
  };

  const handleBookSlot = async (slot: { courtId: number; startTime: StartTime; duration: DurationMinutes }) => {
    await onBookSlot(slot.courtId, slot.startTime, slot.duration);
  };

  return (
    <div className="p-4 border rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Opciones disponibles</h2>
        <div className="flex gap-4">
          <select
            value={selectedCourtId ?? "all"}
            onChange={handleCourtChange}
            className="border rounded-lg px-3 py-2 bg-white cursor-pointer transition-all duration-200"
          >
            <option value="all">Todas las pistas</option>
            {courts.map((court) => (
              <option key={court.id} value={court.id}>
                {court.name}
              </option>
            ))}
          </select>
          <select
            value={selectedDuration}
            onChange={handleDurationChange}
            className="border rounded-lg px-3 py-2 bg-white cursor-pointer transition-all duration-200"
          >
            {DURATIONS.map((duration) => (
              <option key={duration} value={duration}>
                {duration} min
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {filteredSlots.length === 0 ? (
        <div className="flex justify-center items-center py-8">
          <p className="text-gray-500">No hay opciones disponibles</p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-3 py-6">
          {filteredSlots.map((slot) => (
            <button
              key={`${slot.startTime}-${slot.courtId}`}
              onClick={() => handleBookSlot(slot)}
              className="inline-flex items-center px-6 py-3 min-w-[120px] rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 justify-center"
            >
              <strong className="text-base font-medium">{slot.startTime}</strong>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
