import React from 'react';

interface StatsPanelProps {
  totalToday: number;
  totalSaved: number;
  assessment: {
    label: string;
    color: string;
  };
}

/**
 * StatsPanel renders cards summarizing daily net footprint and total cumulative carbon saved.
 */
export const StatsPanel: React.FC<StatsPanelProps> = ({ totalToday, totalSaved, assessment }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Today's Footprint Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center items-center flex-1" role="region" aria-label="Today's Footprint Status">
        <p className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Today&apos;s Footprint</p>
        <div className="flex items-baseline space-x-2">
          <span className="text-5xl font-extrabold text-gray-900">{totalToday.toFixed(1)}</span>
          <span className="text-lg text-gray-500">kg CO₂e</span>
        </div>
        <span className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 ${assessment.color}`}>
          {assessment.label}
        </span>
      </div>

      {/* Cumulative Saved Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center items-center flex-1" role="region" aria-label="Cumulative Carbon Saved">
        <p className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Total Reduced</p>
        <div className="flex items-baseline space-x-2">
          <span className="text-5xl font-extrabold text-teal-600">{totalSaved.toFixed(1)}</span>
          <span className="text-lg text-teal-600">kg CO₂e</span>
        </div>
        <span className="mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700">
          Impact Reductions
        </span>
      </div>
    </div>
  );
};
