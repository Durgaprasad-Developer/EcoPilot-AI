import React from 'react';

interface DashboardHeaderProps {
  userName?: string;
  onLogout: () => void;
}

/**
 * DashboardHeader renders the user greeting and profile log out options.
 */
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName, onLogout }) => {
  return (
    <header className="flex justify-between items-center mb-8" role="banner">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hello, {userName}</h1>
        <p className="text-gray-600">Track and reduce your environmental impact.</p>
      </div>
      <button 
        onClick={onLogout} 
        className="text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors focus:ring-2 focus:ring-teal-500 outline-none rounded p-1"
        aria-label="Switch current user profile"
      >
        Switch Profile
      </button>
    </header>
  );
};
