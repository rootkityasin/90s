/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ]
  },
  webpack: (config, { isServer }) => {
    // Exclude MongoDB from client-side bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        mongodb: false,
        'mongodb-client-encryption': false,
        '@aws-sdk/credential-providers': false,
        'gcp-metadata': false,
        'snappy': false,
        'aws4': false,
        'child_process': false,
        'worker_threads': false,
        'crypto': false,
        'stream': false,
        'util': false,
        'url': false,
        'zlib': false,
        'http': false,
        'https': false,
        'dns': false,
        'os': false,
        'path': false,
        'fs/promises': false,
        'timers/promises': false,
      };
    }
    return config;
  },
};
export default nextConfig;
