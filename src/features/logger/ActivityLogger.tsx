'use client';

import React, { useState, useEffect } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { extractActivitiesAction } from '../../services/gemini.service';
import { useAppContext } from '../../context/AppContext';

/**
 * ActivityLogger captures natural language daily activity logs, extracts data using Gemini, and logs activities.
 */
export const ActivityLogger: React.FC = () => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusAnnouncement, setStatusAnnouncement] = useState<string>('');
  const { addActivity } = useAppContext();

  // Clear announcement after a few seconds
  useEffect(() => {
    if (statusAnnouncement) {
      const timer = setTimeout(() => setStatusAnnouncement(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [statusAnnouncement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);
    setError(null);
    setStatusAnnouncement("Analyzing activity description with AI...");
    
    try {
      const extraction = await extractActivitiesAction(input);
      
      for (const act of extraction.activities) {
        await addActivity({
          description: act.description,
          category: act.category,
          carbonAmount: act.estimatedCarbon,
          aiInsight: act.insight
        });
      }
      
      setInput('');
      setStatusAnnouncement("Success! Activities successfully extracted and logged.");
      
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to process activity.";
      setError(errMsg);
      setStatusAnnouncement(`Error: ${errMsg}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8" role="region" aria-label="AI Activity Input">
      {/* Screen Reader Status Announcements */}
      <div className="sr-only" aria-live="polite" role="status">
        {statusAnnouncement}
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-5 h-5 text-teal-500" />
        <h2 className="text-lg font-semibold text-gray-800">AI Activity Logger</h2>
      </div>
      
      <p className="text-sm text-gray-600 mb-4" id="logger-instructions">
        Describe what you did today in natural language. I&apos;ll automatically categorize and estimate the carbon footprint.
      </p>

      <form onSubmit={handleSubmit} className="relative">
        <label htmlFor="activity-input" className="sr-only">Describe your daily activities</label>
        <textarea
          id="activity-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., I drove 10 miles to work, had a beef burger for lunch, and bought a new t-shirt..."
          className="w-full min-h-[120px] p-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none transition-all text-gray-800"
          disabled={isProcessing}
          aria-describedby="logger-instructions"
        />
        
        <button
          type="submit"
          disabled={!input.trim() || isProcessing}
          className="absolute bottom-4 right-4 p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 outline-none"
          aria-label={isProcessing ? "Processing entry" : "Submit entry to log activities"}
        >
          {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </form>
      
      {error && (
        <div className="mt-3 text-sm text-red-500 p-3 bg-red-50 rounded-lg border border-red-100" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};
