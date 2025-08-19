import React from 'react';
import { ThreatFeed } from '../../types';

interface RecentThreatsProps {
  feeds: ThreatFeed[];
}

const RecentThreats: React.FC<RecentThreatsProps> = ({ feeds }) => {
  const recentFeeds = feeds
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  return (
    <div className="glass-card">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Threats</h3>
      <div className="space-y-4">
        {recentFeeds.map((feed) => (
          <div key={feed.id} className="border border-slate-700 rounded-lg p-4 hover:border-primary-500/30 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-white mb-1">{feed.title}</h4>
                <p className="text-xs text-slate-400 mb-2">{feed.summary}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-500">Source: {feed.source}</span>
                  <span className={`threat-badge ${feed.severity}`}>
                    {feed.severity.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="text-xs text-slate-500 ml-4">
                {new Date(feed.timestamp).toLocaleTimeString()}
              </div>
            </div>
            {feed.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {feed.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentThreats;
