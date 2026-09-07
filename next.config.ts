import type { NextConfig } from "next";
import path from "node:path";

const backendOrigin = process.env.BACKEND_ORIGIN ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Same-origin proxy to the SMS-Backend API. The browser only ever calls
  // /api/backend/* (same site as the app), so the backend's httpOnly
  // `refresh_token` cookie (sameSite: "strict") is treated as first-party and
  // no CORS is involved.
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${backendOrigin}/:path*`,
      },
    ];
  },
};

export default nextConfig;
