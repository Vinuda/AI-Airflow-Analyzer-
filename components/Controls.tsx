import React from 'react';

interface ControlsProps {
  onAnalyze: () => void;
  isLoading: boolean;
  isEditing: boolean;
  onToggleEditing: () => void;
  onReset: () => void;
}

const Controls: React.FC<ControlsProps> = ({ onAnalyze, isLoading, isEditing, onToggleEditing, onReset }) => {
  return (
    <div className="bg-[#1F2937]/80 backdrop-blur-sm p-4 rounded-lg border border-slate-700 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onToggleEditing}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0D1117] ${
            isEditing
              ? 'bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-400'
              : 'bg-slate-700 text-slate-100 hover:bg-slate-600 focus:ring-slate-500'
          }`}
        >
          {isEditing ? 'Done Editing' : 'Edit Room Geometry'}
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-slate-700 text-slate-100 rounded-md hover:bg-slate-600 transition-colors text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-[#0D1117]"
        >
          Reset
        </button>
      </div>
      <button
        onClick={onAnalyze}
        disabled={isLoading || isEditing}
        className="w-full sm:w-auto px-6 py-3 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
          'Analyze Airflow'
        )}
      </button>
    </div>
  );
};

export default Controls;