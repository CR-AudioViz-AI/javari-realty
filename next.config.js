/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  reactStrictMode: false,
  // Prevent static generation of API routes
  output: undefined,
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
}
module.exports = nextConfig
