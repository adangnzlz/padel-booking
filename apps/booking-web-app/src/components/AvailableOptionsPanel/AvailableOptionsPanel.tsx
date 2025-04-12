// components/AvailableOptionsPanel.tsx

import { UISlot } from "@booking/web/services/booking.service";
import React, { useMemo } from "react";

interface AvailableOptionsPanelProps {
    slots: UISlot[];
}

const DURATIONS = [60, 90, 120];

export default function AvailableOptionsPanel({ slots }: AvailableOptionsPanelProps) {


    return (
        <div className="p-4 border rounded">
            <h2 className="text-lg font-bold mb-2">Opciones disponibles</h2>
            {slots.map((slot) => (
                <div key={slot.start} className="mb-2">
                    <strong>{slot.start}</strong>
                    <ul className="ml-4 list-disc">
                        {slot.courtId}
                    </ul>
                </div>
            ))}
        </div>
    );
}
