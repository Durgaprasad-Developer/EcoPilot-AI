import React from 'react';
import { Leaf, PlusCircle, Loader2 } from 'lucide-react';
import type { SimpleAction } from '../../../services/carbon.service';

interface SimpleActionsPanelProps {
  actions: SimpleAction[];
  activeLoggingId: string | null;
  onLogReduction: (action: SimpleAction) => Promise<void>;
}

/**
 * SimpleActionsPanel displays quick-click buttons to log negative carbon offset actions.
 */
export const SimpleActionsPanel: React.FC<SimpleActionsPanelProps> = ({
  actions,
  activeLoggingId,
  onLogReduction
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8" role="region" aria-label="Simple Actions to Reduce Emissions">
      <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
        <Leaf className="w-5 h-5 mr-2 text-teal-600" />
        Simple Daily Actions (One-Click Log)
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Select actions to instantly log carbon footprint reductions based on your sustainability goals.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {actions.map(action => {
          const isLogging = activeLoggingId === action.id;
          return (
            <button
              key={action.id}
              onClick={() => onLogReduction(action)}
              disabled={activeLoggingId !== null}
              className="flex items-center justify-between p-3.5 bg-teal-50/20 hover:bg-teal-50/60 border border-teal-100 hover:border-teal-200 rounded-xl text-left transition-all group focus:ring-2 focus:ring-teal-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Log simple action reduction: ${action.name} for category ${action.category}`}
            >
              <div className="pr-3">
                <p className="text-sm font-medium text-gray-800 group-hover:text-teal-900 transition-colors">
                  {action.name}
                </p>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                  {action.category}
                </span>
              </div>
              <div className="shrink-0 bg-teal-600 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg group-hover:scale-105 transition-transform flex items-center space-x-1">
                {isLogging ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <span>-{action.reductionAmount}</span>
                    <PlusCircle className="w-3.5 h-3.5 ml-0.5" />
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
