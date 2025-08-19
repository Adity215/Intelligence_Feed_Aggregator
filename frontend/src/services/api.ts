import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  ThreatFeed, 
  IOC, 
  ThreatStats, 
  AISummary, 
  FilterOptions, 
  ExportData,
  APIResponse,
  PaginatedResponse 
} from '../types';

class APIService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Health check
  async getHealth(): Promise<APIResponse<any>> {
    const response = await this.api.get('/health');
    return response.data;
  }

  // Threat Feeds
  async getFeeds(filters?: FilterOptions): Promise<ThreatFeed[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    
    const response = await this.api.get(`/feeds?${params.toString()}`);
    return response.data;
  }

  async getFeedById(id: string): Promise<ThreatFeed> {
    const response = await this.api.get(`/feeds/${id}`);
    return response.data;
  }

  // IOCs
  async getIOCs(filters?: FilterOptions): Promise<IOC[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    
    const response = await this.api.get(`/iocs?${params.toString()}`);
    return response.data;
  }

  async getIOCById(id: string): Promise<IOC> {
    const response = await this.api.get(`/iocs/${id}`);
    return response.data;
  }

  // AI Summaries
  async getAISummaries(): Promise<AISummary[]> {
    const response = await this.api.get('/ai-summaries');
    return response.data;
  }

  async generateAISummary(): Promise<APIResponse<string>> {
    const response = await this.api.post('/ai-summaries/generate');
    return response.data;
  }

  // Statistics
  async getStats(): Promise<ThreatStats> {
    const response = await this.api.get('/stats');
    return response.data;
  }

  // Export
  async exportData(): Promise<ExportData> {
    const response = await this.api.get('/export');
    return response.data;
  }

  async downloadExport(): Promise<Blob> {
    const response = await this.api.get('/export/download', {
      responseType: 'blob',
    });
    return response.data;
  }

  // Feed Management
  async refreshFeeds(): Promise<APIResponse<string>> {
    const response = await this.api.post('/refresh');
    return response.data;
  }

  async addCustomFeed(url: string, name: string): Promise<APIResponse<string>> {
    const response = await this.api.post('/feeds/custom', { url, name });
    return response.data;
  }

  // Search
  async search(query: string, type?: 'feeds' | 'iocs' | 'all'): Promise<{
    feeds: ThreatFeed[];
    iocs: IOC[];
  }> {
    const response = await this.api.get('/search', {
      params: { q: query, type },
    });
    return response.data;
  }

  // Analytics
  async getThreatTrends(days: number = 30): Promise<any> {
    const response = await this.api.get('/analytics/trends', {
      params: { days },
    });
    return response.data;
  }

  async getThreatMap(): Promise<any> {
    const response = await this.api.get('/analytics/threat-map');
    return response.data;
  }

  async getTopThreats(limit: number = 10): Promise<any> {
    const response = await this.api.get('/analytics/top-threats', {
      params: { limit },
    });
    return response.data;
  }

  // Notifications
  async getNotifications(): Promise<any[]> {
    const response = await this.api.get('/notifications');
    return response.data;
  }

  async markNotificationRead(id: string): Promise<void> {
    await this.api.put(`/notifications/${id}/read`);
  }

  // Settings
  async getSettings(): Promise<any> {
    const response = await this.api.get('/settings');
    return response.data;
  }

  async updateSettings(settings: any): Promise<void> {
    await this.api.put('/settings', settings);
  }

  // WebSocket connection for real-time updates
  getWebSocketUrl(): string {
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    return baseUrl.replace('http', 'ws') + '/ws';
  }
}

export const apiService = new APIService();
export default apiService;
