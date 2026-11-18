import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Store owners can paste any public image URL as a product photo.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
