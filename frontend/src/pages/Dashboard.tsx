import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import StatsCard from '../components/Dashboard/StatsCard';
import RecentThreats from '../components/Dashboard/RecentThreats';
import ThreatChart from '../components/Dashboard/ThreatChart';
import AISummaries from '../components/Dashboard/AISummaries';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Dashboard: React.FC = () => {
  const { stats, feeds, iocs, loading } = useApp();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gradient">Threat Intelligence Dashboard</h1>
        <p className="text-slate-400 mt-2">
          Real-time monitoring and analysis of cybersecurity threats
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatsCard
          title="Total Feeds"
          value={stats?.totalFeeds || 0}
          icon="📡"
          trend="+12%"
          trendUp={true}
        />
        <StatsCard
          title="IOCs Detected"
          value={stats?.totalIOCs || 0}
          icon="🎯"
          trend="+8%"
          trendUp={true}
        />
        <StatsCard
          title="High Priority"
          value={stats?.highPriorityThreats || 0}
          icon="⚠️"
          trend="-5%"
          trendUp={false}
        />
        <StatsCard
          title="Threat Level"
          value={stats?.threatLevel || 'LOW'}
          icon="🛡️"
          trend="Stable"
          trendUp={null}
        />
      </motion.div>

      {/* Charts and Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <ThreatChart feeds={feeds} />
        </motion.div>

        {/* AI Summaries */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <AISummaries />
        </motion.div>
      </div>

      {/* Recent Threats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <RecentThreats feeds={feeds} />
      </motion.div>
    </div>
  );
};

export default Dashboard;
