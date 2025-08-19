import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiService from '../../services/api';

const AISummaries: React.FC = () => {
  const { data: summaries, isLoading } = useQuery({
    queryKey: ['ai-summaries'],
    queryFn: apiService.getAISummaries,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="glass-card">
        <h3 className="text-lg font-semibold text-white mb-4">AI Analysis</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-700 rounded w-5/6"></div>
          <div className="h-4 bg-slate-700 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <h3 className="text-lg font-semibold text-white mb-4">AI Analysis</h3>
      <div className="space-y-4">
        {summaries?.map((summary, index) => (
          <div key={summary.id} className="border-l-4 border-primary-500 pl-4">
            <h4 className="text-sm font-medium text-primary-400 mb-2">
              {summary.type === 'summary' && 'Threat Intelligence Summary'}
              {summary.type === 'trend' && 'Trend Analysis'}
              {summary.type === 'prediction' && 'Threat Prediction'}
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {summary.content}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-slate-500">
                Confidence: {summary.confidence}%
              </span>
              <span className="text-xs text-slate-500">
                {new Date(summary.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AISummaries;
