// app/dashboard/vendors/page.tsx
// Agent Vendor Rolodex Management
// Created: December 1, 2025 - 1:32 PM EST

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Building2, Plus, Search, Phone, Mail, Globe, MapPin, Star, 
  Edit, Trash2, DollarSign, ChevronDown, ChevronUp, X, Check,
  Briefcase, Shield, Clock, Users, Filter, MoreVertical
} from 'lucide-react'

const VENDOR_CATEGORIES = [
  { value: 'home_inspector', label: 'Home Inspector', icon: '🔍' },
  { value: 'mortgage_lender', label: 'Mortgage Lender', icon: '🏦' },
  { value: 'title_company', label: 'Title Company', icon: '📋' },
  { value: 'insurance', label: 'Home Insurance', icon: '🛡️' },
  { value: 'appraiser', label: 'Appraiser', icon: '📊' },
  { value: 'attorney', label: 'Real Estate Attorney', icon: '⚖️' },
  { value: 'contractor', label: 'General Contractor', icon: '🔨' },
  { value: 'electrician', label: 'Electrician', icon: '⚡' },
  { value: 'plumber', label: 'Plumber', icon: '🔧' },
  { value: 'hvac', label: 'HVAC', icon: '❄️' },
  { value: 'roofer', label: 'Roofing', icon: '🏠' },
  { value: 'pest_control', label: 'Pest Control', icon: '🐜' },
  { value: 'landscaper', label: 'Landscaper', icon: '🌳' },
  { value: 'pool_service', label: 'Pool Service', icon: '🏊' },
  { value: 'moving_company', label: 'Moving Company', icon: '🚚' },
  { value: 'cleaning_service', label: 'Cleaning Service', icon: '🧹' },
  { value: 'photographer', label: 'Photographer', icon: '📷' },
  { value: 'stager', label: 'Home Stager', icon: '🛋️' },
  { value: 'surveyor', label: 'Land Surveyor', icon: '📐' },
  { value: 'other', label: 'Other', icon: '📦' },
]

interface Vendor {
  id: string
  business_name: string
  contact_name: string | null
  email: string | null
  phone: string | null
  website: string | null
  address_line1: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  category: string
  description: string | null
  license_number: string | null
  years_in_business: number | null
  agent_rating: number | null
  agent_notes: string | null
  is_preferred: boolean
  is_active: boolean
  created_at: string
  vendor_services?: VendorService[]
  vendor_commissions?: VendorCommission[]
}

interface VendorService {
  id: string
  service_name: string
  description: string | null
  price_range: string | null
  turnaround_time: string | null
  tags: string[] | null
}

interface VendorCommission {
  id: string
  commission_type: string
  commission_amount: number | null
  commission_notes: string | null
  agreement_date: string | null
  agreement_expires: string | null
}

