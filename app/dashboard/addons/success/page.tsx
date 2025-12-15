import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Success! | CR Realtor Platform',
}

const ADDON_NAMES: Record<string, string> = {
  'education': 'Education Center',
  'crm': 'Lead Scoring & CRM Pro',
  'vendors': 'Vendor Network',
  'marketing': 'Property Marketing Suite',
  'ai-assistant': 'AI Assistant Pro',
  'full-bundle': 'Complete Realtor Suite',
}

const ADDON_PATHS: Record<string, string> = {
  'education': '/dashboard/education',
  'crm': '/dashboard/crm',
  'vendors': '/dashboard/vendors',
  'marketing': '/dashboard/marketing',
  'ai-assistant': '/dashboard/assistant',
  'full-bundle': '/dashboard',
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string; addon?: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/auth/login')

  const addonId = searchParams.addon || 'education'
  const addonName = ADDON_NAMES[addonId] || 'Add-On'
  const addonPath = ADDON_PATHS[addonId] || '/dashboard'

  // Record the subscription in our database (webhook will also do this, but belt & suspenders)
  if (searchParams.session_id) {
    await supabase.from('addon_subscriptions').upsert({
      user_id: user.id,
      addon_id: addonId,
      status: 'active',
      stripe_session_id: searchParams.session_id,
      started_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,addon_id'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={48} />
          </div>
          
          <h1 className="text-3xl font-bold mb-2">You're All Set!</h1>
          <p className="text-gray-600 mb-6">
            <span className="font-semibold text-green-600">{addonName}</span> has been activated on your account.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <Sparkles className="text-amber-500" size={20} />
              <span>Your add-on is ready to use!</span>
            </div>
          </div>

          <Link href={addonPath}>
            <button className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 flex items-center justify-center gap-2 mb-4">
              Go to {addonName} <ArrowRight size={18} />
            </button>
          </Link>

          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
            Return to Dashboard
          </Link>
        </div>

        <p className="text-sm text-gray-400 mt-6">
          A receipt has been sent to your email.
        </p>
      </div>
    </div>
  )
}
