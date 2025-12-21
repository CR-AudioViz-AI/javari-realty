'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  Home,
  Search,
  Heart,
  Calculator,
  FileCheck,
  MessageSquare,
  User,
  LogOut,
  Building2,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Loader2
} from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  full_name: string
  phone?: string
  role: string
}

export default function CustomerPortalPage() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/auth/login')
      return
    }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileData) {
      setProfile(profileData)
    }
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'there'

  const quickActions = [
    {
      title: 'Search Properties',
      description: 'Browse available homes in your area',
      icon: Search,
      href: '/search',
      color: 'bg-blue-500'
    },
    {
      title: 'Investment Calculator',
      description: 'Calculate ROI, cap rate & cash flow',
      icon: Calculator,
      href: '/tools/investment-calculator',
      color: 'bg-green-500'
    },
    {
      title: 'Get Pre-Qualified',
      description: 'Find out how much home you can afford',
      icon: FileCheck,
      href: '/tools/pre-qualification',
      color: 'bg-purple-500'
    },
    {
      title: 'Market Insights',
      description: 'View neighborhood data & trends',
      icon: TrendingUp,
      href: '/market',
      color: 'bg-orange-500'
    }
  ]

  const resources = [
    { title: 'First-Time Buyer Guide', icon: Home },
    { title: 'Mortgage Calculator', icon: Calculator },
    { title: 'Neighborhood Research', icon: MapPin },
    { title: 'Closing Cost Estimator', icon: FileCheck }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-gray-900">RealtorPro</span>
                <span className="text-xs text-gray-500 block">Customer Portal</span>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <Link 
                href="/search" 
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Search className="h-4 w-4" />
                Search Homes
              </Link>
              
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {firstName}!</h1>
          <p className="text-blue-100 text-lg">Your home buying journey starts here.</p>
        </div>

        {/* Quick Actions */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="bg-white rounded-xl p-6 border hover:shadow-lg transition group"
              >
                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-4`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-500">{action.description}</p>
                <div className="mt-3 flex items-center text-blue-600 text-sm font-medium">
                  Get Started <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Properties Placeholder */}
            <section className="bg-white rounded-xl p-6 border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Featured Properties</h2>
                <Link href="/search" className="text-blue-600 text-sm font-medium hover:underline">
                  View All
                </Link>
              </div>
              <div className="text-center py-12 text-gray-500">
                <Building2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Start searching to see recommended properties</p>
                <Link 
                  href="/search" 
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Search className="h-4 w-4" />
                  Search Properties
                </Link>
              </div>
            </section>

            {/* Resources */}
            <section className="bg-white rounded-xl p-6 border">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Helpful Resources</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {resources.map((resource) => (
                  <button
                    key={resource.title}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-left"
                  >
                    <resource.icon className="h-5 w-5 text-gray-400" />
                    <span className="font-medium text-gray-700">{resource.title}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Profile Card */}
            <div className="bg-white rounded-xl p-6 border">
              <h3 className="font-semibold text-gray-900 mb-4">Your Profile</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{profile?.full_name || 'Not set'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700 text-sm">{profile?.email}</span>
                </div>
                {profile?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{profile.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Agent Card */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-green-100 text-sm mb-4">
                Our team is here to help you find your perfect home.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-green-600 rounded-lg font-medium hover:bg-green-50 transition"
              >
                <MessageSquare className="h-4 w-4" />
                Contact Us
              </Link>
            </div>

            {/* Tools Card */}
            <div className="bg-white rounded-xl p-6 border">
              <h3 className="font-semibold text-gray-900 mb-4">Buyer Tools</h3>
              <div className="space-y-2">
                <Link
                  href="/tools/investment-calculator"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <span className="text-gray-700">Investment Calculator</span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </Link>
                <Link
                  href="/tools/pre-qualification"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <span className="text-gray-700">Pre-Qualification</span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </Link>
                <Link
                  href="/tools/mortgage-calculator"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <span className="text-gray-700">Mortgage Calculator</span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2025 RealtorPro by CR AudioViz AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
