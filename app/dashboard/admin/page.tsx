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
import { Database } from '@/types/database.complete'

type ProfileRole = Database['public']['Tables']['profiles']['Row']['role']

export default async function AdminDashboard() {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Verify admin role - explicitly type the result
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Combined check: if error OR no profile data, redirect
  if (profileError || !profileData) {
    redirect('/dashboard')
  }

  // Explicitly cast to the correct type after null check
  const profile = profileData as { role: ProfileRole }

  // TypeScript now knows profile has role property
  if (profile.role !== 'platform_admin') {
    redirect('/dashboard')
  }

  // Get platform metrics
  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('id, role')
    
  const { data: brokers } = await supabase
    .from('brokers')
    .select('id')
  
  const { data: properties } = await supabase
    .from('properties')
    .select('id')
  
  const { data: transactions } = await supabase
    .from('transactions')
    .select('id, stage')

  const metrics = [
    {
      name: 'Total Users',
      value: allProfiles?.length || 0,
      breakdown: `${allProfiles?.filter((p: any) => p.role === 'realtor').length || 0} Realtors`,
      icon: Users,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      name: 'Brokers',
      value: brokers?.length || 0,
      breakdown: `${allProfiles?.filter((p: any) => p.role === 'broker_admin').length || 0} Admins`,
      icon: Building2,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      name: 'Active Transactions',
      value: transactions?.filter((t: any) => 
        t.stage === 'under_contract' || 
        t.stage === 'inspection' || 
        t.stage === 'appraisal' || 
        t.stage === 'financing'
      ).length || 0,
      breakdown: `${transactions?.filter((t: any) => t.stage === 'completed').length || 0} Completed`,
      icon: TrendingUp,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      name: 'Total Properties',
      value: properties?.length || 0,
      breakdown: `Platform-wide listings`,
      icon: Settings,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ]

  const quickLinks = [
    {
      name: 'User Management',
      description: 'View and manage all platform users',
      href: '/dashboard/admin/users',
      icon: Users,
    },
    {
      name: 'Brokers',
      description: 'Manage brokers and offices',
      href: '/dashboard/admin/brokers',
      icon: Building2,
    },
    {
      name: 'Properties',
      description: 'View all platform properties',
      href: '/dashboard/admin/properties',
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
              <p className="text-sm text-gray-600">Real Estate Group</p>
            </div>
            <p className="text-sm text-gray-500">2 hours ago</p>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">New Property Listed</p>
              <p className="text-sm text-gray-600">123 Main Street</p>
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
