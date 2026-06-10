import { DashboardStats } from '../types/dashboard';
import { api } from '../lib/api';


class DashboardService {
  async getStats(): Promise<{ success: boolean; data: DashboardStats }> {
    return api.get('/dashboard/stats');
  }
}

export const dashboardService = new DashboardService();
