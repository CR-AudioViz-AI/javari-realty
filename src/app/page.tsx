'use client'

import { Home, Building2, Users, FileText, Mail, BarChart3, Settings } from 'lucide-react'
import Link from 'next/link'

const apps = [
  {
    name: 'Property Management',
    description: 'Manage listings, photos, and property details',
    icon: Building2,
    href: '/properties',
    color: 'bg-blue-500',
  },
  {
    name: 'Lead Tracking',
    description: 'Track leads through your sales pipeline',
    icon: Users,
    href: '/leads',
    color: 'bg-green-500',
  },
  {
    name: 'Client Portal',
    description: 'Client communication and document sharing',
    icon: Mail,
    href: '/clients',
    color: 'bg-purple-500',
  },
  {
    name: 'Documents',
    description: 'Store and manage all your documents',
    icon: FileText,
    href: '/documents',
    color: 'bg-orange-500',
  },
  {
    name: 'Marketing',
    description: 'Marketing automation and campaigns',
    icon: Mail,
    href: '/marketing',
    color: 'bg-pink-500',
  },
  {
    name: 'Analytics',
    description: 'Business intelligence and reporting',
    icon: BarChart3,
    href: '/analytics',
    color: 'bg-indigo-500',
  },
]

const stats = [
  { label: 'Active Listings', value: '24', change: '+3 this week' },
  { label: 'Active Leads', value: '18', change: '+5 this week' },
  { label: 'Pending Deals', value: '6', change: '2 closing soon' },
  { label: 'This Month Sales', value: '$2.4M', change: '+12% vs last month' },
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Home className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CR Realtor Platform</h1>
                <p className="text-sm text-gray-500">Your Story. Our Design</p>
              </div>
            </div>
            <Link
              href="/settings"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-6 h-6 text-gray-600" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6">
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <p className="text-sm text-green-600">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Apps Grid */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Apps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app) => {
              const Icon = app.icon
              return (
                <Link
                  key={app.name}
                  href={app.href}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`${app.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {app.name}
                      </h3>
                      <p className="text-sm text-gray-600">{app.description}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-left transition-colors">
              <p className="font-semibold">Add New Property</p>
              <p className="text-sm text-white/80 mt-1">List a new property for sale</p>
            </button>
            <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-left transition-colors">
              <p className="font-semibold">Capture Lead</p>
              <p className="text-sm text-white/80 mt-1">Add a new lead to your pipeline</p>
            </button>
            <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-left transition-colors">
              <p className="font-semibold">Schedule Showing</p>
              <p className="text-sm text-white/80 mt-1">Book a property viewing</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
