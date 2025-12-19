import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🔴 Prevent 308 redirects that break CORS
  trailingSlash: false,

  // 🔴 Fix Payload Admin uploads > 1MB
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },

  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return config
  },
}

export default withPayload(nextConfig);