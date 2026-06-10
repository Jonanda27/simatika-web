export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
  },
  USERS: '/users',
};