export default function AgentVendorsPage() {
  const supabase = createClient()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)
  const [expandedVendor, setExpandedVendor] = useState<string | null>(null)
  const [showCommissionModal, setShowCommissionModal] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    business_name: '',
    contact_name: '',
    email: '',
    phone: '',
    website: '',
    address_line1: '',
    city: '',
    state: '',
    zip_code: '',
    category: 'home_inspector',
    description: '',
    license_number: '',
    years_in_business: '',
    agent_rating: 0,
    agent_notes: '',
    is_preferred: false,
  })

  const [commissionData, setCommissionData] = useState({
    commission_type: 'flat',
    commission_amount: '',
    commission_notes: '',
    agreement_date: '',
    agreement_expires: '',
  })

  const [serviceForm, setServiceForm] = useState({
    service_name: '',
    description: '',
    price_range: '',
    turnaround_time: '',
    tags: '',
  })

  useEffect(() => {
    loadVendors()
  }, [])

  async function loadVendors() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('vendors')
      .select(`
        *,
        vendor_services(*),
        vendor_commissions(*)
      `)
      .eq('agent_id', user.id)
      .order('is_preferred', { ascending: false })
      .order('business_name')

    if (!error && data) {
      setVendors(data)
    }
    setLoading(false)
  }

  async function saveVendor() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const vendorPayload = {
      agent_id: user.id,
      business_name: formData.business_name,
      contact_name: formData.contact_name || null,
      email: formData.email || null,
      phone: formData.phone || null,
      website: formData.website || null,
      address_line1: formData.address_line1 || null,
      city: formData.city || null,
      state: formData.state || null,
      zip_code: formData.zip_code || null,
      category: formData.category,
      description: formData.description || null,
      license_number: formData.license_number || null,
      years_in_business: formData.years_in_business ? parseInt(formData.years_in_business) : null,
      agent_rating: formData.agent_rating || null,
      agent_notes: formData.agent_notes || null,
      is_preferred: formData.is_preferred,
      is_active: true,
    }

    if (editingVendor) {
      await supabase.from('vendors').update(vendorPayload).eq('id', editingVendor.id)
    } else {
      await supabase.from('vendors').insert(vendorPayload)
    }

    resetForm()
    loadVendors()
  }

  async function deleteVendor(id: string) {
    if (!confirm('Delete this vendor? This cannot be undone.')) return
    await supabase.from('vendors').delete().eq('id', id)
    loadVendors()
  }

  async function togglePreferred(vendor: Vendor) {
    await supabase.from('vendors').update({ is_preferred: !vendor.is_preferred }).eq('id', vendor.id)
    loadVendors()
  }

  async function saveCommission(vendorId: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const payload = {
      vendor_id: vendorId,
      agent_id: user.id,
      commission_type: commissionData.commission_type,
      commission_amount: commissionData.commission_amount ? parseFloat(commissionData.commission_amount) : null,
      commission_notes: commissionData.commission_notes || null,
      agreement_date: commissionData.agreement_date || null,
      agreement_expires: commissionData.agreement_expires || null,
    }

    await supabase.from('vendor_commissions').upsert(payload, { onConflict: 'vendor_id,agent_id' })
    setShowCommissionModal(null)
    setCommissionData({ commission_type: 'flat', commission_amount: '', commission_notes: '', agreement_date: '', agreement_expires: '' })
    loadVendors()
  }

  async function addService(vendorId: string) {
    if (!serviceForm.service_name) return

    await supabase.from('vendor_services').insert({
      vendor_id: vendorId,
      service_name: serviceForm.service_name,
      description: serviceForm.description || null,
      price_range: serviceForm.price_range || null,
      turnaround_time: serviceForm.turnaround_time || null,
      tags: serviceForm.tags ? serviceForm.tags.split(',').map(t => t.trim()) : null,
    })

    setServiceForm({ service_name: '', description: '', price_range: '', turnaround_time: '', tags: '' })
    loadVendors()
  }

  async function deleteService(serviceId: string) {
    await supabase.from('vendor_services').delete().eq('id', serviceId)
    loadVendors()
  }

  function resetForm() {
    setFormData({
      business_name: '', contact_name: '', email: '', phone: '', website: '',
      address_line1: '', city: '', state: '', zip_code: '', category: 'home_inspector',
      description: '', license_number: '', years_in_business: '', agent_rating: 0,
      agent_notes: '', is_preferred: false,
    })
    setEditingVendor(null)
    setShowAddModal(false)
  }

  function openEditModal(vendor: Vendor) {
    setFormData({
      business_name: vendor.business_name,
      contact_name: vendor.contact_name || '',
      email: vendor.email || '',
      phone: vendor.phone || '',
      website: vendor.website || '',
      address_line1: vendor.address_line1 || '',
      city: vendor.city || '',
      state: vendor.state || '',
      zip_code: vendor.zip_code || '',
      category: vendor.category,
      description: vendor.description || '',
      license_number: vendor.license_number || '',
      years_in_business: vendor.years_in_business?.toString() || '',
      agent_rating: vendor.agent_rating || 0,
      agent_notes: vendor.agent_notes || '',
      is_preferred: vendor.is_preferred,
    })
    setEditingVendor(vendor)
    setShowAddModal(true)
  }

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = !searchQuery || 
      v.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.vendor_services?.some(s => 
        s.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    const matchesCategory = !categoryFilter || v.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const getCategoryInfo = (cat: string) => VENDOR_CATEGORIES.find(c => c.value === cat) || { label: cat, icon: '📦' }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Rolodex</h1>
          <p className="text-gray-600">Manage your trusted service providers</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Add Vendor
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search vendors, services, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {VENDOR_CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-500">Total Vendors</p>
          <p className="text-2xl font-bold">{vendors.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-500">Preferred</p>
          <p className="text-2xl font-bold text-yellow-600">{vendors.filter(v => v.is_preferred).length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-500">With Commission</p>
          <p className="text-2xl font-bold text-green-600">
            {vendors.filter(v => v.vendor_commissions && v.vendor_commissions.length > 0).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-500">Categories</p>
          <p className="text-2xl font-bold">{new Set(vendors.map(v => v.category)).size}</p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading vendors...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && vendors.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors yet</h3>
          <p className="text-gray-500 mb-4">Add your trusted service providers to share with customers</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Your First Vendor
          </button>
        </div>
      )}

      {/* Vendor List */}
      {!loading && filteredVendors.length > 0 && (
        <div className="space-y-4">
          {filteredVendors.map(vendor => {
            const catInfo = getCategoryInfo(vendor.category)
            const isExpanded = expandedVendor === vendor.id
            const commission = vendor.vendor_commissions?.[0]

            return (
              <div key={vendor.id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
                {/* Main Row */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                        {catInfo.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{vendor.business_name}</h3>
                          {vendor.is_preferred && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" /> Preferred
                            </span>
                          )}
                          {commission && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1">
                              <DollarSign className="w-3 h-3" /> Commission
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{catInfo.label}</p>
                        {vendor.contact_name && (
                          <p className="text-sm text-gray-600 mt-1">{vendor.contact_name}</p>
                        )}
                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                          {vendor.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-4 h-4" /> {vendor.phone}
                            </span>
                          )}
                          {vendor.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" /> {vendor.email}
                            </span>
                          )}
                          {vendor.city && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" /> {vendor.city}, {vendor.state}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => togglePreferred(vendor)}
                        className={`p-2 rounded-lg ${vendor.is_preferred ? 'text-yellow-600 bg-yellow-50' : 'text-gray-400 hover:bg-gray-100'}`}
                        title={vendor.is_preferred ? 'Remove from preferred' : 'Mark as preferred'}
                      >
                        <Star className={`w-5 h-5 ${vendor.is_preferred ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => setShowCommissionModal(vendor.id)}
                        className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"
                        title="Set commission"
                      >
                        <DollarSign className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openEditModal(vendor)}
                        className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteVendor(vendor.id)}
                        className="p-2 rounded-lg text-red-400 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setExpandedVendor(isExpanded ? null : vendor.id)}
                        className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t bg-gray-50 p-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Left Column - Details */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Details</h4>
                        {vendor.description && (
                          <p className="text-sm text-gray-600 mb-3">{vendor.description}</p>
                        )}
                        <div className="space-y-2 text-sm">
                          {vendor.website && (
                            <p><span className="text-gray-500">Website:</span> <a href={vendor.website} target="_blank" className="text-blue-600 hover:underline">{vendor.website}</a></p>
                          )}
                          {vendor.license_number && (
                            <p><span className="text-gray-500">License:</span> {vendor.license_number}</p>
                          )}
                          {vendor.years_in_business && (
                            <p><span className="text-gray-500">Years in Business:</span> {vendor.years_in_business}</p>
                          )}
                          {vendor.agent_rating && (
                            <p><span className="text-gray-500">Your Rating:</span> {'⭐'.repeat(vendor.agent_rating)}</p>
                          )}
                        </div>

                        {/* Private Notes */}
                        {vendor.agent_notes && (
                          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <p className="text-xs text-yellow-800 font-medium mb-1">🔒 Private Notes</p>
                            <p className="text-sm text-yellow-900">{vendor.agent_notes}</p>
                          </div>
                        )}

                        {/* Commission Info (Private) */}
                        {commission && (
                          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-xs text-green-800 font-medium mb-1">🔒 Commission Agreement</p>
                            <p className="text-sm text-green-900">
                              {commission.commission_type === 'flat' && `$${commission.commission_amount} flat fee`}
                              {commission.commission_type === 'percentage' && `${commission.commission_amount}% per deal`}
                              {commission.commission_type === 'per_deal' && `$${commission.commission_amount} per deal`}
                            </p>
                            {commission.commission_notes && (
                              <p className="text-xs text-green-700 mt-1">{commission.commission_notes}</p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right Column - Services */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Services Offered</h4>
                        {vendor.vendor_services && vendor.vendor_services.length > 0 ? (
                          <div className="space-y-2">
                            {vendor.vendor_services.map(service => (
                              <div key={service.id} className="p-3 bg-white rounded-lg border">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <p className="font-medium text-gray-900">{service.service_name}</p>
                                    {service.description && (
                                      <p className="text-sm text-gray-500">{service.description}</p>
                                    )}
                                    <div className="flex gap-3 mt-1 text-xs text-gray-500">
                                      {service.price_range && <span>💰 {service.price_range}</span>}
                                      {service.turnaround_time && <span>⏱️ {service.turnaround_time}</span>}
                                    </div>
                                    {service.tags && service.tags.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {service.tags.map(tag => (
                                          <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => deleteService(service.id)}
                                    className="p-1 text-red-400 hover:bg-red-50 rounded"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No services added yet</p>
                        )}

                        {/* Add Service Form */}
                        <div className="mt-4 p-3 bg-white rounded-lg border">
                          <p className="text-sm font-medium text-gray-700 mb-2">Add Service</p>
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Service name"
                              value={serviceForm.service_name}
                              onChange={(e) => setServiceForm({ ...serviceForm, service_name: e.target.value })}
                              className="w-full px-3 py-2 border rounded text-sm"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                placeholder="Price range"
                                value={serviceForm.price_range}
                                onChange={(e) => setServiceForm({ ...serviceForm, price_range: e.target.value })}
                                className="px-3 py-2 border rounded text-sm"
                              />
                              <input
                                type="text"
                                placeholder="Turnaround"
                                value={serviceForm.turnaround_time}
                                onChange={(e) => setServiceForm({ ...serviceForm, turnaround_time: e.target.value })}
                                className="px-3 py-2 border rounded text-sm"
                              />
                            </div>
                            <input
                              type="text"
                              placeholder="Tags (comma separated)"
                              value={serviceForm.tags}
                              onChange={(e) => setServiceForm({ ...serviceForm, tags: e.target.value })}
                              className="w-full px-3 py-2 border rounded text-sm"
                            />
                            <button
                              onClick={() => addService(vendor.id)}
                              className="w-full py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                            >
                              Add Service
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Add/Edit Vendor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">{editingVendor ? 'Edit Vendor' : 'Add New Vendor'}</h2>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                  <input
                    type="text"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {VENDOR_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="https://"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address_line1}
                  onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Street address"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP</label>
                  <input
                    type="text"
                    value={formData.zip_code}
                    onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                  placeholder="Brief description of their services..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                  <input
                    type="text"
                    value={formData.license_number}
                    onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years in Business</label>
                  <input
                    type="number"
                    value={formData.years_in_business}
                    onChange={(e) => setFormData({ ...formData, years_in_business: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData({ ...formData, agent_rating: rating })}
                      className={`p-2 rounded ${formData.agent_rating >= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    >
                      <Star className={`w-6 h-6 ${formData.agent_rating >= rating ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Private Notes (only you see this)</label>
                <textarea
                  value={formData.agent_notes}
                  onChange={(e) => setFormData({ ...formData, agent_notes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={2}
                  placeholder="Your private notes about this vendor..."
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_preferred}
                  onChange={(e) => setFormData({ ...formData, is_preferred: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Mark as preferred vendor</span>
              </label>
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button onClick={resetForm} className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                Cancel
              </button>
              <button
                onClick={saveVendor}
                disabled={!formData.business_name}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {editingVendor ? 'Save Changes' : 'Add Vendor'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Commission Modal */}
      {showCommissionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">Commission Agreement</h2>
              <button onClick={() => setShowCommissionModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-500 bg-yellow-50 p-3 rounded-lg">
                🔒 This information is private and will never be shown to customers.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Commission Type</label>
                <select
                  value={commissionData.commission_type}
                  onChange={(e) => setCommissionData({ ...commissionData, commission_type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="flat">Flat Fee</option>
                  <option value="percentage">Percentage</option>
                  <option value="per_deal">Per Deal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {commissionData.commission_type === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={commissionData.commission_amount}
                  onChange={(e) => setCommissionData({ ...commissionData, commission_amount: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder={commissionData.commission_type === 'percentage' ? 'e.g., 5' : 'e.g., 250'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={commissionData.commission_notes}
                  onChange={(e) => setCommissionData({ ...commissionData, commission_notes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={2}
                  placeholder="Details about the agreement..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Agreement Date</label>
                  <input
                    type="date"
                    value={commissionData.agreement_date}
                    onChange={(e) => setCommissionData({ ...commissionData, agreement_date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expires</label>
                  <input
                    type="date"
                    value={commissionData.agreement_expires}
                    onChange={(e) => setCommissionData({ ...commissionData, agreement_expires: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowCommissionModal(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                Cancel
              </button>
              <button
                onClick={() => saveCommission(showCommissionModal)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Save Commission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
