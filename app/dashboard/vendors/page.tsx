'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Search, Plus, Phone, Mail, Globe, MapPin, Star, Building2,
  ClipboardCheck, Landmark, FileText, Shield, Calculator, Scale,
  Home, Truck, Hammer, Zap, Wrench, Wind, TreeDeciduous, Bug,
  Sparkles, Camera, Sofa, Map, MoreHorizontal, Filter, X,
  DollarSign, Eye, EyeOff, Send, Check, AlertCircle, Edit, Trash2
} from 'lucide-react'

// Category icons mapping
const categoryIcons: Record<string, any> = {
  'ClipboardCheck': ClipboardCheck,
  'Landmark': Landmark,
  'FileText': FileText,
  'Shield': Shield,
  'Calculator': Calculator,
  'Scale': Scale,
  'Home': Home,
  'Truck': Truck,
  'Hammer': Hammer,
  'Zap': Zap,
  'Wrench': Wrench,
  'Wind': Wind,
  'TreeDeciduous': TreeDeciduous,
  'Bug': Bug,
  'Sparkles': Sparkles,
  'Camera': Camera,
  'Sofa': Sofa,
  'Map': Map,
  'MoreHorizontal': MoreHorizontal,
}

interface VendorCategory {
  id: string
  name: string
  description: string
  icon: string
  display_order: number
}

interface Vendor {
  id: string
  category_id: string
  company_name: string
  contact_name: string | null
  email: string | null
  phone: string | null
  website: string | null
  city: string | null
  state: string | null
  description: string | null
  services: string[] | null
  service_areas: string[] | null
  average_rating: number
  total_reviews: number
  is_featured: boolean
  category?: VendorCategory
  agent_settings?: {
    commission_type: string | null
    commission_amount: number | null
    commission_notes: string | null
    private_notes: string | null
    is_preferred: boolean
    referral_count: number
  } | null
}

interface Customer {
  id: string
  first_name: string
  last_name: string
  email: string
}

