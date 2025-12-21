'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    checkAccess()
  }, [])

  async function checkAccess() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const role = profile?.role || 'client'

      // Agent roles should go to agent dashboard
      const agentRoles = ['realtor', 'agent', 'broker', 'admin', 'platform_admin', 'team_lead']
      
      if (agentRoles.includes(role)) {
        // Redirect agents to their dashboard
        router.push('/dashboard')
        return
      }

      // Customer/client can access this portal
      setAuthorized(true)
      setLoading(false)
    } catch (error) {
      console.error('Error checking access:', error)
      router.push('/auth/login')
    }
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

  if (!authorized) {
    return null
  }

  // Simple layout - the page component handles everything
  return <>{children}</>
}
