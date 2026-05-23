/** @type {import('next').NextConfig} */
import withPWAInit from "next-pwa";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiBaseUrl}/api/:path*`,
      },
      {
        source: "/profile/images/:path*",
        destination: `${apiBaseUrl}/profile/images/:path*`,
      },
    ];
  },
};

export default withPWA(nextConfig);
