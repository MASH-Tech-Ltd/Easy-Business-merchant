import axios from 'axios';

// Point to the Next.js proxy route instead of the real backend URL
export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const getWsUrl = (): string => {
  const raw = process.env.NEXT_PUBLIC_WS_URL || '';
  return raw.split('#')[0].trim();
};

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest?.url || '';

    // Ignore auto-logout and refresh-token for auth action endpoints (validation errors like wrong password or wrong OTP code)
    const isAuthAction = 
      url.includes('/auth/login') || 
      url.includes('/auth/change-password') || 
      url.includes('/auth/2fa') ||
      url.includes('/auth/refresh-token');

    if (error.response?.status === 401 && !isAuthAction && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post('/api/auth/refresh-token', {}, { withCredentials: true });
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('merchantUser');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 401 && !isAuthAction && originalRequest._retry) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('merchantUser');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
