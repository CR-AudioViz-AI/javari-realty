'use client'

import { useState } from 'react'
import {
  FileText, FolderOpen, Download, Upload, Check, Clock,
  AlertCircle, Search, Filter, Plus, ChevronRight, File,
  CheckSquare, Square, Users, Home, Calendar, Trash2,
  Eye, Edit2, Share2, Lock, Unlock, Star
} from 'lucide-react'

interface Document {
  id: string
  name: string
  type: string
  category: string
  status: 'pending' | 'completed' | 'expired' | 'not-started'
  dueDate?: string
  completedDate?: string
  url?: string
  required: boolean
  notes?: string
}

interface Transaction {
  id: string
  propertyAddress: string
  clientName: string
  type: 'buyer' | 'seller'
  status: 'active' | 'pending' | 'closed'
  closeDate?: string
  documents: Document[]
}

const DOCUMENT_TEMPLATES = {
  buyer: [
    { name: 'Buyer Representation Agreement', category: 'Agreements', required: true },
    { name: 'Pre-Approval Letter', category: 'Financing', required: true },
    { name: 'Proof of Funds', category: 'Financing', required: false },
    { name: 'Purchase Agreement', category: 'Contracts', required: true },
    { name: 'Earnest Money Receipt', category: 'Contracts', required: true },
    { name: 'Home Inspection Report', category: 'Inspections', required: false },
    { name: 'Pest Inspection Report', category: 'Inspections', required: false },
    { name: 'Appraisal Report', category: 'Financing', required: true },
    { name: 'Title Commitment', category: 'Title', required: true },
    { name: 'Survey', category: 'Title', required: false },
    { name: 'Homeowners Insurance', category: 'Insurance', required: true },
    { name: 'Closing Disclosure', category: 'Closing', required: true },
    { name: 'Final Walkthrough Checklist', category: 'Closing', required: true },
  ],
  seller: [
    { name: 'Listing Agreement', category: 'Agreements', required: true },
    { name: 'Seller Disclosure', category: 'Disclosures', required: true },
    { name: 'Lead-Based Paint Disclosure', category: 'Disclosures', required: true },
    { name: 'HOA Documents', category: 'Disclosures', required: false },
    { name: 'Property Survey', category: 'Title', required: false },
    { name: 'Purchase Agreement (Signed)', category: 'Contracts', required: true },
    { name: 'Inspection Response', category: 'Inspections', required: false },
    { name: 'Repair Receipts', category: 'Inspections', required: false },
    { name: 'Title Commitment', category: 'Title', required: true },
    { name: 'Payoff Statement', category: 'Closing', required: true },
    { name: 'Closing Disclosure', category: 'Closing', required: true },
    { name: 'Deed', category: 'Closing', required: true },
  ]
}

const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    propertyAddress: '2850 Winkler Ave, Fort Myers, FL',
    clientName: 'Sarah Johnson',
    type: 'buyer',
    status: 'active',
    closeDate: '2024-12-30',
    documents: DOCUMENT_TEMPLATES.buyer.map((doc, idx) => ({
      id: `doc-${idx}`,
      ...doc,
      type: 'pdf',
      status: idx < 5 ? 'completed' : idx < 8 ? 'pending' : 'not-started',
      dueDate: '2024-12-20',
      completedDate: idx < 5 ? '2024-12-10' : undefined
    }))
  },
  {
    id: '2',
    propertyAddress: '1420 SE 47th St, Cape Coral, FL',
    clientName: 'Mike Chen',
    type: 'seller',
    status: 'active',
    closeDate: '2025-01-15',
    documents: DOCUMENT_TEMPLATES.seller.map((doc, idx) => ({
      id: `doc-${idx}`,
      ...doc,
      type: 'pdf',
      status: idx < 3 ? 'completed' : idx < 6 ? 'pending' : 'not-started',
      dueDate: '2025-01-05'
    }))
  }
]

