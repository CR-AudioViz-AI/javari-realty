/** @type {import('next').NextConfig} */
const nextConfig = {
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
