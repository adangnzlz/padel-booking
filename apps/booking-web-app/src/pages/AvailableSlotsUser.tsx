import React from 'react';
import { User } from 'react-feather';

const AvailableSlotsUser: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <User className="text-2xl text-gray-600" />
        <h1 className="text-2xl font-bold">Available Slots (User)</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">This section will display available slots for users to book.</p>
      </div>
    </div>
  );
};

export default AvailableSlotsUser;
