import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // First Cloudinary fetch is stored by Next; later hits serve from this cache.
    minimumCacheTTL: 60 * 60 * 24 * 31,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
