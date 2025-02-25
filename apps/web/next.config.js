const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@pr-reviewer/core',
    '@octokit/rest',
    '@octokit/request-error',
    '@octokit/core',
    '@octokit/plugin-paginate-rest',
    '@octokit/plugin-rest-endpoint-methods'
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@pr-reviewer/core': path.resolve(__dirname, '../../packages/core/dist')
    };
    
    // Add support for ESM modules
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
      asyncWebAssembly: true,
    };
    
    return config;
  }
};

module.exports = nextConfig;