export default function VendorRolodexPage() {
  const supabase = createClient()
  const [categories, setCategories] = useState<VendorCategory[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showCommissionModal, setShowCommissionModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [showCommissions, setShowCommissions] = useState(false)
  const [agentId, setAgentId] = useState<string | null>(null)

  // New vendor form state
  const [newVendor, setNewVendor] = useState({
    category_id: '',
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    website: '',
    city: '',
    state: '',
    description: '',
    services: '',
    service_areas: ''
  })

  // Commission form state
  const [commissionForm, setCommissionForm] = useState({
    commission_type: 'none',
    commission_amount: '',
    commission_notes: '',
    private_notes: '',
    is_preferred: false
  })

  // Share form state
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [shareMessage, setShareMessage] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setAgentId(user.id)

      // Load categories
      const { data: cats } = await supabase
        .from('vendor_categories')
        .select('*')
        .order('display_order')

      if (cats) setCategories(cats)

      // Load vendors with agent settings
      const { data: vendorData } = await supabase
        .from('vendors')
        .select(`
          *,
          category:vendor_categories(*),
          agent_settings:agent_vendor_settings(*)
        `)
        .eq('is_active', true)
        .order('company_name')

      if (vendorData) {
        // Flatten agent_settings (it comes as array, we want single object)
        const processedVendors = vendorData.map(v => ({
          ...v,
          agent_settings: v.agent_settings?.find((s: any) => s.agent_id === user.id) || null
        }))
        setVendors(processedVendors)
      }

      // Load customers
      const { data: customerData } = await supabase
        .from('customers')
        .select('id, first_name, last_name, email')
        .eq('assigned_agent_id', user.id)
        .eq('status', 'active')
        .order('last_name')

      if (customerData) setCustomers(customerData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function addVendor() {
    if (!newVendor.company_name || !newVendor.category_id) {
      alert('Please fill in required fields')
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single()

      if (!profile) return

      const { data, error } = await supabase
        .from('vendors')
        .insert({
          organization_id: profile.organization_id,
          created_by_agent_id: user.id,
          category_id: newVendor.category_id,
          company_name: newVendor.company_name,
          contact_name: newVendor.contact_name || null,
          email: newVendor.email || null,
          phone: newVendor.phone || null,
          website: newVendor.website || null,
          city: newVendor.city || null,
          state: newVendor.state || null,
          description: newVendor.description || null,
          services: newVendor.services ? newVendor.services.split(',').map(s => s.trim()) : null,
          service_areas: newVendor.service_areas ? newVendor.service_areas.split(',').map(s => s.trim()) : null
        })
        .select()
        .single()

      if (error) throw error

      setShowAddModal(false)
      setNewVendor({
        category_id: '',
        company_name: '',
        contact_name: '',
        email: '',
        phone: '',
        website: '',
        city: '',
        state: '',
        description: '',
        services: '',
        service_areas: ''
      })
      loadData()
    } catch (error) {
      console.error('Error adding vendor:', error)
      alert('Failed to add vendor')
    }
  }

  async function saveCommissionSettings() {
    if (!selectedVendor || !agentId) return

    try {
      const { error } = await supabase
        .from('agent_vendor_settings')
        .upsert({
          agent_id: agentId,
          vendor_id: selectedVendor.id,
          commission_type: commissionForm.commission_type || null,
          commission_amount: commissionForm.commission_amount ? parseFloat(commissionForm.commission_amount) : null,
          commission_notes: commissionForm.commission_notes || null,
          private_notes: commissionForm.private_notes || null,
          is_preferred: commissionForm.is_preferred
        }, {
          onConflict: 'agent_id,vendor_id'
        })

      if (error) throw error

      setShowCommissionModal(false)
      loadData()
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    }
  }

  async function shareWithCustomers() {
    if (!selectedVendor || selectedCustomers.length === 0 || !agentId) return

    try {
      const referrals = selectedCustomers.map(customerId => ({
        customer_id: customerId,
        vendor_id: selectedVendor.id,
        referred_by_agent_id: agentId
      }))

      const { error } = await supabase
        .from('customer_vendor_referrals')
        .insert(referrals)

      if (error) throw error

      // Update referral count
      await supabase
        .from('agent_vendor_settings')
        .upsert({
          agent_id: agentId,
          vendor_id: selectedVendor.id,
          referral_count: (selectedVendor.agent_settings?.referral_count || 0) + selectedCustomers.length,
          last_referral_date: new Date().toISOString()
        }, {
          onConflict: 'agent_id,vendor_id'
        })

      setShowShareModal(false)
      setSelectedCustomers([])
      setShareMessage('')
      alert(`Shared ${selectedVendor.company_name} with ${selectedCustomers.length} customer(s)`)
      loadData()
    } catch (error) {
      console.error('Error sharing:', error)
      alert('Failed to share vendor')
    }
  }

  // Filter vendors
  const filteredVendors = vendors.filter(v => {
    const matchesSearch = searchTerm === '' || 
      v.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.services?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      v.city?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = !selectedCategory || v.category_id === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Sort: preferred first, then by name
  const sortedVendors = [...filteredVendors].sort((a, b) => {
    if (a.agent_settings?.is_preferred && !b.agent_settings?.is_preferred) return -1
    if (!a.agent_settings?.is_preferred && b.agent_settings?.is_preferred) return 1
    return a.company_name.localeCompare(b.company_name)
  })

  const formatCommission = (vendor: Vendor) => {
    const settings = vendor.agent_settings
    if (!settings?.commission_type || settings.commission_type === 'none') return null
    
    if (settings.commission_type === 'percentage') {
      return `${settings.commission_amount}%`
    } else if (settings.commission_type === 'flat') {
      return `$${settings.commission_amount?.toLocaleString()}`
    } else if (settings.commission_type === 'per_deal') {
      return `$${settings.commission_amount?.toLocaleString()}/deal`
    }
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Rolodex</h1>
          <p className="text-gray-500 mt-1">Manage your trusted service providers</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCommissions(!showCommissions)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              showCommissions 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {showCommissions ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {showCommissions ? 'Hide Commissions' : 'Show Commissions'}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Vendor
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search vendors by name, service, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Category Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.slice(0, 10).map(cat => {
          const IconComponent = categoryIcons[cat.icon] || Building2
          const isSelected = selectedCategory === cat.id
          const count = vendors.filter(v => v.category_id === cat.id).length
          
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                isSelected
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {cat.name}
              <span className="text-xs bg-white/50 px-1.5 rounded-full">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Vendors Grid */}
      {sortedVendors.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No vendors found</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 text-blue-600 hover:underline"
          >
            Add your first vendor
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedVendors.map(vendor => {
            const IconComponent = categoryIcons[vendor.category?.icon || 'Building2'] || Building2
            const commission = formatCommission(vendor)
            
            return (
              <div
                key={vendor.id}
                className={`bg-white rounded-lg border p-4 hover:shadow-md transition-shadow ${
                  vendor.agent_settings?.is_preferred ? 'border-yellow-300 bg-yellow-50/30' : 'border-gray-200'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      vendor.agent_settings?.is_preferred ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      <IconComponent className={`w-5 h-5 ${
                        vendor.agent_settings?.is_preferred ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        {vendor.company_name}
                        {vendor.agent_settings?.is_preferred && (
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </h3>
                      <p className="text-sm text-gray-500">{vendor.category?.name}</p>
                    </div>
                  </div>
                  {showCommissions && commission && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {commission}
                    </span>
                  )}
                </div>

                {/* Contact Info */}
                <div className="space-y-1 text-sm mb-3">
                  {vendor.contact_name && (
                    <p className="text-gray-600">{vendor.contact_name}</p>
                  )}
                  {vendor.phone && (
                    <a href={`tel:${vendor.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                      <Phone className="w-3 h-3" />
                      {vendor.phone}
                    </a>
                  )}
                  {vendor.email && (
                    <a href={`mailto:${vendor.email}`} className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                      <Mail className="w-3 h-3" />
                      {vendor.email}
                    </a>
                  )}
                  {(vendor.city || vendor.state) && (
                    <p className="flex items-center gap-2 text-gray-500">
                      <MapPin className="w-3 h-3" />
                      {[vendor.city, vendor.state].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>

                {/* Services */}
                {vendor.services && vendor.services.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {vendor.services.slice(0, 3).map((service, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {service}
                      </span>
                    ))}
                    {vendor.services.length > 3 && (
                      <span className="text-xs text-gray-400">+{vendor.services.length - 3} more</span>
                    )}
                  </div>
                )}

                {/* Rating & Referrals */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  {vendor.average_rating > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {vendor.average_rating.toFixed(1)} ({vendor.total_reviews})
                    </span>
                  )}
                  {vendor.agent_settings?.referral_count ? (
                    <span>{vendor.agent_settings.referral_count} referrals sent</span>
                  ) : null}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t">
                  <button
                    onClick={() => {
                      setSelectedVendor(vendor)
                      setCommissionForm({
                        commission_type: vendor.agent_settings?.commission_type || 'none',
                        commission_amount: vendor.agent_settings?.commission_amount?.toString() || '',
                        commission_notes: vendor.agent_settings?.commission_notes || '',
                        private_notes: vendor.agent_settings?.private_notes || '',
                        is_preferred: vendor.agent_settings?.is_preferred || false
                      })
                      setShowCommissionModal(true)
                    }}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
                  >
                    <Edit className="w-4 h-4" />
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      setSelectedVendor(vendor)
                      setShowShareModal(true)
                    }}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Send className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Add New Vendor</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={newVendor.category_id}
                    onChange={(e) => setNewVendor({ ...newVendor, category_id: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select category...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    value={newVendor.company_name}
                    onChange={(e) => setNewVendor({ ...newVendor, company_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                    <input
                      type="text"
                      value={newVendor.contact_name}
                      onChange={(e) => setNewVendor({ ...newVendor, contact_name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={newVendor.phone}
                      onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newVendor.email}
                    onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={newVendor.website}
                    onChange={(e) => setNewVendor({ ...newVendor, website: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={newVendor.city}
                      onChange={(e) => setNewVendor({ ...newVendor, city: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      value={newVendor.state}
                      onChange={(e) => setNewVendor({ ...newVendor, state: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newVendor.description}
                    onChange={(e) => setNewVendor({ ...newVendor, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Services (comma-separated)</label>
                  <input
                    type="text"
                    value={newVendor.services}
                    onChange={(e) => setNewVendor({ ...newVendor, services: e.target.value })}
                    placeholder="e.g., Home Inspection, Radon Testing, Mold Testing"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Areas (comma-separated)</label>
                  <input
                    type="text"
                    value={newVendor.service_areas}
                    onChange={(e) => setNewVendor({ ...newVendor, service_areas: e.target.value })}
                    placeholder="e.g., Naples, Fort Myers, Cape Coral"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addVendor}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Vendor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Commission Settings Modal */}
      {showCommissionModal && selectedVendor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Vendor Settings</h2>
                <button onClick={() => setShowCommissionModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-600 mb-4">{selectedVendor.company_name}</p>

              <div className="space-y-4">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={commissionForm.is_preferred}
                    onChange={(e) => setCommissionForm({ ...commissionForm, is_preferred: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>Mark as Preferred Vendor</span>
                </label>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800 flex items-center gap-2">
                    <EyeOff className="w-4 h-4" />
                    Commission info is private and never shown to customers
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Commission Type</label>
                  <select
                    value={commissionForm.commission_type}
                    onChange={(e) => setCommissionForm({ ...commissionForm, commission_type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="none">No Commission</option>
                    <option value="flat">Flat Fee</option>
                    <option value="percentage">Percentage</option>
                    <option value="per_deal">Per Deal</option>
                  </select>
                </div>

                {commissionForm.commission_type !== 'none' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {commissionForm.commission_type === 'percentage' ? 'Percentage' : 'Amount ($)'}
                    </label>
                    <input
                      type="number"
                      value={commissionForm.commission_amount}
                      onChange={(e) => setCommissionForm({ ...commissionForm, commission_amount: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Commission Notes</label>
                  <textarea
                    value={commissionForm.commission_notes}
                    onChange={(e) => setCommissionForm({ ...commissionForm, commission_notes: e.target.value })}
                    rows={2}
                    placeholder="e.g., Paid monthly, net 30"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Private Notes</label>
                  <textarea
                    value={commissionForm.private_notes}
                    onChange={(e) => setCommissionForm({ ...commissionForm, private_notes: e.target.value })}
                    rows={2}
                    placeholder="Personal notes about this vendor..."
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCommissionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveCommissionSettings}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share with Customers Modal */}
      {showShareModal && selectedVendor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Share Vendor</h2>
                <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg mb-4">
                <p className="font-medium text-blue-900">{selectedVendor.company_name}</p>
                <p className="text-sm text-blue-700">{selectedVendor.category?.name}</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Customers</label>
                <div className="border rounded-lg max-h-48 overflow-y-auto">
                  {customers.length === 0 ? (
                    <p className="p-4 text-center text-gray-500">No customers found</p>
                  ) : (
                    customers.map(customer => (
                      <label
                        key={customer.id}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-0"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCustomers.includes(customer.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCustomers([...selectedCustomers, customer.id])
                            } else {
                              setSelectedCustomers(selectedCustomers.filter(id => id !== customer.id))
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <div>
                          <p className="font-medium">{customer.first_name} {customer.last_name}</p>
                          <p className="text-sm text-gray-500">{customer.email}</p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                Selected: {selectedCustomers.length} customer(s)
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={shareWithCustomers}
                  disabled={selectedCustomers.length === 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
