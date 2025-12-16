'use client'

import { useState } from 'react'
import {
  Users, Gift, DollarSign, TrendingUp, Plus, Search,
  Mail, Phone, Calendar, Star, Award, ArrowRight,
  CheckCircle, Clock, AlertCircle, Heart, Share2
} from 'lucide-react'

interface Referral {
  id: string
  referrerName: string
  referrerEmail: string
  referrerPhone: string
  referredName: string
  referredEmail: string
  referredPhone: string
  type: 'buyer' | 'seller' | 'both'
  status: 'new' | 'contacted' | 'active' | 'closed' | 'lost'
  referralDate: string
  notes?: string
  propertyAddress?: string
  salePrice?: number
  referralFee?: number
  paidDate?: string
}

const SAMPLE_REFERRALS: Referral[] = [
  {
    id: '1',
    referrerName: 'John Smith',
    referrerEmail: 'john@email.com',
    referrerPhone: '(239) 555-0101',
    referredName: 'Sarah Johnson',
    referredEmail: 'sarah@email.com',
    referredPhone: '(239) 555-0102',
    type: 'buyer',
    status: 'closed',
    referralDate: '2024-09-15',
    propertyAddress: '2850 Winkler Ave, Fort Myers',
    salePrice: 425000,
    referralFee: 500,
    paidDate: '2024-11-20'
  },
  {
    id: '2',
    referrerName: 'Mary Williams',
    referrerEmail: 'mary@email.com',
    referrerPhone: '(239) 555-0103',
    referredName: 'Mike Chen',
    referredEmail: 'mike@email.com',
    referredPhone: '(239) 555-0104',
    type: 'buyer',
    status: 'active',
    referralDate: '2024-11-01',
    notes: 'Looking for waterfront property'
  },
  {
    id: '3',
    referrerName: 'David Brown',
    referrerEmail: 'david@email.com',
    referrerPhone: '(239) 555-0105',
    referredName: 'The Rodriguez Family',
    referredEmail: 'rodriguez@email.com',
    referredPhone: '(239) 555-0106',
    type: 'seller',
    status: 'active',
    referralDate: '2024-11-20',
    propertyAddress: '3500 Oasis Blvd, Cape Coral'
  },
  {
    id: '4',
    referrerName: 'Lisa Anderson',
    referrerEmail: 'lisa@email.com',
    referrerPhone: '(239) 555-0107',
    referredName: 'Tom Wilson',
    referredEmail: 'tom@email.com',
    referredPhone: '(239) 555-0108',
    type: 'buyer',
    status: 'contacted',
    referralDate: '2024-12-05'
  },
  {
    id: '5',
    referrerName: 'Jennifer Adams',
    referrerEmail: 'jen@email.com',
    referrerPhone: '(239) 555-0109',
    referredName: 'Chris Taylor',
    referredEmail: 'chris@email.com',
    referredPhone: '(239) 555-0110',
    type: 'both',
    status: 'new',
    referralDate: '2024-12-12',
    notes: 'Relocating from Chicago, needs to sell current home and buy'
  }
]

