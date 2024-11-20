/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // If you're running behind a proxy
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : undefined,
}

export default nextConfig;
