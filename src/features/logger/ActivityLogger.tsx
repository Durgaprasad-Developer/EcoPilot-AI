'use client';

import React, { useState } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { extractActivitiesAction } from '../../services/gemini.service';
import { useAppContext } from '../../context/AppContext';

export const ActivityLogger = () => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addActivity } = useAppContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);
    setError(null);
    
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
      // We could also show the generalFeedback somewhere
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to process activity.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-5 h-5 text-teal-500" />
        <h2 className="text-lg font-semibold text-gray-800">AI Activity Logger</h2>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Describe what you did today in natural language. I&apos;ll automatically categorize and estimate the carbon footprint.
      </p>

      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., I drove 10 miles to work, had a beef burger for lunch, and bought a new t-shirt..."
          className="w-full min-h-[120px] p-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none transition-all"
          disabled={isProcessing}
        />
        
        <button
          type="submit"
          disabled={!input.trim() || isProcessing}
          className="absolute bottom-4 right-4 p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          aria-label="Log activities"
        >
          {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </form>
      
      {error && (
        <div className="mt-3 text-sm text-red-500 p-3 bg-red-50 rounded-lg border border-red-100">
          {error}
        </div>
      )}
    </div>
  );
};
