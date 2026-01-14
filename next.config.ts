import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // Image optimization for GitHub avatars
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
