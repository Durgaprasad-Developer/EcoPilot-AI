import { useState, useEffect, useCallback } from 'react';
import { extractActivitiesAction } from '../services/gemini.service';
import { useAppContext } from '../context/AppContext';

/**
 * Custom hook managing natural language activity logging logic.
 * @returns Object containing form inputs, processing states, error descriptions, and submit handler.
 */
export function useActivityLogger() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusAnnouncement, setStatusAnnouncement] = useState<string>('');
  const { addActivity } = useAppContext();

  useEffect(() => {
    if (statusAnnouncement) {
      const timer = setTimeout(() => setStatusAnnouncement(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [statusAnnouncement]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
  }, [input, addActivity]);

  return {
    input,
    setInput,
    isProcessing,
    error,
    statusAnnouncement,
    handleSubmit
  };
}
