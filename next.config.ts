import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/admin/login',
        destination: '/auth-admin',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      // Uploadthing
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.uploadthing.com',
        port: '',
        pathname: '/**',
      },
      // Cloudinary (legacy - garder pendant transition)
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
