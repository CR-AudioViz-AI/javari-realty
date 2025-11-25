'use client'

// components/PropertyFormMultiSelect.tsx
// Improved Property Form with Multi-Select Property Types


import { useState } from 'react'
import { CheckSquare, Square } from 'lucide-react'

const PROPERTY_TYPES = [
  { value: 'single_family', label: 'Single Family Home' },
  { value: 'condo', label: 'Condo' },
  { value: 'townhome', label: 'Townhome' },
  { value: 'multi_family', label: 'Multi-Family' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' }
]

interface PropertyFormMultiSelectProps {
  onSubmit: (data: any) => void
  initialData?: any
}

export default function PropertyFormMultiSelect({ onSubmit, initialData }: PropertyFormMultiSelectProps) {
  const [formData, setFormData] = useState({
    property_types: initialData?.property_types || [], // Array of types
    address: initialData?.address || '',
    city: initialData?.city || '',
    state: initialData?.state || 'FL',
    zip_code: initialData?.zip_code || '',
    price: initialData?.price || '',
    bedrooms: initialData?.bedrooms || '',
    bathrooms: initialData?.bathrooms || '',
    square_feet: initialData?.square_feet || '',
    description: initialData?.description || '',
    status: initialData?.status || 'active'
  })

  const togglePropertyType = (type: string) => {
    const types = formData.property_types
    if (types.includes(type)) {
      setFormData({
        ...formData,
        property_types: types.filter((t: string) => t !== type)
      })
    } else {
      setFormData({
        ...formData,
        property_types: [...types, type]
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.property_types.length === 0) {
      alert('Please select at least one property type')
      return
    }

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Property Types - Multi-Select */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Property Type * <span className="text-gray-500 font-normal">(Select all that apply)</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {PROPERTY_TYPES.map((type) => {
            const isSelected = formData.property_types.includes(type.value)
            
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => togglePropertyType(type.value)}
                className={`
                  flex items-center justify-between p-4 rounded-lg border-2 transition-all
                  ${isSelected 
                    ? 'border-blue-600 bg-blue-50 text-blue-900' 
                    : 'border-gray-200 hover:border-blue-600 bg-white'
                  }
                `}
              >
                <span className="font-medium">{type.label}</span>
                {isSelected ? (
                  <CheckSquare className="w-5 h-5 text-blue-600" />
                ) : (
                  <Square className="w-5 h-5 text-gray-400" />
                )}
              </button>
            )
          })}
        </div>
        {formData.property_types.length > 0 && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {formData.property_types.map((t: string) => 
              PROPERTY_TYPES.find(pt => pt.value === t)?.label
            ).join(', ')}
          </p>
        )}
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address *</label>
        <input
          type="text"
          required
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          placeholder="123 Main Street"
        />
      </div>

      {/* City, State, ZIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
          <input
            type="text"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="Fort Myers"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
          <select
            required
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          >
            <option value="FL">Florida</option>
            <option value="GA">Georgia</option>
            <option value="AL">Alabama</option>
            {/* Add more states as needed */}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP Code *</label>
          <input
            type="text"
            required
            value={formData.zip_code}
            onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="33901"
          />
        </div>
      </div>

      {/* Price, Beds, Baths, SqFt */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
          <input
            type="number"
            required
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="350000"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Bedrooms</label>
          <input
            type="number"
            value={formData.bedrooms}
            onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="3"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Bathrooms</label>
          <input
            type="number"
            step="0.5"
            value={formData.bathrooms}
            onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="2"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Square Feet</label>
          <input
            type="number"
            value={formData.square_feet}
            onChange={(e) => setFormData({ ...formData, square_feet: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="1800"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          placeholder="Beautiful home with..."
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
        >
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="sold">Sold</option>
        </select>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          {initialData ? 'Update Property' : 'Create Property'}
        </button>
      </div>
    </form>
  )
}
