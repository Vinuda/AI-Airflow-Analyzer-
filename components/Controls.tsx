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
    <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onToggleEditing}
          className={`px-6 py-2 rounded-full text-sm font-light tracking-wide transition-colors duration-200 text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-gray-500 ${
            isEditing
              ? 'border border-gray-400 bg-gray-800/50'
              : 'border border-gray-700 hover:border-gray-400'
          }`}
        >
          {isEditing ? 'Done Editing' : 'Edit Room'}
        </button>
        <button
          onClick={onReset}
          className="px-6 py-2 rounded-full text-sm font-light tracking-wide transition-colors border border-gray-700 text-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-gray-500"
        >
          Reset
        </button>
      </div>
      <button
        onClick={onAnalyze}
        disabled={isLoading || isEditing}
        className="w-full sm:w-auto px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-300 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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