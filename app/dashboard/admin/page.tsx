import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Shield,
  Users,
  Building2,
  TrendingUp,
  Settings,
  ChevronRight,
} from 'lucide-react'
import { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

export default async function AdminDashboard() {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Verify admin role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single<Pick<Profile, 'role'>>()

  // Combined check: if error OR no profile data, redirect
  if (profileError || !profile) {
    redirect('/dashboard')
  }

  // TypeScript now knows profile is non-null and has role property
  if (profile.role !== 'platform_admin') {
    redirect('/dashboard')
  }

  // Get platform metrics
  const { data: allProfiles } = await supabase.from('profiles').select('id, role')
  const { data: brokers } = await supabase.from('brokers').select('id')
  const { data: offices } = await supabase.from('offices').select('id')
  const { data: properties } = await supabase.from('properties').select('id')
  const { data: transactions } = await supabase.from('transactions').select('id, stage')
  const { data: features } = await supabase.from('features').select('id')
  const { data: platformToggles } = await supabase
    .from('platform_feature_toggles')
    .select('is_enabled')

  const metrics = [
    {
      name: 'Total Users',
      value: allProfiles?.length || 0,
      breakdown: `${allProfiles?.filter((p) => p.role === 'realtor').length || 0} Realtors`,
      icon: Users,
      color: 'blue',
    },
    {
      name: 'Brokers & Offices',
      value: brokers?.length || 0,
      breakdown: `${offices?.length || 0} Offices`,
      icon: Building2,
      color: 'purple',
    },
    {
      name: 'Active Transactions',
      value: transactions?.filter((t) => t.stage !== 'completed' && t.stage !== 'cancelled').length || 0,
      breakdown: `${transactions?.filter((t) => t.stage === 'completed').length || 0} Completed`,
      icon: TrendingUp,
      color: 'green',
    },
    {
      name: 'Features Enabled',
      value: platformToggles?.filter((t) => t.is_enabled).length || 0,
      breakdown: `${features?.length || 0} Total Features`,
      icon: Settings,
      color: 'orange',
    },
  ]

  const quickLinks = [
    {
      name: 'Feature Toggles',
      description: 'Manage platform-wide feature availability',
      href: '/dashboard/admin/features',
      icon: Settings,
    },
    {
      name: 'User Management',
      description: 'View and manage all platform users',
      href: '/dashboard/admin/users',
      icon: Users,
    },
    {
      name: 'Brokers',
      description: 'Manage broker organizations',
      href: '/dashboard/admin/brokers',
      icon: Building2,
    },
    {
      name: 'Analytics',
      description: 'View platform-wide analytics',
      href: '/dashboard/admin/analytics',
      icon: TrendingUp,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Admin header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg p-6 text-white">
        <div className="flex items-center mb-2">
          <Shield className="w-8 h-8 mr-3" />
          <h2 className="text-2xl font-bold">Platform Admin</h2>
        </div>
        <p className="text-red-100">
          Complete control over the CR Realtor Platform
        </p>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.name}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-2 bg-${metric.color}-50 rounded-lg`}
              >
                <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{metric.name}</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {metric.value}
            </p>
            <p className="text-xs text-gray-500">{metric.breakdown}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {quickLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                  <link.icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-blue-600">
                    {link.name}
                  </p>
                  <p className="text-sm text-gray-600">{link.description}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Platform Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">New Broker Registered</p>
              <p className="text-sm text-gray-600">Acme Realty Group</p>
            </div>
            <p className="text-sm text-gray-500">2 hours ago</p>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Feature Toggle Updated</p>
              <p className="text-sm text-gray-600">Virtual Tours enabled</p>
            </div>
            <p className="text-sm text-gray-500">5 hours ago</p>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">New Realtor Signup</p>
              <p className="text-sm text-gray-600">5 new realtors today</p>
            </div>
            <p className="text-sm text-gray-500">Today</p>
          </div>
        </div>
      </div>
    </div>
  )
}

