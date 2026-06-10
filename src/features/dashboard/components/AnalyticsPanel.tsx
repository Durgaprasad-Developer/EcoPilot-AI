import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity as ActivityIcon, PieChart as PieIcon } from 'lucide-react';

import { CATEGORIES } from '../../../constants';

interface WeeklyDataPoint {
  name: string;
  amount: number;
}

interface CategoryDataPoint {
  name: string;
  value: number;
}

interface AnalyticsPanelProps {
  weeklyData: WeeklyDataPoint[];
  categoryData: CategoryDataPoint[];
}

const CHART_COLORS = {
  [CATEGORIES.TRANSPORT]: '#0ea5e9',
  [CATEGORIES.FOOD]: '#f59e0b',
  [CATEGORIES.ENERGY]: '#8b5cf6',
  [CATEGORIES.SHOPPING]: '#ec4899',
  [CATEGORIES.OTHER]: '#94a3b8'
};

/**
 * AnalyticsPanel handles charting layouts using Recharts for daily trends and category shares.
 */
export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ weeklyData, categoryData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Weekly Trend */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200" role="region" aria-label="Weekly emission trend chart">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <ActivityIcon className="w-5 h-5 mr-2 text-teal-600" />
          7-Day Trend
        </h3>
        <div className="h-64 w-full" style={{ minHeight: 250, minWidth: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
              <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="amount" fill="#0d9488" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200" role="region" aria-label="Emission sources breakdown chart">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <PieIcon className="w-5 h-5 mr-2 text-teal-600" />
          Emission Sources
        </h3>
        <div className="h-64 flex items-center justify-center w-full" style={{ minHeight: 250, minWidth: 200 }}>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[entry.name as keyof typeof CHART_COLORS] || CHART_COLORS.other} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-sm">No data yet. Log an activity!</p>
          )}
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          {categoryData.map(c => (
            <div key={c.name} className="flex items-center text-xs text-gray-600 capitalize">
              <span className="w-3 h-3 rounded-full mr-1.5" style={{backgroundColor: CHART_COLORS[c.name as keyof typeof CHART_COLORS] || CHART_COLORS.other}}></span>
              {c.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
