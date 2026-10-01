import type { NextConfig } from "next";

// Target backend URL for proxying socket traffic (read from env or fallback)
const rawBackendUrl = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8000';
const backendUrl = rawBackendUrl.replace(/\/api(\/v\d+)?\/?$/, '').replace(/\/$/, '');

const nextConfig: NextConfig = {
  // Proxy socket.io traffic so client browser connects to dashboard domain (/socket.io)
  // and hides backend API domain (backapi.masheco.com) completely from browser DevTools
  async rewrites() {
    return [
      {
        source: '/socket.io/:path*',
        destination: `${backendUrl}/socket.io/:path*`,
      },
    ];
  },
};

export default nextConfig;
