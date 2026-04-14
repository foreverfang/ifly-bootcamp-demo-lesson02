import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: [
    '@repo/ui',
    '@repo/utils',
    '@repo/config',
    '@repo/supabase',
  ],
}

export default nextConfig
