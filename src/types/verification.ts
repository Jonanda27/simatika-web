export interface VerificationData {
  id: string;
  kbg_id: string;
  submitted_by: string;
  payload_data: any;
  status: 'PENDING' | 'VERIFIED_STASI' | 'APPROVED_PAROKI' | 'REJECTED';
  reject_reason: string;
  createdAt: string;
  User?: {
    id: string;
    username: string;
    role: string;
  };
}
