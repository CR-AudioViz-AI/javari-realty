'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import {
  Home,
  Search,
  Heart,
  Bell,
  MessageSquare,
  FileText,
  Calculator,
  LogOut,
  Menu,
  X,
  Building2,
  Briefcase,
  Loader2
} from 'lucide-react'

// Navigation items - ONLY pages that exist
const NAVIGATION = [
  { name: 'Dashboard', href: '/customer/dashboard', icon: Home },
  { name: 'Browse Properties', href: '/customer/dashboard/properties', icon: Search },
  { name: 'Saved Homes', href: '/customer/dashboard/favorites', icon: Heart },
  { name: 'Messages', href: '/customer/dashboard/messages', icon: MessageSquare },
  { name: 'Documents', href: '/customer/dashboard/documents', icon: FileText },
  { name: 'Mortgage Calculator', href: '/customer/dashboard/mortgage', icon: Calculator },
  { name: 'Service Providers', href: '/customer/dashboard/vendors', icon: Briefcase },
]

// Agent roles that should NOT be in customer portal
const AGENT_ROLES = ['realtor', 'agent', 'broker', 'admin', 'platform_admin', 'team_lead']

interface Profile {
  id: string
  email: string | null
  full_name: string | null
  phone: string | null
  role: string | null
  avatar_url: string | null
  brokerage: string | null
}

export default function CustomerPortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(0)

  // Create supabase client once
  const supabase = createClient()

  const loadUserData = useCallback(async () => {
    try {
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session?.user) {
        console.log('No session, redirecting to login')
        router.push('/auth/login')
        return
      }

      setUser(session.user)

      // Get profile with graceful error handling
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, full_name, phone, role, avatar_url, brokerage')
        .eq('id', session.user.id)
        .single()

      if (profileError) {
        console.error('Profile error:', profileError)
        // Create basic profile from auth data
        setProfile({
          id: session.user.id,
          email: session.user.email || null,
          full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          phone: null,
          role: 'client',
          avatar_url: null,
          brokerage: null
        })
      } else if (profileData) {
        // Check if user is an agent (should redirect)
        if (AGENT_ROLES.includes(profileData.role || '')) {
          console.log('Agent detected, redirecting to agent dashboard')
          router.push('/dashboard')
          return
        }
        setProfile(profileData)
      }

      // Try to get unread messages count (graceful failure)
      try {
        const { count } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('recipient_id', session.user.id)
          .eq('is_read', false)
        setUnreadMessages(count || 0)
      } catch {
        // Table might not exist, that's OK
      }

    } catch (error) {
      console.error('Error in loadUserData:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase, router])

  useEffect(() => {
    loadUserData()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/auth/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [loadUserData, supabase.auth, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  // Loading state
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

  // Safety check - should have user by now
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Session expired. Please log in again.</p>
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'User'
  const displayEmail = profile?.email || user.email || ''
  const userInitial = displayName.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left: Logo & Menu */}
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

          {/* Center: Quick Nav (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAVIGATION.slice(1, 5).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  pathname?.includes(item.href.split('/').pop() || '')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-4 w-4 inline mr-2" />
                {item.name.split(' ')[0]}
              </Link>
            ))}
          </nav>

          {/* Right: Profile */}
          <div className="flex items-center gap-2">
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <Bell className="h-5 w-5" />
              {unreadMessages > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            <div className="flex items-center gap-3 pl-3 border-l">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{displayName}</p>
                <p className="text-xs text-gray-500">{displayEmail}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {userInitial}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE SIDEBAR BACKDROP */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl transform transition-transform duration-300
        lg:translate-x-0 lg:top-16 lg:h-[calc(100vh-4rem)] lg:shadow-none lg:border-r
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile Header */}
        <div className="lg:hidden h-16 flex items-center justify-between px-4 border-b">
          <span className="font-bold text-gray-900">Menu</span>
          <button onClick={() => setSidebarOpen(false)} className="p-2 text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          <nav className="space-y-1">
            {NAVIGATION.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/customer/dashboard' && pathname?.startsWith(item.href))
              return (
                <Link
                  key={item.href}
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

        {/* Logout Button */}
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

      {/* MAIN CONTENT */}
      <main className="lg:pl-72 pt-16">
        <div className="p-4 lg:p-6 min-h-[calc(100vh-4rem)] pb-20 lg:pb-6">
          {children}
        </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40">
        <div className="flex items-center justify-around h-16">
          {NAVIGATION.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 ${
                pathname === item.href || pathname?.includes(item.href.split('/').pop() || 'x')
                  ? 'text-blue-600'
                  : 'text-gray-400'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.name.split(' ')[0]}</span>
            </Link>
          ))}
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
