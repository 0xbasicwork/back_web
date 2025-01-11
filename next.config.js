/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  // Optimize for production
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  // Ignore favicon errors
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
}

module.exports = nextConfig 