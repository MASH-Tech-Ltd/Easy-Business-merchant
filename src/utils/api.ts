import axios from 'axios';

// Point to the Next.js proxy route instead of the real backend URL
export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('merchantUser');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
