/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : undefined,

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        dns: false,
      };
    }

    // Ensure caching issues don't cause problems
    config.cache = false;

    return config;
  },

  experimental: {
    appDir: true, // Ensure Next.js 15+ App Router works properly
  },
};

export default nextConfig;
