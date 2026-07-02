import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    // The seed data references real, stable OSS-hosted property photos.
    remotePatterns: [
      { protocol: "https", hostname: "sfile.chatglm.cn" },
    ],
  },
};

export default nextConfig;