export default function ReferralsPage() {
  const [referrals] = useState<Referral[]>(SAMPLE_REFERRALS)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredReferrals = referrals.filter(r => {
    const matchesSearch = 
      r.referrerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.referredName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Stats
  const totalReferrals = referrals.length
  const activeReferrals = referrals.filter(r => r.status === 'active' || r.status === 'contacted').length
  const closedReferrals = referrals.filter(r => r.status === 'closed').length
  const totalFeesPaid = referrals.filter(r => r.paidDate).reduce((sum, r) => sum + (r.referralFee || 0), 0)
  const conversionRate = totalReferrals > 0 ? Math.round((closedReferrals / totalReferrals) * 100) : 0

  const getStatusBadge = (status: Referral['status']) => {
    const styles = {
      new: 'bg-purple-100 text-purple-800',
      contacted: 'bg-blue-100 text-blue-800',
      active: 'bg-amber-100 text-amber-800',
      closed: 'bg-green-100 text-green-800',
      lost: 'bg-gray-100 text-gray-800'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getTypeBadge = (type: Referral['type']) => {
    const styles = {
      buyer: 'bg-blue-50 text-blue-700 border-blue-200',
      seller: 'bg-green-50 text-green-700 border-green-200',
      both: 'bg-purple-50 text-purple-700 border-purple-200'
    }
    return (
      <span className={`px-2 py-0.5 rounded border text-xs font-medium ${styles[type]}`}>
        {type === 'both' ? 'Buyer & Seller' : type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="text-blue-600" /> Referral Management
          </h1>
          <p className="text-gray-600 mt-1">Track referrals, thank your network, grow your business</p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={18} /> Add Referral
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Referrals</p>
              <p className="text-2xl font-bold">{totalReferrals}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="text-amber-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold">{activeReferrals}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Closed</p>
              <p className="text-2xl font-bold">{closedReferrals}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Conversion</p>
              <p className="text-2xl font-bold">{conversionRate}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Gift className="text-pink-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Fees Paid</p>
              <p className="text-2xl font-bold">${totalFeesPaid.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Referrals List */}
      <div className="space-y-4">
        {filteredReferrals.map(referral => (
          <div key={referral.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Referrer Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-500">Referred by:</span>
                  <span className="font-semibold">{referral.referrerName}</span>
                  <Star className="text-amber-500" size={14} fill="currentColor" />
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Mail size={14} /> {referral.referrerEmail}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone size={14} /> {referral.referrerPhone}
                  </span>
                </div>
              </div>

              <ArrowRight className="text-gray-300 hidden lg:block" size={24} />

              {/* Referred Client */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-blue-600">{referral.referredName}</span>
                  {getTypeBadge(referral.type)}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Mail size={14} /> {referral.referredEmail}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone size={14} /> {referral.referredPhone}
                  </span>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  {getStatusBadge(referral.status)}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(referral.referralDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="Call">
                    <Phone size={16} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="Email">
                    <Mail size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            {(referral.notes || referral.propertyAddress || referral.salePrice) && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex flex-wrap gap-4 text-sm">
                  {referral.propertyAddress && (
                    <div>
                      <span className="text-gray-500">Property: </span>
                      <span className="font-medium">{referral.propertyAddress}</span>
                    </div>
                  )}
                  {referral.salePrice && (
                    <div>
                      <span className="text-gray-500">Sale: </span>
                      <span className="font-medium text-green-600">${referral.salePrice.toLocaleString()}</span>
                    </div>
                  )}
                  {referral.referralFee && (
                    <div>
                      <span className="text-gray-500">Fee: </span>
                      <span className="font-medium text-pink-600">${referral.referralFee}</span>
                      {referral.paidDate && (
                        <span className="text-green-600 ml-1">(Paid)</span>
                      )}
                    </div>
                  )}
                </div>
                {referral.notes && (
                  <p className="text-sm text-gray-600 mt-2 italic">{referral.notes}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredReferrals.length === 0 && (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <Users className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-lg font-semibold text-gray-700">No referrals found</h3>
          <p className="text-gray-500">Try adjusting your search or add a new referral</p>
        </div>
      )}

      {/* Thank You Reminder */}
      <div className="mt-6 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl p-6 text-white">
        <div className="flex items-start gap-4">
          <Heart className="flex-shrink-0" size={32} />
          <div>
            <h3 className="font-bold text-lg mb-2">Remember to Thank Your Referrers!</h3>
            <p className="text-pink-100 mb-4">
              A simple thank you goes a long way. Consider sending a gift card, handwritten note, or small gift to show your appreciation.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">Gift Cards</span>
              <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">Handwritten Notes</span>
              <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">Closing Gifts</span>
              <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">Anniversary Cards</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
