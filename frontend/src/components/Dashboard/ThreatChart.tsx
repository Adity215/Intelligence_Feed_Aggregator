import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { ThreatFeed } from '../../types';

interface ThreatChartProps {
  feeds: ThreatFeed[];
}

const ThreatChart: React.FC<ThreatChartProps> = ({ feeds }) => {
  // Process data for charts
  const severityData = feeds.reduce((acc, feed) => {
    acc[feed.severity] = (acc[feed.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(severityData).map(([severity, count]) => ({
    severity: severity.toUpperCase(),
    count,
  }));

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#dc2626'];

  return (
    <div className="glass-card">
      <h3 className="text-lg font-semibold text-white mb-4">Threat Severity Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ severity, percent }) => `${severity} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ThreatChart;
