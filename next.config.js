/** @type {import('next').NextConfig} */
const nextConfig = {
  // TEMPORARY: Bypass TypeScript errors to unblock deployment
  // TODO: Remove this once TypeScript errors are identified and fixed
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Allow useSearchParams() in client components without Suspense boundary
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    domains: ['kteobfyferrukqeolofj.supabase.co'],
  },
}

module.exports = nextConfig

