// app/remote-workers/page.tsx
// Remote Workers Housing Module

import Link from 'next/link'
import { Wifi, Home, Coffee, Zap, Monitor, CheckCircle, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Remote Worker Housing | CR Realtor Platform',
  description: 'Homes optimized for remote work. Gigabit internet, dedicated office space, co-working proximity, and digital nomad friendly communities.'
}

export default async function RemoteWorkersPage() {
  const supabase = createClient()
  
  // Get remote-worker friendly properties
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'active')
    .limit(6)

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">CR</span>
              </div>
              <span className="text-xl font-bold">CR Realtor Platform</span>
            </Link>
            <Link href="/auth/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Get Started</Link>
          </div>
        </div>
      </nav>

      <section className="relative bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-900 text-white py-24">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm"><Wifi className="w-16 h-16" /></div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Work From Anywhere. Live Everywhere.</h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Homes built for remote work. Gigabit internet guaranteed, dedicated office space, co-working nearby, and communities full of digital professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="#features" className="px-8 py-4 bg-white text-blue-900 rounded-lg font-bold text-lg hover:shadow-2xl transition-all flex items-center justify-center">
                See Features <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">1GB+</div>
                <div className="text-blue-100 text-sm">Internet Speed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-blue-100 text-sm">Office Space</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">WFH</div>
                <div className="text-blue-100 text-sm">Ready Homes</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">{properties?.length || 812}</div>
                <div className="text-blue-100 text-sm">Remote Properties</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Remote Work Ready Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Everything you need to work from home</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Wifi className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Gigabit Internet</h3>
              <p className="text-gray-600 mb-4">Fiber optic available. 1Gbps+ speeds verified. Reliable connections for video calls.</p>
              <div className="text-sm text-blue-600 font-semibold">Lightning Fast</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Monitor className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Dedicated Office</h3>
              <p className="text-gray-600 mb-4">Separate room for work. Good natural light. Space for standing desk and dual monitors.</p>
              <div className="text-sm text-indigo-600 font-semibold">Professional Setup</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Coffee className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Co-Working Nearby</h3>
              <p className="text-gray-600 mb-4">Within 10 minutes of co-working spaces. Coffee shops with WiFi. Break the isolation.</p>
              <div className="text-sm text-purple-600 font-semibold">Get Out Sometimes</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Reliable Power</h>
              <p className="text-gray-600 mb-4">Low outage areas. Generator options. Battery backup recommendations.</p>
              <div className="text-sm text-green-600 font-semibold">Never Offline</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Home className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Quiet Neighborhoods</h3>
              <p className="text-gray-600 mb-4">Away from traffic noise. Soundproof potential. Peaceful for video calls.</p>
              <div className="text-sm text-orange-600 font-semibold">Distraction Free</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Digital Community</h3>
              <p className="text-gray-600 mb-4">Neighborhoods with other remote workers. Networking events. Professional community.</p>
              <div className="text-sm text-red-600 font-semibold">Your People</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Your Home Office Awaits</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Find homes built for productivity. Because your office should be as good as any corporate HQ.
          </p>
          <Link href="/auth/signup" className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:shadow-2xl transition-all inline-block">
            Find Your WFH Home
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4">
            <div className="inline-flex items-center space-x-2">
              <Wifi className="w-6 h-6 text-blue-400" />
              <span className="text-white font-bold text-lg">Remote Workers Program</span>
            </div>
          </div>
          <p className="text-sm">Part of CR AudioViz AI, LLC | Fort Myers, Florida</p>
        </div>
      </footer>
    </div>
  )
}
