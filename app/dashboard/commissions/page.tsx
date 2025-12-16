'use client'

import { useState } from 'react'
import {
  DollarSign, TrendingUp, Calendar, PieChart, Filter,
  Download, Plus, Edit2, Trash2, CheckCircle, Clock,
  AlertCircle, ArrowUpRight, ArrowDownRight, Home
} from 'lucide-react'

interface Commission {
  id: string
  propertyAddress: string
  clientName: string
  type: 'buyer' | 'seller' | 'dual'
  salePrice: number
  commissionRate: number
  grossCommission: number
  brokerSplit: number
  netCommission: number
  status: 'pending' | 'closed' | 'paid'
  closeDate: string
  paidDate?: string
}

const SAMPLE_COMMISSIONS: Commission[] = [
  {
    id: '1',
    propertyAddress: '2850 Winkler Ave, Fort Myers',
    clientName: 'Sarah Johnson',
    type: 'seller',
    salePrice: 425000,
    commissionRate: 3,
    grossCommission: 12750,
    brokerSplit: 70,
    netCommission: 8925,
    status: 'paid',
    closeDate: '2024-11-15',
    paidDate: '2024-11-20'
  },
  {
    id: '2',
    propertyAddress: '1420 SE 47th St, Cape Coral',
    clientName: 'Mike Chen',
    type: 'buyer',
    salePrice: 389000,
    commissionRate: 2.5,
    grossCommission: 9725,
    brokerSplit: 70,
    netCommission: 6807.50,
    status: 'closed',
    closeDate: '2024-12-01'
  },
  {
    id: '3',
    propertyAddress: '3500 Oasis Blvd, Cape Coral',
    clientName: 'The Rodriguez Family',
    type: 'dual',
    salePrice: 459000,
    commissionRate: 5,
    grossCommission: 22950,
    brokerSplit: 70,
    netCommission: 16065,
    status: 'pending',
    closeDate: '2024-12-20'
  },
  {
    id: '4',
    propertyAddress: '8901 Cypress Lake Dr, Fort Myers',
    clientName: 'David Williams',
    type: 'seller',
    salePrice: 675000,
    commissionRate: 3,
    grossCommission: 20250,
    brokerSplit: 70,
    netCommission: 14175,
    status: 'pending',
    closeDate: '2024-12-28'
  },
  {
    id: '5',
    propertyAddress: '15620 Laguna Hills Dr, Fort Myers',
    clientName: 'Jennifer Adams',
    type: 'buyer',
    salePrice: 525000,
    commissionRate: 2.5,
    grossCommission: 13125,
    brokerSplit: 70,
    netCommission: 9187.50,
    status: 'paid',
    closeDate: '2024-10-20',
    paidDate: '2024-10-25'
  }
]

