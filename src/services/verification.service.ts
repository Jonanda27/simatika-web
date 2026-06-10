import { VerificationData } from '../types/verification';
import { api } from '../lib/api';


class VerificationService {
  async getQueue(status?: string): Promise<{ success: boolean; data: VerificationData[] }> {
    const url = status ? `/verification?status=${status}` : `/verification`;
    return api.get(url);
  }

  async verifyStasi(id: string): Promise<{ success: boolean; message: string }> {
    return api.post(`/verification/${id}/verify-stasi`);
  }

  async approveParoki(id: string): Promise<{ success: boolean; message: string }> {
    return api.post(`/verification/${id}/approve-paroki`);
  }

  async rejectData(id: string, reason: string): Promise<{ success: boolean; message: string }> {
    return api.post(`/verification/${id}/reject`, { reject_reason: reason });
  }
}

export const verificationService = new VerificationService();
