import React from 'react';
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { stats, refreshFeeds, exportData } = useApp();

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/5 bg-dark-800/95 backdrop-blur-xl px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-slate-400 lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-white/5 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center justify-between">
          {/* Status indicators */}
          <div className="flex items-center space-x-4">
            {stats && (
              <>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm text-slate-300">
                    {stats.totalFeeds} feeds active
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-sm text-slate-300">
                    {stats.totalIOCs} IOCs detected
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`h-2 w-2 rounded-full animate-pulse ${
                    stats.threatLevel === 'CRITICAL' ? 'bg-red-500' :
                    stats.threatLevel === 'HIGH' ? 'bg-orange-500' :
                    stats.threatLevel === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <span className="text-sm text-slate-300">
                    Threat Level: {stats.threatLevel}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={refreshFeeds}
              className="btn-secondary text-sm"
            >
              Refresh Feeds
            </button>
            <button
              onClick={exportData}
              className="btn-secondary text-sm"
            >
              Export Data
            </button>
            <button className="relative p-2 text-slate-400 hover:text-white">
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
