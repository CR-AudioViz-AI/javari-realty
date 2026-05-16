/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  reactStrictMode: false,
  // Prevent any static generation - all pages dynamic
  staticPageGenerationTimeout: 0,
}
module.exports = nextConfig
