import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Clock, Users, User } from 'react-feather';

const menuItems = [
  { path: '/', name: 'Schedule', icon: <Clock /> },
  { path: '/admin-slots', name: 'Available Slots (Admin)', icon: <Users /> },
  { path: '/user-slots', name: 'Available Slots (User)', icon: <User /> },
];

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <nav className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-xl font-bold mb-8">Padel Court Booking</h1>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
