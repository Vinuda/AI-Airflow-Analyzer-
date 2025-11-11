
import React from 'react';
import { AirflowAnalysis } from '../types';

interface AnalysisPanelProps {
  analysis: AirflowAnalysis | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingSkeleton: React.FC = () => (
    <div className="animate-pulse space-y-4">
        <div className="h-4 bg-slate-700 rounded w-1/3"></div>
        <div className="h-3 bg-slate-700 rounded w-full"></div>
        <div className="h-3 bg-slate-700 rounded w-5/6"></div>
        <div className="h-4 bg-slate-700 rounded w-1/4 mt-6"></div>
        <div className="h-3 bg-slate-700 rounded w-full"></div>
        <div className="h-3 bg-slate-700 rounded w-full"></div>
    </div>
);

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis, isLoading, error }) => {
  return (
    <div className="bg-[#1F2937]/80 backdrop-blur-sm p-6 rounded-lg border border-slate-700 shadow-lg h-full">
      <h2 className="text-2xl font-bold text-white mb-4">AI Analysis</h2>
      
      {isLoading && <LoadingSkeleton />}
      
      {error && <p className="text-white bg-red-800/50 p-3 rounded-md border border-red-700">{error}</p>}

      {!isLoading && !error && !analysis && (
        <div className="text-center py-10 text-slate-400">
            <p>Add windows and click "Analyze Airflow" to get an AI-powered assessment of your room's ventilation.</p>
        </div>
      )}

      {analysis && (
        <div className="space-y-6 text-gray-300">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
            <p className="text-sm leading-relaxed">{analysis.description}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Optimization Tips</h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              {analysis.optimizations.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisPanel;