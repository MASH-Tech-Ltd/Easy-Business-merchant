import type { NextConfig } from "next";

// Clean env value by stripping inline comments (e.g. # comment) and whitespace
const cleanEnv = (val?: string) => (val ? val.split('#')[0].trim() : '');

const rawBackendUrl =
  cleanEnv(process.env.BACKEND_INTERNAL_URL) ||
  cleanEnv(process.env.NEXT_PUBLIC_WS_URL) ||
  'http://localhost:8000';

const backendUrl = rawBackendUrl.replace(/\/api(\/v\d+)?\/?$/, '').replace(/\/$/, '');

const nextConfig: NextConfig = {
  // Proxy socket.io traffic so client browser connects to dashboard domain (/socket.io)
  // and hides backend API domain (backapi.masheco.com) completely from browser DevTools
  async rewrites() {
    return [
      {
        source: '/socket.io',
        destination: `${backendUrl}/socket.io/`,
      },
      {
        source: '/socket.io/:path*',
        destination: `${backendUrl}/socket.io/:path*`,
      },
    ];
  },
};

export default nextConfig;