export default function DocumentCenterPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(SAMPLE_TRANSACTIONS)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(SAMPLE_TRANSACTIONS[0])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const getStatusBadge = (status: Document['status']) => {
    const styles = {
      'completed': 'bg-green-100 text-green-800',
      'pending': 'bg-amber-100 text-amber-800',
      'expired': 'bg-red-100 text-red-800',
      'not-started': 'bg-gray-100 text-gray-800'
    }
    const labels = {
      'completed': 'Completed',
      'pending': 'Pending',
      'expired': 'Expired',
      'not-started': 'Not Started'
    }
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const toggleDocumentStatus = (docId: string) => {
    if (!selectedTransaction) return
    
    setTransactions(prev => prev.map(t => {
      if (t.id === selectedTransaction.id) {
        return {
          ...t,
          documents: t.documents.map(d => {
            if (d.id === docId) {
              const newStatus = d.status === 'completed' ? 'not-started' : 'completed'
              return {
                ...d,
                status: newStatus,
                completedDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : undefined
              }
            }
            return d
          })
        }
      }
      return t
    }))

    // Update selected transaction
    setSelectedTransaction(prev => {
      if (!prev) return null
      return {
        ...prev,
        documents: prev.documents.map(d => {
          if (d.id === docId) {
            const newStatus = d.status === 'completed' ? 'not-started' : 'completed'
            return {
              ...d,
              status: newStatus,
              completedDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : undefined
            }
          }
          return d
        })
      }
    })
  }

  const filteredDocuments = selectedTransaction?.documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  }) || []

  const categories = [...new Set(selectedTransaction?.documents.map(d => d.category) || [])]

  const completedCount = selectedTransaction?.documents.filter(d => d.status === 'completed').length || 0
  const totalCount = selectedTransaction?.documents.length || 0
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FolderOpen className="text-blue-600" /> Document Center
          </h1>
          <p className="text-gray-600 mt-1">Manage transaction documents and checklists</p>
        </div>
        
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus size={18} /> New Transaction
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Transaction List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-semibold mb-3">Active Transactions</h3>
            <div className="space-y-2">
              {transactions.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTransaction(t)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedTransaction?.id === t.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      t.type === 'buyer' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                    </span>
                  </div>
                  <p className="font-medium text-sm truncate">{t.propertyAddress.split(',')[0]}</p>
                  <p className="text-xs text-gray-500">{t.clientName}</p>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{t.documents.filter(d => d.status === 'completed').length}/{t.documents.length}</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${(t.documents.filter(d => d.status === 'completed').length / t.documents.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Document List */}
        <div className="lg:col-span-3">
          {selectedTransaction ? (
            <div className="bg-white rounded-xl border overflow-hidden">
              {/* Transaction Header */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="font-bold text-lg">{selectedTransaction.propertyAddress}</h2>
                    <p className="text-sm text-gray-600">
                      {selectedTransaction.clientName} • {selectedTransaction.type.charAt(0).toUpperCase() + selectedTransaction.type.slice(1)} Transaction
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Closing Date</p>
                    <p className="font-semibold">
                      {selectedTransaction.closeDate 
                        ? new Date(selectedTransaction.closeDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : 'TBD'}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Completion Progress</span>
                    <span className="text-gray-600">{completedCount} of {totalCount} documents ({progressPercent}%)</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        progressPercent === 100 ? 'bg-green-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search documents..."
                      className="w-full pl-9 pr-4 py-1.5 border rounded-lg text-sm"
                    />
                  </div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-1.5 border rounded-lg text-sm"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-1.5 border rounded-lg text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="not-started">Not Started</option>
                  </select>
                </div>
              </div>

              {/* Document List */}
              <div className="divide-y max-h-[500px] overflow-y-auto">
                {categories.map(category => {
                  const categoryDocs = filteredDocuments.filter(d => d.category === category)
                  if (categoryDocs.length === 0) return null
                  
                  return (
                    <div key={category}>
                      <div className="bg-gray-100 px-4 py-2 font-medium text-sm text-gray-700">
                        {category}
                      </div>
                      {categoryDocs.map(doc => (
                        <div
                          key={doc.id}
                          className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50"
                        >
                          <button
                            onClick={() => toggleDocumentStatus(doc.id)}
                            className="flex-shrink-0"
                          >
                            {doc.status === 'completed' ? (
                              <CheckSquare className="text-green-600" size={22} />
                            ) : (
                              <Square className="text-gray-400" size={22} />
                            )}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className={`font-medium text-sm ${doc.status === 'completed' ? 'text-gray-500 line-through' : ''}`}>
                                {doc.name}
                              </p>
                              {doc.required && (
                                <span className="text-xs text-red-500">*Required</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              {doc.status === 'completed' && doc.completedDate
                                ? `Completed ${new Date(doc.completedDate).toLocaleDateString()}`
                                : doc.dueDate
                                  ? `Due ${new Date(doc.dueDate).toLocaleDateString()}`
                                  : ''}
                            </p>
                          </div>

                          {getStatusBadge(doc.status)}

                          <div className="flex gap-1">
                            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500">
                              <Upload size={16} />
                            </button>
                            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500">
                              <Eye size={16} />
                            </button>
                            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500">
                              <Download size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>

              {filteredDocuments.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <FileText className="mx-auto mb-2" size={32} />
                  <p>No documents match your filters</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-12 text-center h-full flex flex-col items-center justify-center">
              <FolderOpen className="mx-auto mb-4 text-gray-400" size={64} />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Transaction</h3>
              <p className="text-gray-500">Choose a transaction to manage documents</p>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 bg-gray-50 rounded-xl p-4 flex flex-wrap gap-6 text-sm">
        <div className="flex items-center gap-2">
          <CheckSquare className="text-green-600" size={18} />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <Square className="text-gray-400" size={18} />
          <span>Not Started</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-red-500">*</span>
          <span>Required Document</span>
        </div>
      </div>
    </div>
  )
}
