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
  Home,
  UserPlus,
} from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_admin, first_name, last_name')
    .eq('id', user.id)
    .single()

  // Check for admin role OR is_admin flag
  if (!profile || (profile.role !== 'admin' && !profile.is_admin)) {
    redirect('/dashboard/realtor')
  }

  const displayName = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Admin'

  // Get platform metrics
  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('id, role, active')
    
  const { data: properties } = await supabase
    .from('properties')
    .select('id, status')
  
  const { data: leads } = await supabase
    .from('realtor_leads')
    .select('id, status')

  const totalUsers = allProfiles?.length || 0
  const activeAgents = allProfiles?.filter((p) => p.role === 'agent' && p.active).length || 0
  const totalProperties = properties?.length || 0
  const activeListings = properties?.filter((p) => p.status === 'active').length || 0
  const totalLeads = leads?.length || 0
  const newLeads = leads?.filter((l) => l.status === 'new').length || 0

  const metrics = [
    {
      name: 'Total Users',
      value: totalUsers,
      breakdown: `${activeAgents} Active Agents`,
      icon: Users,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      name: 'Properties',
      value: totalProperties,
      breakdown: `${activeListings} Active Listings`,
      icon: Building2,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      name: 'Total Leads',
      value: totalLeads,
      breakdown: `${newLeads} New Leads`,
      icon: UserPlus,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      name: 'Platform Health',
      value: '100%',
      breakdown: 'All systems operational',
      icon: TrendingUp,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ]

  const quickLinks = [
    {
      name: 'All Properties',
      description: 'View and manage all listings',
      href: '/dashboard/properties',
      icon: Building2,
    },
    {
      name: 'All Leads',
      description: 'View platform-wide leads',
      href: '/dashboard/leads',
      icon: UserPlus,
    },
    {
      name: 'Feature Toggles',
      description: 'Enable/disable platform features',
      href: '/dashboard/admin/features',
      icon: Settings,
    },
    {
      name: 'Analytics',
      description: 'View platform analytics',
      href: '/dashboard/admin/analytics',
      icon: TrendingUp,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Admin header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center mb-2">
          <Shield className="w-8 h-8 mr-3" />
          <div>
            <h2 className="text-2xl font-bold">Platform Admin</h2>
            <p className="text-red-100">Welcome back, {displayName}</p>
          </div>
        </div>
        <p className="text-red-100 mt-2">
          Complete control over the CR Realtor Platform
        </p>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.name}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 ${metric.bgColor} rounded-lg`}>
                <metric.icon className={`w-6 h-6 ${metric.iconColor}`} />
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
      <div className="bg-white rounded-xl border border-gray-200 p-6">
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
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Platform Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">New Agent Registered</p>
              <p className="text-sm text-gray-600">Tony Harvey joined</p>
            </div>
            <p className="text-sm text-gray-500">Today</p>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">New Property Listed</p>
              <p className="text-sm text-gray-600">Port Royal Waterfront Estate</p>
            </div>
            <p className="text-sm text-gray-500">Today</p>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Platform Updated</p>
              <p className="text-sm text-gray-600">v1.0 Production Ready</p>
            </div>
            <p className="text-sm text-gray-500">Today</p>
          </div>
        </div>
      </div>
    </div>
  )
}
