import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function NewPropertyPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  async function createProperty(formData: FormData) {
    'use server'
    
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return
    
    const propertyData = {
      realtor_id: user.id,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      zip_code: formData.get('zip_code') as string,
      price: parseInt(formData.get('price') as string),
      bedrooms: parseInt(formData.get('bedrooms') as string) || 0,
      bathrooms: parseFloat(formData.get('bathrooms') as string) || 0,
      square_feet: parseInt(formData.get('square_feet') as string) || null,
      lot_size: parseInt(formData.get('lot_size') as string) || null,
      year_built: parseInt(formData.get('year_built') as string) || null,
      property_type: formData.get('property_type') as string,
      listing_type: formData.get('listing_type') as string,
      status: 'active',
      description: formData.get('description') as string,
      hoa_fee: parseInt(formData.get('hoa_fee') as string) || null,
      parking_spaces: parseInt(formData.get('parking_spaces') as string) || null
    }

    const { data, error } = await supabase
      .from('properties')
      .insert(propertyData)
      .select()
      .single()

    if (!error && data) {
      redirect(`/dashboard/properties`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Add New Property</h1>

      <form action={createProperty} className="max-w-4xl bg-white rounded-xl p-8 shadow-sm">
        <div className="space-y-6">
          {/* Address Section */}
          <div>
            <h2 className="text-xl font-bold mb-4">Property Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Street Address *</label>
                <input type="text" name="address" required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">City *</label>
                <input type="text" name="city" required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">State *</label>
                <select name="state" required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="FL">Florida</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">ZIP Code *</label>
                <input type="text" name="zip_code" required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div>
            <h2 className="text-xl font-bold mb-4">Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Property Type *</label>
                <select name="property_type" required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="single_family">Single Family</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="multi_family">Multi-Family</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Listing Type *</label>
                <select name="listing_type" required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Price *</label>
                <input type="number" name="price" required placeholder="350000" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bedrooms</label>
                <input type="number" name="bedrooms" placeholder="3" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bathrooms</label>
                <input type="number" step="0.5" name="bathrooms" placeholder="2" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Square Feet</label>
                <input type="number" name="square_feet" placeholder="2100" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Lot Size (sqft)</label>
                <input type="number" name="lot_size" placeholder="7500" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Year Built</label>
                <input type="number" name="year_built" placeholder="2015" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Parking Spaces</label>
                <input type="number" name="parking_spaces" placeholder="2" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">HOA Fee ($/month)</label>
                <input type="number" name="hoa_fee" placeholder="250" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-bold mb-4">Description</h2>
            <textarea name="description" rows={6} placeholder="Describe this property..." className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
          </div>

          {/* Submit */}
          <div className="flex space-x-4">
            <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
              Create Property
            </button>
            <Link href="/dashboard/properties" className="px-8 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
