'use client';

import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Onboarding } from '../features/onboarding/Onboarding';
import { Dashboard } from '../features/dashboard/Dashboard';
import { Leaf } from 'lucide-react';

export default function Home() {
  const { user, loading, login } = useAppContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <Leaf className="w-12 h-12 text-teal-500 mb-4" />
          <p className="text-gray-500 font-medium">Loading EcoPilot AI...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <main id="main-content" className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-50 to-gray-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Leaf className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">EcoPilot AI</h1>
          <p className="text-gray-600 mb-8">Your personal AI coach for tracking and reducing your carbon footprint through actionable daily habits.</p>
          <button 
            onClick={login}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center"
            aria-label="Get Started and authenticate anonymously"
          >
            Get Started
          </button>
        </div>
      </main>
    );
  }

  if (!user.name) {
    return (
      <main id="main-content" className="min-h-screen bg-gray-50 p-4">
        <Onboarding />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-teal-650 text-white px-4 py-2 rounded-lg z-50 font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
      >
        Skip to main content
      </a>
      <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10" aria-label="Main Navigation">
        <div className="max-w-5xl mx-auto flex items-center text-teal-700 font-bold text-xl">
          <Leaf className="w-6 h-6 mr-2" />
          EcoPilot AI
        </div>
      </nav>
      <main id="main-content" tabIndex={-1} className="outline-none">
        <Dashboard />
      </main>
    </div>
  );
}
