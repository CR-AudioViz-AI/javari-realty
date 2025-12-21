'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  Home,
  Search,
  Heart,
  Bell,
  Calendar,
  MessageSquare,
  FileText,
  Calculator,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
  Phone,
  ChevronDown,
  Briefcase,
  Loader2
} from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  full_name: string
  phone?: string
  role: string
  avatar_url?: string
}

interface AgentInfo {
  id: string
  full_name: string
  email: string
  phone?: string
  avatar_url?: string
  brokerage?: string
}

// ONLY include pages that ACTUALLY EXIST in the codebase
const NAVIGATION = [
  { 
    name: 'Dashboard', 
    href: '/customer/dashboard', 
    icon: Home,
  },
  { 
    name: 'Browse Properties', 
    href: '/customer/dashboard/properties', 
    icon: Search,
  },
  { 
    name: 'Saved Homes', 
    href: '/customer/dashboard/favorites', 
    icon: Heart,
  },
  { 
    name: 'Messages', 
    href: '/customer/dashboard/messages', 
    icon: MessageSquare,
  },
  { 
    name: 'Documents', 
    href: '/customer/dashboard/documents', 
    icon: FileText,
  },
  { 
    name: 'Mortgage Calculator', 
    href: '/customer/dashboard/mortgage', 
    icon: Calculator,
  },
  { 
    name: 'Service Providers', 
    href: '/customer/dashboard/vendors', 
    icon: Briefcase,
  },
]

export default function CustomerPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [agent, setAgent] = useState<AgentInfo | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(0)

  useEffect(() => {
    loadUserData()
  }, [])

  async function loadUserData() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Get user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) {
        // Check if user is an agent (should not be here)
        const agentRoles = ['realtor', 'agent', 'broker', 'admin', 'platform_admin', 'team_lead']
        if (agentRoles.includes(profileData.role)) {
          router.push('/dashboard')
          return
        }
        setProfile(profileData)
      }

      // Try to get assigned agent (graceful failure)
      try {
        const { data: customerData } = await supabase
          .from('realtor_customers')
          .select('assigned_agent_id')
          .eq('user_id', user.id)
          .single()

        if (customerData?.assigned_agent_id) {
          const { data: agentData } = await supabase
            .from('profiles')
            .select('id, full_name, email, phone, avatar_url, brokerage')
            .eq('id', customerData.assigned_agent_id)
            .single()
          
          if (agentData) {
            setAgent(agentData)
          }
        }
      } catch {
        // No assigned agent, that's fine
      }

      // Get unread message count (graceful failure)
      try {
        const { count: msgCount } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('recipient_id', user.id)
          .eq('is_read', false)
        setUnreadMessages(msgCount || 0)
      } catch {
        // Messages table might not exist
      }

      setLoading(false)
    } catch (error) {
      console.error('Error loading user data:', error)
      setLoading(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your portal...</p>
        </div>
      </div>
    )
  }

  const userInitial = profile?.full_name?.charAt(0)?.toUpperCase() || 'U'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== STATIC HEADER ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left: Logo & Mobile Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <Link href="/customer/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-gray-900">RealtorPro</span>
                <span className="text-xs text-gray-500 block -mt-1">Customer Portal</span>
              </div>
            </Link>
          </div>

          {/* Center: Quick Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link 
              href="/customer/dashboard/properties"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                pathname?.includes('/properties') 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Search className="h-4 w-4 inline mr-2" />
              Properties
            </Link>
            <Link 
              href="/customer/dashboard/favorites"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                pathname?.includes('/favorites') 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Heart className="h-4 w-4 inline mr-2" />
              Saved
            </Link>
            <Link 
              href="/customer/dashboard/messages"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition relative ${
                pathname?.includes('/messages') 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Messages
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </Link>
            <Link 
              href="/customer/dashboard/documents"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                pathname?.includes('/documents') 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FileText className="h-4 w-4 inline mr-2" />
              Documents
            </Link>
          </nav>

          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <Bell className="h-5 w-5" />
              {unreadMessages > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3 pl-3 border-l">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{profile?.full_name}</p>
                <p className="text-xs text-gray-500">{profile?.email}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {userInitial}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== MOBILE SIDEBAR BACKDROP ===== */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:top-16 lg:h-[calc(100vh-4rem)] lg:shadow-none lg:border-r
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile Header */}
        <div className="lg:hidden h-16 flex items-center justify-between px-4 border-b">
          <span className="font-bold text-gray-900">Menu</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Agent Card (if assigned) */}
        {agent && (
          <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">Your Agent</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {agent.full_name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{agent.full_name}</p>
                {agent.brokerage && (
                  <p className="text-xs text-gray-500 truncate">{agent.brokerage}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              {agent.phone && (
                <a 
                  href={`tel:${agent.phone}`}
                  className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium text-blue-600 bg-white rounded-lg border hover:bg-blue-50"
                >
                  <Phone className="h-3 w-3" />
                  Call
                </a>
              )}
              <Link 
                href="/customer/dashboard/messages"
                className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <MessageSquare className="h-3 w-3" />
                Message
              </Link>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: agent ? 'calc(100vh - 280px)' : 'calc(100vh - 180px)' }}>
          <nav className="space-y-1">
            {NAVIGATION.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/customer/dashboard' && pathname?.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span>{item.name}</span>
                  {item.name === 'Messages' && unreadMessages > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {unreadMessages}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="lg:pl-72 pt-16">
        <div className="p-4 lg:p-6 min-h-[calc(100vh-4rem)] pb-20 lg:pb-6">
          {children}
        </div>
      </main>

      {/* ===== MOBILE BOTTOM NAV ===== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40">
        <div className="flex items-center justify-around h-16">
          <Link 
            href="/customer/dashboard"
            className={`flex flex-col items-center gap-1 px-3 py-2 ${
              pathname === '/customer/dashboard' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link 
            href="/customer/dashboard/properties"
            className={`flex flex-col items-center gap-1 px-3 py-2 ${
              pathname?.includes('/properties') ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <Search className="h-5 w-5" />
            <span className="text-xs">Search</span>
          </Link>
          <Link 
            href="/customer/dashboard/favorites"
            className={`flex flex-col items-center gap-1 px-3 py-2 ${
              pathname?.includes('/favorites') ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <Heart className="h-5 w-5" />
            <span className="text-xs">Saved</span>
          </Link>
          <Link 
            href="/customer/dashboard/messages"
            className={`flex flex-col items-center gap-1 px-3 py-2 relative ${
              pathname?.includes('/messages') ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs">Messages</span>
            {unreadMessages > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                {unreadMessages}
              </span>
            )}
          </Link>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center gap-1 px-3 py-2 text-gray-400"
          >
            <Menu className="h-5 w-5" />
            <span className="text-xs">More</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
