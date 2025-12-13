'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Building2, Save, Loader2, DollarSign, Home, Factory, Store } from 'lucide-react'
import Link from 'next/link'

export default function NewPropertyPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    title: '', address: '', city: '', state: 'FL', zip_code: '', county: '',
    category: 'residential', property_type: 'single_family', listing_type: 'for_sale',
    price: '', rent_amount: '', rent_frequency: 'monthly', security_deposit: '',
    lease_term_months: '', bedrooms: '', bathrooms: '', sqft: '', lot_size: '',
    year_built: '', available_date: '', pets_allowed: false, furnished: false,
    status: 'active', description: '', mls_id: ''
  })

  const propertyCategories = [
    { value: 'residential', label: 'Residential', icon: Home },
    { value: 'commercial', label: 'Commercial', icon: Store },
    { value: 'industrial', label: 'Industrial', icon: Factory },
    { value: 'land', label: 'Land', icon: Building2 },
  ]

  const propertyTypes: Record<string, { value: string; label: string }[]> = {
    residential: [
      { value: 'single_family', label: 'Single Family' },
      { value: 'condo', label: 'Condo' },
      { value: 'townhouse', label: 'Townhouse' },
      { value: 'villa', label: 'Villa' },
      { value: 'multi_family', label: 'Multi-Family' },
    ],
    commercial: [
      { value: 'office', label: 'Office' },
      { value: 'retail', label: 'Retail' },
      { value: 'commercial', label: 'Commercial' },
    ],
    industrial: [
      { value: 'warehouse', label: 'Warehouse' },
      { value: 'industrial', label: 'Industrial' },
    ],
    land: [
      { value: 'land', label: 'Vacant Land' },
      { value: 'farm_ranch', label: 'Farm/Ranch' },
    ],
  }

  const listingTypes = [
    { value: 'for_sale', label: 'For Sale', color: 'bg-green-100 text-green-700 border-green-300' },
    { value: 'for_rent', label: 'For Rent', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    { value: 'for_lease', label: 'For Lease', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const isRental = formData.listing_type === 'for_rent' || formData.listing_type === 'for_lease'
      
      const propertyData: Record<string, unknown> = {
        agent_id: user.id,
        title: formData.title || formData.address,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        county: formData.county || null,
        property_type: formData.property_type,
        status: formData.status,
        description: formData.description || null,
        mls_id: formData.mls_id || null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
        sqft: formData.sqft ? parseInt(formData.sqft) : null,
        lot_size: formData.lot_size ? parseFloat(formData.lot_size) : null,
        year_built: formData.year_built ? parseInt(formData.year_built) : null,
        price: isRental 
          ? (formData.rent_amount ? parseFloat(formData.rent_amount) : 0)
          : (formData.price ? parseFloat(formData.price) : 0),
      }

      const { error: insertError } = await supabase.from('properties').insert(propertyData)
      if (insertError) throw insertError
      router.push('/dashboard/properties')
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to add property')
    } finally {
      setLoading(false)
    }
  }

  const isRental = formData.listing_type === 'for_rent' || formData.listing_type === 'for_lease'

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/properties" className="p-2 hover:bg-gray-100 rounded-lg transition">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Property</h1>
          <p className="text-gray-500">Residential, Commercial, or Industrial</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Listing Type</h2>
          <div className="grid grid-cols-3 gap-4">
            {listingTypes.map((type) => (
              <button key={type.value} type="button"
                onClick={() => setFormData({ ...formData, listing_type: type.value })}
                className={`p-4 rounded-xl border-2 text-center font-medium transition ${
                  formData.listing_type === type.value
                    ? type.color + ' border-current' : 'bg-white border-gray-200 hover:border-gray-300'
                }`}>
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Property Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {propertyCategories.map((cat) => (
              <button key={cat.value} type="button"
                onClick={() => setFormData({ 
                  ...formData, category: cat.value,
                  property_type: propertyTypes[cat.value]?.[0]?.value || 'single_family'
                })}
                className={`p-4 rounded-xl border-2 text-center transition ${
                  formData.category === cat.value
                    ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 hover:border-gray-300'
                }`}>
                <cat.icon className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Property Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {(propertyTypes[formData.category] || propertyTypes.residential).map((type) => (
              <button key={type.value} type="button"
                onClick={() => setFormData({ ...formData, property_type: type.value })}
                className={`p-3 rounded-xl border text-sm font-medium transition ${
                  formData.property_type === type.value
                    ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 hover:border-gray-300'
                }`}>
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="Gulf Access Home with Pool" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <input type="text" required value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="123 Main Street" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input type="text" required value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="Naples" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input type="text" value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP</label>
                <input type="text" value={formData.zip_code}
                  onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="34102" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">MLS ID</label>
              <input type="text" value={formData.mls_id}
                onChange={(e) => setFormData({ ...formData, mls_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="224012345" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-green-600" />
            <h2 className="font-semibold text-gray-900">{isRental ? 'Rental Pricing' : 'Sale Price'}</h2>
          </div>
          {isRental ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rent Amount *</label>
                <input type="number" required value={formData.rent_amount}
                  onChange={(e) => setFormData({ ...formData, rent_amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="2500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit</label>
                <input type="number" value={formData.security_deposit}
                  onChange={(e) => setFormData({ ...formData, security_deposit: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="2500" />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price *</label>
              <input type="number" required value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="450000" />
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.category === 'residential' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                  <input type="number" value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                  <input type="number" step="0.5" value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sq Ft</label>
              <input type="number" value={formData.sqft}
                onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year Built</label>
              <input type="number" value={formData.year_built}
                onChange={(e) => setFormData({ ...formData, year_built: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Description</h2>
          <textarea value={formData.description} rows={4}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the property..." />
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/dashboard/properties"
            className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition">Cancel</Link>
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? 'Saving...' : 'Save Property'}
          </button>
        </div>
      </form>
    </div>
  )
}
