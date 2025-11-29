'use client'

import { useState, useEffect, useRef } from 'react'
import {
  FileText,
  Upload,
  FolderOpen,
  Search,
  Download,
  Trash2,
  File,
  Grid,
  List,
  X,
  Loader2,
  Star,
  Clock,
} from 'lucide-react'

interface Document {
  id: string
  name: string
  file_type: string
  file_size: number
  category: string
  created_at: string
  starred: boolean
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [category, setCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedDocs, setSelectedDocs] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categories = [
    { id: 'all', label: 'All Documents' },
    { id: 'contracts', label: 'Contracts' },
    { id: 'disclosures', label: 'Disclosures' },
    { id: 'inspections', label: 'Inspections' },
    { id: 'appraisals', label: 'Appraisals' },
    { id: 'title', label: 'Title & Escrow' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'other', label: 'Other' },
  ]

  useEffect(() => {
    const stored = localStorage.getItem('cr_documents')
    if (stored) setDocuments(JSON.parse(stored))
    setLoading(false)
  }, [])

  const saveDocuments = (docs: Document[]) => {
    localStorage.setItem('cr_documents', JSON.stringify(docs))
    setDocuments(docs)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)

    const newDocs: Document[] = Array.from(files).map(file => ({
      id: crypto.randomUUID(),
      name: file.name,
      file_type: file.type || 'application/octet-stream',
      file_size: file.size,
      category: 'other',
      created_at: new Date().toISOString(),
      starred: false,
    }))

    saveDocuments([...documents, ...newDocs])
    setUploading(false)
    setShowUpload(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const deleteDocument = (id: string) => {
    if (!confirm('Delete this document?')) return
    saveDocuments(documents.filter(d => d.id !== id))
  }

  const deleteSelected = () => {
    if (!confirm('Delete selected documents?')) return
    saveDocuments(documents.filter(d => !selectedDocs.includes(d.id)))
    setSelectedDocs([])
  }

  const toggleStar = (id: string) => {
    saveDocuments(documents.map(d => d.id === id ? { ...d, starred: !d.starred } : d))
  }

  const updateCategory = (id: string, newCategory: string) => {
    saveDocuments(documents.map(d => d.id === id ? { ...d, category: newCategory } : d))
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return { color: 'text-red-600', bg: 'bg-red-100' }
    if (fileType.includes('image')) return { color: 'text-blue-600', bg: 'bg-blue-100' }
    return { color: 'text-gray-600', bg: 'bg-gray-100' }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const filteredDocuments = documents
    .filter(doc => category === 'all' || doc.category === category)
    .filter(doc => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const totalSize = documents.reduce((sum, d) => sum + d.file_size, 0)

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
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-500">{documents.length} documents • {formatFileSize(totalSize)} total</p>
        </div>
        <div className="flex gap-2">
          {selectedDocs.length > 0 && (
            <button onClick={deleteSelected} className="px-4 py-2 bg-red-100 text-red-600 font-medium rounded-xl hover:bg-red-200">
              Delete ({selectedDocs.length})
            </button>
          )}
          <button onClick={() => setShowUpload(true)} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}>
            <Grid className="w-5 h-5" />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}>
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              category === cat.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {filteredDocuments.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredDocuments.map(doc => {
                  const { color, bg } = getFileIcon(doc.file_type)
                  const isSelected = selectedDocs.includes(doc.id)
                  return (
                    <div key={doc.id} className={`bg-white rounded-xl border p-4 hover:shadow-md group relative ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
                      <div className="absolute top-2 left-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => setSelectedDocs(prev => isSelected ? prev.filter(id => id !== doc.id) : [...prev, doc.id])}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600"
                        />
                      </div>
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-12 h-12 rounded-lg ${bg} flex items-center justify-center`}>
                          <File className={`w-6 h-6 ${color}`} />
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => toggleStar(doc.id)} className={`p-1.5 rounded-lg ${doc.starred ? 'text-amber-500' : 'text-gray-300 hover:text-amber-500'}`}>
                            <Star className="w-4 h-4" fill={doc.starred ? 'currentColor' : 'none'} />
                          </button>
                          <button onClick={() => deleteDocument(doc.id)} className="p-1.5 hover:bg-red-100 rounded-lg opacity-0 group-hover:opacity-100">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                      <h3 className="font-medium text-gray-900 text-sm truncate mb-1">{doc.name}</h3>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatFileSize(doc.file_size)}</span>
                        <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                      </div>
                      <select
                        value={doc.category}
                        onChange={(e) => updateCategory(doc.id, e.target.value)}
                        className="mt-2 w-full text-xs px-2 py-1 bg-gray-100 border-0 rounded-lg"
                      >
                        {categories.filter(c => c.id !== 'all').map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl border divide-y">
                {filteredDocuments.map(doc => {
                  const { color, bg } = getFileIcon(doc.file_type)
                  const isSelected = selectedDocs.includes(doc.id)
                  return (
                    <div key={doc.id} className={`flex items-center gap-4 p-4 hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => setSelectedDocs(prev => isSelected ? prev.filter(id => id !== doc.id) : [...prev, doc.id])}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600"
                      />
                      <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
                        <File className={`w-5 h-5 ${color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{doc.name}</h3>
                        <p className="text-sm text-gray-500">{formatFileSize(doc.file_size)} • {doc.category}</p>
                      </div>
                      <span className="text-sm text-gray-500 hidden sm:block">{new Date(doc.created_at).toLocaleDateString()}</span>
                      <button onClick={() => toggleStar(doc.id)} className={`p-2 rounded-lg ${doc.starred ? 'text-amber-500' : 'text-gray-300'}`}>
                        <Star className="w-4 h-4" fill={doc.starred ? 'currentColor' : 'none'} />
                      </button>
                      <button onClick={() => deleteDocument(doc.id)} className="p-2 hover:bg-red-100 rounded-lg">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )
          ) : (
            <div className="bg-white rounded-xl border p-12 text-center">
              <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="font-medium text-gray-900 mb-2">No Documents</h3>
              <p className="text-gray-500 mb-4">{searchQuery ? 'No documents match your search' : 'Upload your first document'}</p>
              <button onClick={() => setShowUpload(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto">
                <Upload className="w-4 h-4" />
                Upload Document
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
            <h3 className="font-semibold mb-2">Storage Used</h3>
            <div className="h-2 bg-white/20 rounded-full mb-2">
              <div className="h-full bg-white rounded-full" style={{ width: Math.min((totalSize / (5 * 1024 * 1024 * 1024)) * 100, 100) + '%' }} />
            </div>
            <p className="text-sm text-blue-100">{formatFileSize(totalSize)} of 5 GB</p>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Templates</h3>
            <div className="space-y-2">
              {['Purchase Agreement', 'Listing Agreement', 'Seller Disclosure', 'Inspection Report'].map(name => (
                <button key={name} className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-left">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Upload Documents</h2>
              <button onClick={() => setShowUpload(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-400">
              <input ref={fileInputRef} type="file" multiple onChange={handleFileUpload} className="hidden" id="file-upload" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx" />
              <label htmlFor="file-upload" className="cursor-pointer">
                {uploading ? <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-spin" /> : <Upload className="w-12 h-12 mx-auto mb-4 text-gray-300" />}
                <p className="text-gray-600 mb-2">{uploading ? 'Uploading...' : 'Click to upload'}</p>
                <p className="text-sm text-gray-500">PDF, DOC, XLS, JPG, PNG up to 10MB</p>
              </label>
            </div>
            <button onClick={() => setShowUpload(false)} className="w-full mt-6 px-4 py-2 border text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
