/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  // Ensure we're using SWC
  swcMinify: true,
};

module.exports = nextConfig;