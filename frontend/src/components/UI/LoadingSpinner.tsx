import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="glass-card p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"
        />
        <p className="text-center text-slate-400 mt-4">Loading threat intelligence data...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
