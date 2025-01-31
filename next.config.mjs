// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : undefined,

  // Add webpack configuration for WebSocket
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        dns: false,
      };
    }
    return config;
  },

  // Enable WebSocket upgrade
  webSocketServer: true,
};

export default nextConfig;
