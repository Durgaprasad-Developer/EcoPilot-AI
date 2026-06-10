import React from 'react';
import { format } from 'date-fns';
import { Flame, Leaf, Sparkles } from 'lucide-react';
import type { Activity } from '../../../types';

import { CATEGORIES } from '../../../constants';

interface ActivitiesHistoryPanelProps {
  activities: Activity[];
}

const COLORS = {
  [CATEGORIES.TRANSPORT]: { text: 'text-sky-700', bg: 'bg-sky-100' },
  [CATEGORIES.FOOD]: { text: 'text-amber-800', bg: 'bg-amber-100' },
  [CATEGORIES.ENERGY]: { text: 'text-purple-700', bg: 'bg-purple-100' },
  [CATEGORIES.SHOPPING]: { text: 'text-pink-700', bg: 'bg-pink-100' },
  [CATEGORIES.OTHER]: { text: 'text-slate-700', bg: 'bg-slate-100' }
};

/**
 * ActivitiesHistoryPanel renders previous actions with customized category tags and dynamic AI insights.
 */
export const ActivitiesHistoryPanel: React.FC<ActivitiesHistoryPanelProps> = ({ activities }) => {
  return (
    <div role="region" aria-label="Recent logged activities log">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Flame className="w-5 h-5 mr-2 text-orange-500" />
        Recent Activities & AI Insights
      </h3>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-xl border border-gray-200">
            <Leaf className="w-10 h-10 text-teal-200 mx-auto mb-3" />
            <p className="text-gray-500">Your journey starts here. Log your first activity above.</p>
          </div>
        ) : (
          activities.slice(0, 10).map(activity => {
            const theme = COLORS[activity.category as keyof typeof COLORS] || COLORS.other;
            return (
              <div key={activity.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-start gap-4 hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span 
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${theme.bg} ${theme.text}`}
                    >
                      {activity.category}
                    </span>
                    {activity.isReduction && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Reduction
                      </span>
                    )}
                    <span className="text-xs text-gray-500">{format(new Date(activity.date), 'MMM d, h:mm a')}</span>
                  </div>
                  <p className="text-gray-800 font-medium">{activity.description}</p>
                  {activity.aiInsight && (
                    <div className="mt-3 p-3 bg-teal-50/50 rounded-lg border border-teal-100 flex items-start space-x-2">
                      <Sparkles className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                      <p className="text-sm text-teal-800 leading-relaxed">{activity.aiInsight}</p>
                    </div>
                  )}
                </div>
                <div className="md:text-right shrink-0">
                  <span className="text-lg font-bold text-gray-900">
                    {activity.isReduction ? '-' : ''}{activity.carbonAmount}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">kg CO₂</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
