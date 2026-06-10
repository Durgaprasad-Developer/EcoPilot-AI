'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { DashboardHeader } from './components/DashboardHeader';
import { StatsPanel } from './components/StatsPanel';
import { SimpleActionsPanel } from './components/SimpleActionsPanel';
import { ActivitiesHistoryPanel } from './components/ActivitiesHistoryPanel';
import { ActivityLogger } from '../logger/ActivityLogger';

// Lazy-load Recharts heavy component to improve first page load performance
const AnalyticsPanel = dynamic(() => import('./components/AnalyticsPanel').then(m => m.AnalyticsPanel), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-50 rounded-xl animate-pulse flex items-center justify-center text-gray-400 mb-8 border border-gray-200">
      Loading Analytics...
    </div>
  )
});

/**
 * Dashboard component orchestrates isolated presentation-only sub-components driven by the useDashboardStats hook.
 */
export const Dashboard: React.FC = () => {
  const {
    user,
    activities,
    logout,
    actions,
    totalToday,
    totalSaved,
    weeklyData,
    categoryData,
    assessment,
    activeLoggingId,
    handleLogReduction
  } = useDashboardStats();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <DashboardHeader userName={user?.name} onLogout={logout} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsPanel 
          totalToday={totalToday} 
          totalSaved={totalSaved} 
          assessment={assessment} 
        />
        <div className="md:col-span-2">
          <ActivityLogger />
        </div>
      </div>

      <SimpleActionsPanel 
        actions={actions} 
        activeLoggingId={activeLoggingId} 
        onLogReduction={handleLogReduction} 
      />

      <AnalyticsPanel 
        weeklyData={weeklyData} 
        categoryData={categoryData} 
      />

      <ActivitiesHistoryPanel 
        activities={activities} 
      />
    </div>
  );
};
