// =====================================================
// CR REALTOR PLATFORM - CUSTOMER DASHBOARD LAYOUT
// Path: app/customer/dashboard/layout.tsx
// Timestamp: 2025-12-01 11:14 AM EST
// Purpose: Customer portal layout with navigation (multi-tenant)
// =====================================================

'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  Home,
  Building2,
  MessageSquare,
  FileText,
  Heart,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Briefcase,
} from 'lucide-react'

interface CustomerData {
  id: string
  full_name: string
  email: string
  status: string
  assigned_agent_id: string
}

interface AgentData {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  avatar_url?: string
}

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [customer, setCustomer] = useState<CustomerData | null>(null)
  const [agent, setAgent] = useState<AgentData | null>(null)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/customer/login')
        return
      }

      // Get customer record
      const { data: customerData, error: customerError } = await supabase
        .from('realtor_customers')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (customerError || !customerData) {
        router.push('/customer/login')
        return
      }

      setCustomer(customerData)

      // Get agent info
      const { data: agentData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, phone, avatar_url')
        .eq('id', customerData.assigned_agent_id)
        .single()

      if (agentData) {
        setAgent(agentData)
      }

      // Get unread message count
      const { count } = await supabase
        .from('customer_messages')
        .select('id', { count: 'exact', head: true })
        .eq('customer_id', customerData.id)
        .eq('sender_type', 'agent')
        .eq('is_read', false)

      setUnreadMessages(count || 0)
      setLoading(false)
    }

    loadData()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/customer/login')
  }

  const navigation = [
    { name: 'Dashboard', href: '/customer/dashboard', icon: Home },
    { name: 'Properties', href: '/customer/dashboard/properties', icon: Building2 },
    { name: 'Saved Homes', href: '/customer/dashboard/favorites', icon: Heart },
    { name: 'Messages', href: '/customer/dashboard/messages', icon: MessageSquare, badge: unreadMessages },
    { name: 'Documents', href: '/customer/dashboard/documents', icon: FileText },
    { name: 'Service Providers', href: '/customer/dashboard/vendors', icon: Briefcase },
    { name: 'My Profile', href: '/customer/dashboard/profile', icon: User },
  ]

  const agentName = agent ? `${agent.first_name} ${agent.last_name}`.trim() : 'Your Agent'
  const customerFirstName = customer?.full_name?.split(' ')[0] || 'Customer'

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
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <Link href="/customer/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Home className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">My Portal</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Agent Card */}
        <div className="p-4 border-b border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Your Agent</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
              {agent?.first_name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{agentName}</p>
              {agent?.phone && (
                <p className="text-sm text-gray-500">{agent.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="font-medium">{item.name}</span>
                {item.badge && item.badge > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold min-w-[20px] h-5 flex items-center justify-center rounded-full px-1.5">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5 text-gray-400" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Welcome message */}
            <div className="hidden sm:block">
              <h2 className="text-lg font-semibold text-gray-900">
                Welcome back, {customerFirstName}!
              </h2>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:text-gray-700">
                <Bell className="h-5 w-5" />
                {unreadMessages > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              {/* User menu */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {customer?.full_name?.charAt(0)?.toUpperCase() || 'C'}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {customer?.full_name}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

