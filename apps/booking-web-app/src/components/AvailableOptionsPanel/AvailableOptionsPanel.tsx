// components/AvailableOptionsPanel.tsx

import React, { useEffect, useMemo, useState } from "react";
import type { Court, Reservation, StartTime, DurationMinutes } from "@booking/types";
import Select from "../ui/Select";


interface Slot {
  startTime: StartTime;
  duration: DurationMinutes;
  court: Court;
}

interface AvailableOptionsPanelProps {
  slots: Slot[];
  onDurationChange: (duration: DurationMinutes) => void;
  onBookSlot: (courtId: number, startTime: StartTime, duration: DurationMinutes) => Promise<void>;
}

const DURATIONS: DurationMinutes[] = [60, 90, 120];

export default function AvailableOptionsPanel({
  slots,
  onDurationChange,
  onBookSlot,
}: AvailableOptionsPanelProps) {
  const [selectedCourtId, setSelectedCourtId] = useState<number | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<DurationMinutes>(90);

  const filteredSlots = useMemo(() => {
    if (selectedCourtId === null && slots.length > 0) setSelectedCourtId(slots[0].court.id);
    return slots.filter(slot => slot.court.id === selectedCourtId);
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

  const handleBookSlot = async (slot: Slot) => {
    await onBookSlot(slot.court.id, slot.startTime, slot.duration);
  };

  return (
    <div className="p-4 border rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Opciones disponibles</h2>
        <div className="flex gap-4">
          <Select
            value={selectedCourtId ?? "all"}
            onChange={handleCourtChange}
            options={[
              { value: "all", label: "Todas las pistas" },
              ...Array.from(new Set(slots.map(slot => slot.court.id))).map(
                (courtId) => ({
                  value: courtId,
                  label: slots.find(slot => slot.court.id === courtId)?.court.name || `Pista ${courtId}`
                })
              ),
            ]}
          />
          <Select
            value={selectedDuration}
            onChange={handleDurationChange}
            options={Array.from(new Set(slots.map(slot => slot.duration))).map(duration => ({ value: duration, label: `${duration} min` }))}
          />
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
              key={`${slot.startTime}-${slot.court.id}`}
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
