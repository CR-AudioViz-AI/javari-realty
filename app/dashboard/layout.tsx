'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import JavariChat from '@/components/javari-chat'
import {
  Home,
  Building2,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X,
  UserPlus,
  Megaphone,
  BarChart3,
  Calendar,
  FolderOpen,
  Briefcase,
  Shield,
  Plus,
  MessageSquare,
  Sparkles,
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [organization, setOrganization] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*, organizations(*)')
        .eq('id', user.id)
        .single()
      
      setProfile(profile)
      setOrganization(profile?.organizations)
      setLoading(false)
    }
    getUser()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const isAdmin = profile?.role === 'admin' || profile?.is_admin
  const isAgent = profile?.role === 'agent'

  const navigation = isAdmin
    ? [
        { name: 'Overview', href: '/dashboard/admin', icon: Home },
        { name: 'Feature Toggles', href: '/dashboard/admin/features', icon: Settings },
        { name: 'All Properties', href: '/dashboard/properties', icon: Building2 },
        { name: 'All Leads', href: '/dashboard/leads', icon: UserPlus },
        { name: 'Analytics', href: '/dashboard/admin/analytics', icon: TrendingUp },
      ]
    : [
        { name: 'Dashboard', href: '/dashboard/realtor', icon: Home },
        { name: 'My Properties', href: '/dashboard/properties', icon: Building2 },
        { name: 'My Leads', href: '/dashboard/leads', icon: UserPlus },
        { name: 'Customers', href: '/dashboard/customers', icon: Users },
        { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
        { name: 'Share Listings', href: '/dashboard/share-listings', icon: Sparkles },
        { name: 'Vendors', href: '/dashboard/vendors', icon: Briefcase },
        { name: 'CRM', href: '/dashboard/crm', icon: Users },
        { name: 'Marketing', href: '/dashboard/marketing', icon: Megaphone },
        { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
        { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
        { name: 'Documents', href: '/dashboard/documents', icon: FolderOpen },
        { name: 'Transactions', href: '/dashboard/transactions', icon: Briefcase },
        { name: 'Open House', href: '/dashboard/openhouse', icon: Home },
      ]

  const displayName = profile ? [profile.first_name, profile.last_name].filter(Boolean).join(' ') : 'Loading...'

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

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
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link href="/dashboard/realtor" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">CR Realtor</span>
            </Link>
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Listing Button */}
          <div className="p-4">
            <Link
              href="/dashboard/properties/new"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              New Listing
            </Link>
          </div>

          {/* User Info */}
          <div className="px-4 pb-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{displayName}</p>
                <p className="text-xs text-gray-500 truncate capitalize">{profile?.role || 'Agent'}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Organization */}
          {organization && (
            <div className="px-4 py-3 border-t">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Shield className="w-4 h-4" />
                <span className="truncate">{organization.name}</span>
              </div>
            </div>
          )}

          {/* Logout */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl text-sm font-medium transition"
            >
              <LogOut className="w-5 h-5 text-gray-400" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar - mobile */}
        <div className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white border-b lg:hidden">
          <button
            className="p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/dashboard/realtor" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
          </Link>
          <div className="w-10" />
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>

      {/* Javari AI Chat */}
      <JavariChat />
    </div>
  )
}


// Build trigger v1




