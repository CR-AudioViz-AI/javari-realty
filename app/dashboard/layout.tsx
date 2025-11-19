'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Home,
  Building2,
  Users,
  TrendingUp,
  Calculator,
  UserSearch,
  Camera,
  FileText,
  Briefcase,
  UserPlus,
  Heart,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Determine user role from pathname
  const isAdmin = pathname.startsWith('/dashboard/admin')
  const isRealtor = pathname.startsWith('/dashboard/realtor')
  const isClient = pathname.startsWith('/dashboard/client')

  // Navigation items based on role
  const navigation = isAdmin
    ? [
        { name: 'Overview', href: '/dashboard/admin', icon: Home },
        { name: 'Feature Toggles', href: '/dashboard/admin/features', icon: Settings },
        { name: 'Brokers', href: '/dashboard/admin/brokers', icon: Building2 },
        { name: 'Users', href: '/dashboard/admin/users', icon: Users },
        { name: 'Analytics', href: '/dashboard/admin/analytics', icon: TrendingUp },
      ]
    : isRealtor
    ? [
        { name: 'Dashboard', href: '/dashboard/realtor', icon: Home },
        { name: 'Properties', href: '/dashboard/realtor/properties', icon: Building2 },
        { name: 'Leads', href: '/dashboard/realtor/leads', icon: UserPlus },
        { name: 'Transactions', href: '/dashboard/realtor/transactions', icon: Briefcase },
        { name: 'Analytics', href: '/dashboard/realtor/analytics', icon: TrendingUp },
        { name: 'My Features', href: '/dashboard/realtor/features', icon: Settings },
      ]
    : [
        { name: 'Dashboard', href: '/dashboard/client', icon: Home },
        { name: 'Search Properties', href: '/dashboard/client/search', icon: Building2 },
        { name: 'Favorites', href: '/dashboard/client/favorites', icon: Heart },
        { name: 'My Agent', href: '/dashboard/client/agent', icon: UserSearch },
        { name: 'Documents', href: '/dashboard/client/documents', icon: FileText },
      ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg" />
              <span className="text-xl font-bold">CR Realtor</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Role badge */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Shield className={`w-5 h-5 ${
                isAdmin ? 'text-red-600' : isRealtor ? 'text-blue-600' : 'text-green-600'
              }`} />
              <span className="text-sm font-medium text-gray-700">
                {isAdmin ? 'Platform Admin' : isRealtor ? 'Realtor' : 'Client'}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => {
                // Handle logout
                window.location.href = '/api/auth/signout'
              }}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center h-16 px-6 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center justify-between flex-1 lg:ml-0 ml-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {navigation.find((item) => pathname === item.href)?.name || 'Dashboard'}
            </h1>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/settings"
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <Settings className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
