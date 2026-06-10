export interface User {
  id: string;
  username: string;
  role: string;
  kbg_id?: string | null;
  stasi_id?: string | null;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface LoginCredentials {
  username: string;
  password?: string;
}
