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

      {/* Understand Section */}
      <section aria-labelledby="section-understand" className="mb-10">
        <h2 id="section-understand" className="text-xl font-bold text-gray-850 mb-4 uppercase tracking-wider border-b border-gray-200 pb-2 flex items-center justify-between">
          <span>Understand Your Footprint</span>
          <span className="text-xs font-medium text-gray-500 normal-case">Calculate, analyze, and explain daily carbon sources</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsPanel 
            totalToday={totalToday} 
            totalSaved={totalSaved} 
            assessment={assessment} 
            categoryData={categoryData}
          />
          <div className="md:col-span-2">
            <ActivityLogger />
          </div>
        </div>
      </section>

      {/* Reduce Section */}
      <section aria-labelledby="section-reduce" className="mb-10">
        <h2 id="section-reduce" className="text-xl font-bold text-gray-850 mb-4 uppercase tracking-wider border-b border-gray-200 pb-2 flex items-center justify-between">
          <span>Reduce Your Emissions</span>
          <span className="text-xs font-medium text-gray-500 normal-case">Log simple actions to offset daily carbon output</span>
        </h2>
        <SimpleActionsPanel 
          actions={actions} 
          activeLoggingId={activeLoggingId} 
          onLogReduction={handleLogReduction} 
        />
      </section>

      {/* Track Section */}
      <section aria-labelledby="section-track" className="mb-10">
        <h2 id="section-track" className="text-xl font-bold text-gray-850 mb-4 uppercase tracking-wider border-b border-gray-200 pb-2 flex items-center justify-between">
          <span>Track Your Progress</span>
          <span className="text-xs font-medium text-gray-500 normal-case">Analyze trends and patterns over time</span>
        </h2>
        <AnalyticsPanel 
          weeklyData={weeklyData} 
          categoryData={categoryData} 
        />
      </section>

      {/* Personalized AI Insights Section */}
      <section aria-labelledby="section-insights" className="mb-10">
        <h2 id="section-insights" className="text-xl font-bold text-gray-850 mb-4 uppercase tracking-wider border-b border-gray-200 pb-2 flex items-center justify-between">
          <span>Personalized AI Insights</span>
          <span className="text-xs font-medium text-gray-500 normal-case">Context-aware recommendations from your activities</span>
        </h2>
        <ActivitiesHistoryPanel 
          activities={activities} 
        />
      </section>
    </div>
  );
};
