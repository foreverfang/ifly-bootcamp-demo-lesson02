import type { NextConfig } from 'next'

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const basePath =
  isGitHubActions && repositoryName ? `/${repositoryName}` : undefined

const nextConfig: NextConfig = {
  basePath,
  output: 'export',
  trailingSlash: true,
  transpilePackages: [
    '@repo/ui',
    '@repo/utils',
    '@repo/config',
    '@repo/supabase',
  ],
  images: {
    unoptimized: true,
  },
}

export default nextConfig
