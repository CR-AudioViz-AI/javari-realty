'use client'

import { useState, useEffect } from 'react'
import {
  Briefcase,
  Plus,
  Search,
  DollarSign,
  User,
  Home,
  CheckCircle,
  FileText,
  X,
  Check,
  Loader2,
  Building2,
  MapPin,
  TrendingUp,
  Edit,
  Trash2,
} from 'lucide-react'

interface Transaction {
  id: string
  property_address: string
  property_city: string
  property_price: number
  client_name: string
  client_type: 'buyer' | 'seller'
  status: string
  stage: string
  closing_date?: string
  commission_rate: number
  created_at: string
  notes?: string
  checklist: { item: string; completed: boolean }[]
}

const stages = [
  { id: 'contract', label: 'Under Contract', color: 'bg-blue-500' },
  { id: 'inspection', label: 'Inspection', color: 'bg-purple-500' },
  { id: 'appraisal', label: 'Appraisal', color: 'bg-indigo-500' },
  { id: 'title', label: 'Title & Escrow', color: 'bg-amber-500' },
  { id: 'final_walkthrough', label: 'Final Walkthrough', color: 'bg-orange-500' },
  { id: 'closing', label: 'Closing', color: 'bg-emerald-500' },
]

const defaultChecklist = [
  { item: 'Contract signed', completed: false },
  { item: 'Earnest money deposited', completed: false },
  { item: 'Inspection scheduled', completed: false },
  { item: 'Inspection completed', completed: false },
  { item: 'Appraisal ordered', completed: false },
  { item: 'Appraisal completed', completed: false },
  { item: 'Title search completed', completed: false },
  { item: 'Loan approved', completed: false },
  { item: 'Final walkthrough', completed: false },
  { item: 'Closing documents signed', completed: false },
  { item: 'Keys transferred', completed: false },
]

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingTx, setEditingTx] = useState<Transaction | null>(null)
  const [saving, setSaving] = useState(false)
  const [selectedTx, setSelectedTx] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    property_address: '',
    property_city: '',
    property_price: '',
    client_name: '',
    client_type: 'buyer' as 'buyer' | 'seller',
    closing_date: '',
    commission_rate: '3',
    notes: '',
  })

  useEffect(() => {
    const stored = localStorage.getItem('cr_transactions')
    if (stored) setTransactions(JSON.parse(stored))
    setLoading(false)
  }, [])

  const saveTransactions = (txs: Transaction[]) => {
    localStorage.setItem('cr_transactions', JSON.stringify(txs))
    setTransactions(txs)
  }

  const createTransaction = () => {
    setSaving(true)
    const newTx: Transaction = {
      id: editingTx?.id || crypto.randomUUID(),
      property_address: formData.property_address,
      property_city: formData.property_city,
      property_price: parseFloat(formData.property_price) || 0,
      client_name: formData.client_name,
      client_type: formData.client_type,
      status: 'active',
      stage: editingTx?.stage || 'contract',
      closing_date: formData.closing_date || undefined,
      commission_rate: parseFloat(formData.commission_rate) || 3,
      created_at: editingTx?.created_at || new Date().toISOString(),
      notes: formData.notes,
      checklist: editingTx?.checklist || defaultChecklist,
    }

    if (editingTx) {
      saveTransactions(transactions.map(t => t.id === editingTx.id ? newTx : t))
    } else {
      saveTransactions([...transactions, newTx])
    }

    setSaving(false)
    setShowModal(false)
    setEditingTx(null)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      property_address: '',
      property_city: '',
      property_price: '',
      client_name: '',
      client_type: 'buyer',
      closing_date: '',
      commission_rate: '3',
      notes: '',
    })
  }

  const openEdit = (tx: Transaction) => {
    setFormData({
      property_address: tx.property_address,
      property_city: tx.property_city,
      property_price: tx.property_price.toString(),
      client_name: tx.client_name,
      client_type: tx.client_type,
      closing_date: tx.closing_date || '',
      commission_rate: tx.commission_rate.toString(),
      notes: tx.notes || '',
    })
    setEditingTx(tx)
    setShowModal(true)
  }

  const deleteTx = (id: string) => {
    if (!confirm('Delete this transaction?')) return
    saveTransactions(transactions.filter(t => t.id !== id))
  }

  const updateStage = (id: string, newStage: string) => {
    saveTransactions(transactions.map(t => t.id === id ? { ...t, stage: newStage } : t))
  }

  const toggleChecklistItem = (txId: string, itemIndex: number) => {
    saveTransactions(transactions.map(t => {
      if (t.id !== txId) return t
      const newChecklist = [...t.checklist]
      newChecklist[itemIndex] = { ...newChecklist[itemIndex], completed: !newChecklist[itemIndex].completed }
      return { ...t, checklist: newChecklist }
    }))
  }

  const markClosed = (id: string) => {
    saveTransactions(transactions.map(t => t.id === id ? { ...t, status: 'closed', stage: 'closing' } : t))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price)
  }

  const filteredTransactions = transactions
    .filter(tx => filter === 'all' || tx.status === filter || tx.stage === filter)
    .filter(tx => tx.property_address.toLowerCase().includes(searchQuery.toLowerCase()) || tx.client_name.toLowerCase().includes(searchQuery.toLowerCase()))

  const activeTransactions = transactions.filter(t => t.status === 'active')
  const closedTransactions = transactions.filter(t => t.status === 'closed')
  const totalVolume = activeTransactions.reduce((sum, t) => sum + t.property_price, 0)
  const totalCommission = activeTransactions.reduce((sum, t) => sum + (t.property_price * t.commission_rate / 100), 0)
  const closedVolume = closedTransactions.reduce((sum, t) => sum + t.property_price, 0)

  const selectedTransaction = transactions.find(t => t.id === selectedTx)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-500">{activeTransactions.length} active deals in pipeline</p>
        </div>
        <button onClick={() => { resetForm(); setEditingTx(null); setShowModal(true) }} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Transaction
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{activeTransactions.length}</p>
          <p className="text-xs text-gray-500">Active Transactions</p>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatPrice(totalVolume)}</p>
          <p className="text-xs text-gray-500">Pipeline Volume</p>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatPrice(totalCommission)}</p>
          <p className="text-xs text-gray-500">Expected Commission</p>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatPrice(closedVolume)}</p>
          <p className="text-xs text-gray-500">Closed Volume</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search transactions..." className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-blue-500">
          <option value="all">All Transactions</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
          {stages.map(s => (<option key={s.id} value={s.id}>{s.label}</option>))}
        </select>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-900">Pipeline Stages</h2>
        </div>
        <div className="grid grid-cols-6 divide-x overflow-x-auto">
          {stages.map(stage => {
            const stageTxs = activeTransactions.filter(t => t.stage === stage.id)
            return (
              <div key={stage.id} className="min-w-[150px]">
                <div className={`p-3 ${stage.color} text-white`}>
                  <span className="text-sm font-medium">{stage.label}</span>
                  <p className="text-xl font-bold mt-1">{stageTxs.length}</p>
                </div>
                <div className="p-2 space-y-2 min-h-[150px] max-h-[300px] overflow-y-auto">
                  {stageTxs.map(tx => (
                    <div key={tx.id} onClick={() => setSelectedTx(tx.id)} className={`p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 ${selectedTx === tx.id ? 'ring-2 ring-blue-500' : ''}`}>
                      <p className="font-medium text-gray-900 text-xs truncate">{tx.property_address}</p>
                      <p className="text-xs text-emerald-600 font-semibold">{formatPrice(tx.property_price)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-gray-900">All Transactions</h2>
            </div>
            <div className="divide-y">
              {filteredTransactions.length > 0 ? filteredTransactions.map(tx => {
                const stage = stages.find(s => s.id === tx.stage)
                const completedItems = tx.checklist.filter(c => c.completed).length
                const progress = (completedItems / tx.checklist.length) * 100
                return (
                  <div key={tx.id} onClick={() => setSelectedTx(tx.id)} className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedTx === tx.id ? 'bg-blue-50' : ''}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg ${stage?.color || 'bg-gray-500'} flex items-center justify-center`}>
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900 truncate">{tx.property_address}</h3>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${tx.status === 'closed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                            {tx.status === 'closed' ? 'Closed' : stage?.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><User className="w-3 h-3" />{tx.client_name}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{tx.property_city}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="font-semibold text-emerald-600">{formatPrice(tx.property_price)}</span>
                          <div className="flex-1 max-w-[200px] flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: progress + '%' }} />
                            </div>
                            <span className="text-xs text-gray-500">{completedItems}/{tx.checklist.length}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={(e) => { e.stopPropagation(); openEdit(tx) }} className="p-2 hover:bg-gray-100 rounded-lg">
                          <Edit className="w-4 h-4 text-gray-400" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); deleteTx(tx.id) }} className="p-2 hover:bg-red-100 rounded-lg">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              }) : (
                <div className="p-8 text-center text-gray-500">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="font-medium text-gray-900 mb-2">No Transactions</h3>
                  <p>Create your first transaction to track deals</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          {selectedTransaction ? (
            <div className="bg-white rounded-xl border p-6 sticky top-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedTransaction.property_address}</h3>
                  <p className="text-sm text-gray-500">{selectedTransaction.property_city}</p>
                </div>
                <button onClick={() => setSelectedTx(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Price</span><span className="font-semibold text-emerald-600">{formatPrice(selectedTransaction.property_price)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Client</span><span className="font-medium">{selectedTransaction.client_name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Commission</span><span className="font-medium">{formatPrice(selectedTransaction.property_price * selectedTransaction.commission_rate / 100)}</span></div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                <select value={selectedTransaction.stage} onChange={(e) => updateStage(selectedTransaction.id, e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                  {stages.map(s => (<option key={s.id} value={s.id}>{s.label}</option>))}
                </select>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Checklist</h4>
                <div className="space-y-2 max-h-[250px] overflow-y-auto">
                  {selectedTransaction.checklist.map((item, index) => (
                    <label key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <input type="checkbox" checked={item.completed} onChange={() => toggleChecklistItem(selectedTransaction.id, index)} className="w-4 h-4 rounded border-gray-300 text-emerald-600" />
                      <span className={`text-sm ${item.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{item.item}</span>
                    </label>
                  ))}
                </div>
              </div>
              {selectedTransaction.status !== 'closed' && (
                <button onClick={() => markClosed(selectedTransaction.id)} className="w-full mt-6 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />Mark as Closed
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border p-6 text-center text-gray-500">
              <Briefcase className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Select a transaction to view details</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">{editingTx ? 'Edit Transaction' : 'New Transaction'}</h2>
              <button onClick={() => { setShowModal(false); setEditingTx(null) }} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Address *</label>
                <input type="text" value={formData.property_address} onChange={(e) => setFormData(prev => ({ ...prev, property_address: e.target.value }))} placeholder="123 Main St" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" value={formData.property_city} onChange={(e) => setFormData(prev => ({ ...prev, property_city: e.target.value }))} placeholder="Naples" className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input type="number" value={formData.property_price} onChange={(e) => setFormData(prev => ({ ...prev, property_price: e.target.value }))} placeholder="500000" className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
                  <input type="text" value={formData.client_name} onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))} placeholder="John Smith" className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Type</label>
                  <select value={formData.client_type} onChange={(e) => setFormData(prev => ({ ...prev, client_type: e.target.value as 'buyer' | 'seller' }))} className="w-full px-4 py-2 border rounded-lg">
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Closing Date</label>
                  <input type="date" value={formData.closing_date} onChange={(e) => setFormData(prev => ({ ...prev, closing_date: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Commission %</label>
                  <input type="number" step="0.1" value={formData.commission_rate} onChange={(e) => setFormData(prev => ({ ...prev, commission_rate: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={formData.notes} onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))} rows={2} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3">
              <button onClick={() => { setShowModal(false); setEditingTx(null) }} className="flex-1 px-4 py-2 border text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={createTransaction} disabled={!formData.property_address || !formData.client_name || !formData.property_price || saving} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {editingTx ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
