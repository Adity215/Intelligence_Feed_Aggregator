import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from '@heroicons/react/24/solid';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend: string;
  trendUp: boolean | null; // true for up, false for down, null for neutral
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, trendUp }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-card"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
      
      <div className="flex items-center mt-4">
        {trendUp === true && (
          <ArrowUpIcon className="h-4 w-4 text-green-500" />
        )}
        {trendUp === false && (
          <ArrowDownIcon className="h-4 w-4 text-red-500" />
        )}
        {trendUp === null && (
          <MinusIcon className="h-4 w-4 text-slate-500" />
        )}
        <span className={`text-sm font-medium ml-1 ${
          trendUp === true ? 'text-green-500' :
          trendUp === false ? 'text-red-500' : 'text-slate-500'
        }`}>
          {trend}
        </span>
      </div>
    </motion.div>
  );
};

export default StatsCard;
