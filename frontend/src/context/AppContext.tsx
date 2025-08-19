import React, { createContext, useContext, useEffect } from 'react';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { ThreatFeed, IOC, ThreatStats, FilterOptions } from '../types';
import apiService from '../services/api';
import toast from 'react-hot-toast';

interface AppState {
  // Data
  feeds: ThreatFeed[];
  iocs: IOC[];
  stats: ThreatStats | null;
  
  // UI State
  loading: boolean;
  filters: FilterOptions;
  searchQuery: string;
  
  // Actions
  setFeeds: (feeds: ThreatFeed[]) => void;
  setIOCs: (iocs: IOC[]) => void;
  setStats: (stats: ThreatStats) => void;
  setLoading: (loading: boolean) => void;
  setFilters: (filters: FilterOptions) => void;
  setSearchQuery: (query: string) => void;
  
  // API Actions
  refreshData: () => Promise<void>;
  refreshFeeds: () => Promise<void>;
  exportData: () => Promise<void>;
}

const useAppStore = create<AppState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    feeds: [],
    iocs: [],
    stats: null,
    loading: false,
    filters: {},
    searchQuery: '',
    
    // Actions
    setFeeds: (feeds) => set({ feeds }),
    setIOCs: (iocs) => set({ iocs }),
    setStats: (stats) => set({ stats }),
    setLoading: (loading) => set({ loading }),
    setFilters: (filters) => set({ filters }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    
    // API Actions
    refreshData: async () => {
      set({ loading: true });
      try {
        const [feeds, iocs, stats] = await Promise.all([
          apiService.getFeeds(get().filters),
          apiService.getIOCs(get().filters),
          apiService.getStats(),
        ]);
        
        set({ feeds, iocs, stats, loading: false });
        toast.success('Data refreshed successfully');
      } catch (error) {
        set({ loading: false });
        toast.error('Failed to refresh data');
        console.error('Error refreshing data:', error);
      }
    },
    
    refreshFeeds: async () => {
      set({ loading: true });
      try {
        await apiService.refreshFeeds();
        await get().refreshData();
        toast.success('Feeds refreshed successfully');
      } catch (error) {
        set({ loading: false });
        toast.error('Failed to refresh feeds');
        console.error('Error refreshing feeds:', error);
      }
    },
    
    exportData: async () => {
      try {
        const blob = await apiService.downloadExport();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `threat-intelligence-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Data exported successfully');
      } catch (error) {
        toast.error('Failed to export data');
        console.error('Error exporting data:', error);
      }
    },
  }))
);

// Context
const AppContext = createContext<typeof useAppStore | null>(null);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useAppStore;
  
  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      store.getState().refreshData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [store]);
  
  // Initial data load
  useEffect(() => {
    store.getState().refreshData();
  }, [store]);
  
  return (
    <AppContext.Provider value={store}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the store
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default useAppStore;
