export interface ThreatFeed {
  id: string;
  title: string;
  summary: string;
  source: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  timestamp: number;
  url?: string;
  content: string;
}

export interface IOC {
  id: string;
  type: 'ip' | 'domain' | 'url' | 'hash' | 'cve' | 'email';
  value: string;
  source: string;
  confidence: 'low' | 'medium' | 'high';
  firstSeen: number;
  lastSeen?: number;
  tags?: string[];
  description?: string;
}

export interface ThreatStats {
  totalFeeds: number;
  totalIOCs: number;
  highPriorityThreats: number;
  lastUpdated: string;
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recentThreats: number;
  topThreatTypes: string[];
}

export interface AISummary {
  id: string;
  type: 'summary' | 'trend' | 'prediction';
  content: string;
  timestamp: number;
  confidence: number;
}

export interface FilterOptions {
  severity?: string;
  source?: string;
  iocType?: string;
  confidence?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface ExportData {
  feeds: ThreatFeed[];
  iocs: IOC[];
  aiSummaries: AISummary[];
  stats: ThreatStats;
  exportDate: string;
}

export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ThreatSource {
  name: string;
  url: string;
  type: 'rss' | 'csv' | 'json' | 'api';
  enabled: boolean;
  lastCheck?: string;
  status: 'active' | 'inactive' | 'error';
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'analyst' | 'viewer';
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    autoRefresh: boolean;
  };
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}
