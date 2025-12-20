'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Users, Search, Plus, Filter, Phone, Mail, Eye, Edit,
  Calendar, Trash2, MoreVertical, ArrowUpRight, ArrowDownRight
} from 'lucide-react'

const LEADS = [
  { id: '1', name: 'Michael Johnson', email: 'michael@email.com', phone: '(239) 555-0123', budget: '$500K-$750K', area: 'Naples', source: 'Website', status: 'hot', type: 'Buyer', created: '2 hours ago' },
  { id: '2', name: 'Sarah Williams', email: 'sarah@email.com', phone: '(239) 555-0456', budget: '$400K-$600K', area: 'Cape Coral', source: 'Referral', status: 'warm', type: 'Buyer', created: '5 hours ago' },
  { id: '3', name: 'David Brown', email: 'david@email.com', phone: '(239) 555-0789', budget: 'Under $400K', area: 'Fort Myers', source: 'Zillow', status: 'new', type: 'Buyer', created: '1 day ago' },
  { id: '4', name: 'Jennifer Davis', email: 'jennifer@email.com', phone: '(239) 555-0321', budget: '$600K-$900K', area: 'Bonita Springs', source: 'Open House', status: 'warm', type: 'Seller', created: '2 days ago' },
  { id: '5', name: 'Robert Martinez', email: 'robert@email.com', phone: '(239) 555-0654', budget: '$450K-$550K', area: 'Cape Coral', source: 'Website', status: 'hot', type: 'Buyer', created: '3 days ago' },
  { id: '6', name: 'Lisa Anderson', email: 'lisa@email.com', phone: '(239) 555-0987', budget: '$700K-$850K', area: 'Naples', source: 'Referral', status: 'cold', type: 'Buyer', created: '1 week ago' },
  { id: '7', name: 'James Wilson', email: 'james@email.com', phone: '(239) 555-0147', budget: '$525,000', area: 'Fort Myers', source: 'Website', status: 'closed', type: 'Buyer', created: '2 weeks ago' }
]

export default function LeadsListPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')

  const filteredLeads = LEADS.filter(lead => {
    if (filterStatus !== 'all' && lead.status !== filterStatus) return false
    if (filterType !== 'all' && lead.type !== filterType) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return lead.name.toLowerCase().includes(query) ||
             lead.email.toLowerCase().includes(query) ||
             lead.area.toLowerCase().includes(query)
    }
    return true
  })

  const stats = {
    total: LEADS.length,
    hot: LEADS.filter(l => l.status === 'hot').length,
    warm: LEADS.filter(l => l.status === 'warm').length,
    new: LEADS.filter(l => l.status === 'new').length
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Leads</h1>
            <p className="text-gray-500">{stats.total} total leads • {stats.hot} hot, {stats.warm} warm, {stats.new} new</p>
          </div>
          <Link
            href="/dashboard/leads/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Add Lead
          </Link>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500">Total Leads</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-500">
            <div className="text-sm text-gray-500">Hot Leads</div>
            <div className="text-2xl font-bold text-red-600">{stats.hot}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-yellow-500">
            <div className="text-sm text-gray-500">Warm Leads</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.warm}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
            <div className="text-sm text-gray-500">New Leads</div>
            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="hot">Hot</option>
            <option value="warm">Warm</option>
            <option value="new">New</option>
            <option value="cold">Cold</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="Buyer">Buyers</option>
            <option value="Seller">Sellers</option>
          </select>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Lead</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Details</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">{lead.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-sm text-gray-500">{lead.type} • {lead.source}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${lead.email}`} className="hover:text-blue-600">{lead.email}</a>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${lead.phone}`} className="hover:text-blue-600">{lead.phone}</a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">{lead.area}</span>
                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-sm">{lead.budget}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{lead.created}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      lead.status === 'hot' ? 'bg-red-100 text-red-700' :
                      lead.status === 'warm' ? 'bg-yellow-100 text-yellow-700' :
                      lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                      lead.status === 'cold' ? 'bg-gray-100 text-gray-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="View">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="Edit">
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="Schedule">
                        <Calendar className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLeads.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No leads found</p>
              <Link href="/dashboard/leads/new" className="text-blue-600 hover:underline">
                Add your first lead
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