export default function CommissionsPage() {
  const [commissions] = useState<Commission[]>(SAMPLE_COMMISSIONS)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterYear, setFilterYear] = useState<string>('2024')
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredCommissions = commissions.filter(c => {
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus
    const matchesYear = c.closeDate.startsWith(filterYear)
    return matchesStatus && matchesYear
  })

  // Calculate totals
  const totalGross = filteredCommissions.reduce((sum, c) => sum + c.grossCommission, 0)
  const totalNet = filteredCommissions.reduce((sum, c) => sum + c.netCommission, 0)
  const pendingNet = filteredCommissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.netCommission, 0)
  const paidNet = filteredCommissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.netCommission, 0)
  const closedNet = filteredCommissions.filter(c => c.status === 'closed').reduce((sum, c) => sum + c.netCommission, 0)
  const avgCommission = filteredCommissions.length > 0 ? totalNet / filteredCommissions.length : 0
  const totalVolume = filteredCommissions.reduce((sum, c) => sum + c.salePrice, 0)

  const getStatusBadge = (status: Commission['status']) => {
    const styles = {
      pending: 'bg-amber-100 text-amber-800',
      closed: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800'
    }
    const icons = {
      pending: <Clock size={14} />,
      closed: <CheckCircle size={14} />,
      paid: <DollarSign size={14} />
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${styles[status]}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getTypeBadge = (type: Commission['type']) => {
    const styles = {
      buyer: 'bg-blue-100 text-blue-700',
      seller: 'bg-green-100 text-green-700',
      dual: 'bg-purple-100 text-purple-700'
    }
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[type]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <DollarSign className="text-green-600" /> Commission Tracker
          </h1>
          <p className="text-gray-600 mt-1">Track earnings, pending payments, and income goals</p>
        </div>
        
        <div className="flex gap-3">
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2">
            <Download size={18} /> Export
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Plus size={18} /> Add Commission
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Net</p>
              <p className="text-xl font-bold">${totalNet.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Paid</p>
              <p className="text-xl font-bold text-green-600">${paidNet.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="text-amber-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-xl font-bold text-amber-600">${(pendingNet + closedNet).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Commission</p>
              <p className="text-xl font-bold">${avgCommission.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Home className="text-indigo-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Sales Volume</p>
              <p className="text-xl font-bold">${(totalVolume / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <span className="text-sm text-gray-600">Filters:</span>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 border rounded-lg text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
            <option value="paid">Paid</option>
          </select>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-3 py-1.5 border rounded-lg text-sm"
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
      </div>

      {/* Commission Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 font-medium">Property</th>
                <th className="text-left py-3 px-4 font-medium">Client</th>
                <th className="text-left py-3 px-4 font-medium">Type</th>
                <th className="text-right py-3 px-4 font-medium">Sale Price</th>
                <th className="text-right py-3 px-4 font-medium">Rate</th>
                <th className="text-right py-3 px-4 font-medium">Gross</th>
                <th className="text-right py-3 px-4 font-medium">Net (70%)</th>
                <th className="text-center py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Close Date</th>
                <th className="text-center py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCommissions.map(commission => (
                <tr key={commission.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-sm">{commission.propertyAddress.split(',')[0]}</p>
                    <p className="text-xs text-gray-500">{commission.propertyAddress.split(',')[1]}</p>
                  </td>
                  <td className="py-3 px-4 text-sm">{commission.clientName}</td>
                  <td className="py-3 px-4">{getTypeBadge(commission.type)}</td>
                  <td className="py-3 px-4 text-right font-medium">${commission.salePrice.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-sm">{commission.commissionRate}%</td>
                  <td className="py-3 px-4 text-right text-sm">${commission.grossCommission.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-semibold text-green-600">
                    ${commission.netCommission.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">{getStatusBadge(commission.status)}</td>
                  <td className="py-3 px-4 text-sm">
                    {new Date(commission.closeDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-1">
                      <button className="p-1.5 hover:bg-gray-100 rounded"><Edit2 size={14} /></button>
                      <button className="p-1.5 hover:bg-gray-100 rounded text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t-2">
              <tr>
                <td colSpan={5} className="py-3 px-4 font-bold">Totals ({filteredCommissions.length} transactions)</td>
                <td className="py-3 px-4 text-right font-bold">${totalGross.toLocaleString()}</td>
                <td className="py-3 px-4 text-right font-bold text-green-600">${totalNet.toLocaleString()}</td>
                <td colSpan={3}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Income Goals */}
      <div className="mt-6 bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl p-6 text-white">
        <h2 className="font-bold text-xl mb-4">2024 Income Goal Progress</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-green-200 text-sm">Annual Goal</p>
            <p className="text-3xl font-bold">$150,000</p>
          </div>
          <div>
            <p className="text-green-200 text-sm">YTD Earned</p>
            <p className="text-3xl font-bold">${totalNet.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-green-200 text-sm">Progress</p>
            <p className="text-3xl font-bold">{Math.round((totalNet / 150000) * 100)}%</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-4 bg-green-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full"
              style={{ width: `${Math.min((totalNet / 150000) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
