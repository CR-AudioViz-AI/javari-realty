import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Building2, Lock, Zap, CheckCircle, Users, Shield, Star,
  Phone, Mail, Globe, Search, MapPin, ArrowRight
} from 'lucide-react'
import VendorDirectoryClient from './client'

export const metadata = {
  title: 'Vendor Network | CR Realtor Platform',
  description: 'Connect with trusted real estate service providers',
}

const VENDOR_CATEGORIES = [
  'Mortgage Lenders',
  'Title Companies', 
  'Home Inspectors',
  'Appraisers',
  'Insurance Agents',
  'Contractors',
  'Photographers',
  'Moving Companies',
  'Real Estate Attorneys',
  'Home Stagers',
]

export default async function VendorsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/auth/login')

  // Check if user has Vendor add-on
  const { data: addon } = await supabase
    .from('addon_subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .in('addon_id', ['vendors', 'full-bundle'])
    .eq('status', 'active')
    .single()

  const hasAccess = !!addon

  // Check for realtor subscription discount
  const { data: realtorSub } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  const hasRealtorAccount = !!realtorSub
  const discountPercent = hasRealtorAccount ? 20 : 0
  const basePrice = 29
  const finalPrice = Math.round(basePrice * (1 - discountPercent / 100))

  if (!hasAccess) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 text-white text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-4">
            <Building2 size={20} />
            <span className="font-medium">Premium Add-On</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Vendor Network</h1>
          <p className="text-xl text-green-100 mb-6 max-w-2xl mx-auto">
            Connect with 500+ verified service providers. Title companies, lenders, 
            inspectors, and more—all vetted and reviewed by other realtors.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <Users size={18} />
              <span>500+ Vendors</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <Shield size={18} />
              <span>Verified</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <Star size={18} />
              <span>Reviews</span>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-6 max-w-md mx-auto mb-6">
            {hasRealtorAccount && (
              <div className="text-sm text-green-200 mb-2">
                ✓ Realtor account discount applied!
              </div>
            )}
            <div className="flex items-center justify-center gap-3">
              {discountPercent > 0 && (
                <span className="text-2xl text-white/50 line-through">${basePrice}</span>
              )}
              <span className="text-5xl font-bold">${finalPrice}</span>
              <span className="text-xl text-white/70">/month</span>
            </div>
          </div>

          <Link href={`/dashboard/checkout?addon=vendors&discount=${discountPercent}`}>
            <button className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors">
              Unlock Vendor Network
            </button>
          </Link>
        </div>

        {/* Categories Preview */}
        <h2 className="text-2xl font-bold mb-6">11 Categories of Vendors</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
          {VENDOR_CATEGORIES.map(cat => (
            <div key={cat} className="bg-white rounded-lg border p-3 flex items-center gap-2 opacity-75">
              <Lock className="text-gray-400" size={16} />
              <span className="text-sm text-gray-600">{cat}</span>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="font-bold text-amber-800 mb-2">💡 Why Realtors Love This</h3>
          <ul className="space-y-2 text-amber-900">
            <li className="flex items-start gap-2">
              <CheckCircle size={18} className="text-amber-600 mt-0.5" />
              <span>Pre-vetted vendors save time on research</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={18} className="text-amber-600 mt-0.5" />
              <span>Real reviews from other realtors</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={18} className="text-amber-600 mt-0.5" />
              <span>Priority contact queue for faster responses</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={18} className="text-amber-600 mt-0.5" />
              <span>Track referrals and commissions (coming soon)</span>
            </li>
          </ul>
        </div>
      </div>
    )
  }

  // Full access
  return <VendorDirectoryClient />
}
