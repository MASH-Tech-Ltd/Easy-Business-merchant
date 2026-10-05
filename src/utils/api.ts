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

    // Banned merchant: wipe session and send to login with a ban notice
    if (error.response?.status === 403 && error.response?.data?.code === 'ACCOUNT_BANNED') {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('merchantUser');
        sessionStorage.removeItem('merchantUser');
        // The proxy clears auth cookies on any auth/logout call, even if the backend rejects it
        axios.post('/api/auth/logout', {}, { withCredentials: true }).catch(() => {}).finally(() => {
          if (!window.location.pathname.startsWith('/login')) {
            window.location.href = '/login?banned=1';
          }
        });
      }
      return Promise.reject(error);
    }

    // Suspended merchant write attempt: show read-only toast alert
    if (error.response?.status === 403 && error.response?.data?.code === 'ACCOUNT_SUSPENDED') {
      if (typeof window !== 'undefined') {
        try {
          const toast = require('react-hot-toast').default || require('react-hot-toast');
          toast.error(error.response.data.message || 'Account Suspended: Data modifications are disabled in read-only mode.');
        } catch (e) {}
      }
      return Promise.reject(error);
    }

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
          localStorage.removeItem('merchantUser');
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
        localStorage.removeItem('merchantUser');
        sessionStorage.removeItem('merchantUser');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
