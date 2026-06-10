'use client';

import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, subDays, isSameDay } from 'date-fns';
import { useAppContext } from '../../context/AppContext';
import { ActivityLogger } from '../logger/ActivityLogger';
import { carbonService } from '../../services/carbon.service';
import { Leaf, Flame, Activity as ActivityIcon, Sparkles } from 'lucide-react';

const COLORS = {
  transport: '#0ea5e9', // sky
  food: '#f59e0b', // amber
  energy: '#8b5cf6', // violet
  shopping: '#ec4899', // pink
  other: '#94a3b8' // slate
};

export const Dashboard = () => {
  const { user, activities, logout } = useAppContext();

  // Calculate stats
  const { totalToday, weeklyData, categoryData } = useMemo(() => {
    const today = new Date();
    
    // Today's total
    const totalToday = activities
      .filter(a => isSameDay(new Date(a.date), today))
      .reduce((sum, a) => sum + a.carbonAmount, 0);

    // Last 7 days data for bar chart
    const weeklyData = Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(today, 6 - i);
      const dayTotal = activities
        .filter(a => isSameDay(new Date(a.date), d))
        .reduce((sum, a) => sum + a.carbonAmount, 0);
      return {
        name: format(d, 'EEE'),
        amount: Number(dayTotal.toFixed(1))
      };
    });

    // Category breakdown for pie chart
    const categoryTotals = activities.reduce((acc, a) => {
      acc[a.category] = (acc[a.category] || 0) + a.carbonAmount;
      return acc;
    }, {} as Record<string, number>);
    
    const categoryData = Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(1))
    })).sort((a, b) => b.value - a.value);

    return { totalToday, weeklyData, categoryData };
  }, [activities]);

  const assessment = carbonService.getDailyAssessment(totalToday);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hello, {user?.name}</h1>
          <p className="text-gray-600">Track and reduce your environmental impact.</p>
        </div>
        <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
          Switch Profile
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Today's Score */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center items-center">
          <p className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Today&apos;s Footprint</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-5xl font-extrabold text-gray-900">{totalToday.toFixed(1)}</span>
            <span className="text-lg text-gray-500">kg CO₂e</span>
          </div>
          <span className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 ${assessment.color}`}>
            {assessment.label}
          </span>
        </div>

        {/* AI Logger Spanning 2 columns */}
        <div className="md:col-span-2">
          <ActivityLogger />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Weekly Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-teal-600" />
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
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || COLORS.other} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-sm">No data yet. Log an activity!</p>
            )}
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {categoryData.map(c => (
              <div key={c.name} className="flex items-center text-xs text-gray-600 capitalize">
                <span className="w-3 h-3 rounded-full mr-1.5" style={{backgroundColor: COLORS[c.name as keyof typeof COLORS] || COLORS.other}}></span>
                {c.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity History & AI Insights */}
      <div>
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
            activities.slice(0, 10).map(activity => (
              <div key={activity.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-start gap-4 hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize" style={{backgroundColor: `${COLORS[activity.category as keyof typeof COLORS]}20`, color: COLORS[activity.category as keyof typeof COLORS]}}>
                      {activity.category}
                    </span>
                    <span className="text-xs text-gray-400">{format(new Date(activity.date), 'MMM d, h:mm a')}</span>
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
                  <span className="text-lg font-bold text-gray-900">{activity.carbonAmount}</span>
                  <span className="text-xs text-gray-500 ml-1">kg CO₂</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
