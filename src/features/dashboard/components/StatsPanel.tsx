import React from 'react';

interface StatsPanelProps {
  totalToday: number;
  totalSaved: number;
  assessment: {
    label: string;
    bgClass: string;
    textClass: string;
  };
  categoryData: Array<{ name: string; value: number }>;
}

/**
 * StatsPanel renders cards summarizing daily net footprint and total cumulative carbon saved.
 */
export const StatsPanel: React.FC<StatsPanelProps> = ({ totalToday, totalSaved, assessment, categoryData }) => {
  const totalCategoryEmissions = categoryData.reduce((sum, c) => sum + Math.max(0, c.value), 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Today's Footprint Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center items-center flex-1" role="region" aria-label="Today's Footprint Status">
        <p className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Today&apos;s Footprint</p>
        <div className="flex items-baseline space-x-2">
          <span className="text-5xl font-extrabold text-gray-900">{totalToday.toFixed(1)}</span>
          <span className="text-lg text-gray-500">kg CO₂e</span>
        </div>
        <span className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold ${assessment.bgClass} ${assessment.textClass}`}>
          {assessment.label}
        </span>

        {/* Dynamic Source Breakdown */}
        {totalCategoryEmissions > 0 && (
          <div className="w-full mt-4 border-t border-gray-100 pt-3 text-left">
            <p className="text-xs font-bold text-gray-700 mb-2">Why? Emission Sources:</p>
            <div className="space-y-1">
              {categoryData.map(c => {
                const pct = totalCategoryEmissions > 0 ? Math.round((c.value / totalCategoryEmissions) * 100) : 0;
                if (pct <= 0) return null;
                return (
                  <div key={c.name} className="flex justify-between text-[11px] text-gray-600 capitalize">
                    <span>{c.name}</span>
                    <span className="font-semibold">{pct}% ({c.value.toFixed(1)} kg)</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
