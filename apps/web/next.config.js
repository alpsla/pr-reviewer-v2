const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@pr-reviewer/core'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@pr-reviewer/core': path.resolve(__dirname, '../../packages/core/dist')
    };
    return config;
  }
};

module.exports = nextConfig;