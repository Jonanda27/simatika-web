import { api } from '../lib/api';
import { KepengurusanPayload, SyncKepengurusanResponse } from '../types/kepengurusan';

class KepengurusanService {
  async sync(payload: KepengurusanPayload, skFile: File | null): Promise<SyncKepengurusanResponse> {
    const formData = new FormData();
    formData.append("payload", JSON.stringify(payload));
    
    if (skFile) {
      formData.append("sk_file", skFile);
    }

    return api.post<SyncKepengurusanResponse>('/sync/kepengurusan', formData);
  }
}

export const kepengurusanService = new KepengurusanService();
