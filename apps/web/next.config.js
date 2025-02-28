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
  images: {
    domains: ['github.com'],
  },
  // Disable ESLint during build to avoid the alias resolver issue
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Skip static rendering for these routes to prevent localStorage errors
  output: 'standalone',
  experimental: {
    // This ensures client-side components are properly hydrated
    appDir: true
  },
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