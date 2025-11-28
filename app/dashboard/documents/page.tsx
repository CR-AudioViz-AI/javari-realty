'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  FileText,
  Upload,
  FolderOpen,
  Search,
  Plus,
  Download,
  Trash2,
  Eye,
  MoreVertical,
  File,
  FileImage,
  FilePdf,
  Grid,
  List,
  Filter,
  Clock,
  User,
  Home,
  X,
  Check,
  Loader2,
} from 'lucide-react'

interface Document {
  id: string
  name: string
  file_type: string
  file_size: number
  category: string
  property_id?: string
  property_title?: string
  transaction_id?: string
  uploaded_at: string
  url: string
}

export default function DocumentsPage() {
  const supabase = createClient()
  const [documents, setDocuments] = useState<Document[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [category, setCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  const [uploadData, setUploadData] = useState({
    category: 'contracts',
    property_id: '',
    transaction_id: '',
  })

  useEffect(() => {
    loadDocuments()
  }, [category])

  async function loadDocuments() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let query = supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .order('uploaded_at', { ascending: false })

    if (category !== 'all') {
      query = query.eq('category', category)
    }

    const { data } = await query
    setDocuments(data || [])
    setLoading(false)
  }

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

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return FilePdf
    if (fileType.includes('image')) return FileImage
    return File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    for (const file of Array.from(files)) {
      const fileName = `${user.id}/${Date.now()}-${file.name}`
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        continue
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName)

      // Create document record
      await supabase.from('documents').insert({
        user_id: user.id,
        name: file.name,
        file_type: file.type,
        file_size: file.size,
        category: uploadData.category || 'other',
        property_id: uploadData.property_id || null,
        transaction_id: uploadData.transaction_id || null,
        url: publicUrl,
        storage_path: fileName,
      })
    }

    setShowUpload(false)
    setUploading(false)
    loadDocuments()
  }

  const deleteDocument = async (doc: Document) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([`${doc.id}`])

    // Delete record
    await supabase.from('documents').delete().eq('id', doc.id)
    loadDocuments()
  }

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Mock templates for quick access
  const templates = [
    { name: 'Purchase Agreement', category: 'contracts' },
    { name: 'Listing Agreement', category: 'contracts' },
    { name: 'Seller Disclosure', category: 'disclosures' },
    { name: 'Lead Paint Disclosure', category: 'disclosures' },
    { name: 'Inspection Contingency', category: 'inspections' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-500">{documents.length} documents stored</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              category === cat.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Documents Grid/List */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filteredDocuments.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredDocuments.map(doc => {
                  const FileIcon = getFileIcon(doc.file_type)
                  return (
                    <div key={doc.id} className="bg-white rounded-xl border p-4 hover:shadow-md transition group">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          doc.file_type.includes('pdf') ? 'bg-red-100' :
                          doc.file_type.includes('image') ? 'bg-blue-100' :
                          'bg-gray-100'
                        }`}>
                          <FileIcon className={`w-6 h-6 ${
                            doc.file_type.includes('pdf') ? 'text-red-600' :
                            doc.file_type.includes('image') ? 'text-blue-600' :
                            'text-gray-600'
                          }`} />
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition flex gap-1">
                          <a
                            href={doc.url}
                            target="_blank"
                            className="p-1.5 hover:bg-gray-100 rounded-lg"
                            title="View"
                          >
                            <Eye className="w-4 h-4 text-gray-500" />
                          </a>
                          <a
                            href={doc.url}
                            download
                            className="p-1.5 hover:bg-gray-100 rounded-lg"
                            title="Download"
                          >
                            <Download className="w-4 h-4 text-gray-500" />
                          </a>
                          <button
                            onClick={() => deleteDocument(doc)}
                            className="p-1.5 hover:bg-red-100 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                      <h3 className="font-medium text-gray-900 text-sm truncate mb-1">{doc.name}</h3>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatFileSize(doc.file_size)}</span>
                        <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                      </div>
                      <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                        {doc.category}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl border divide-y">
                {filteredDocuments.map(doc => {
                  const FileIcon = getFileIcon(doc.file_type)
                  return (
                    <div key={doc.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        doc.file_type.includes('pdf') ? 'bg-red-100' :
                        doc.file_type.includes('image') ? 'bg-blue-100' :
                        'bg-gray-100'
                      }`}>
                        <FileIcon className={`w-5 h-5 ${
                          doc.file_type.includes('pdf') ? 'text-red-600' :
                          doc.file_type.includes('image') ? 'text-blue-600' :
                          'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{doc.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>{formatFileSize(doc.file_size)}</span>
                          <span className="capitalize">{doc.category}</span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(doc.uploaded_at).toLocaleDateString()}
                      </span>
                      <div className="flex gap-1">
                        <a
                          href={doc.url}
                          target="_blank"
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <Eye className="w-4 h-4 text-gray-500" />
                        </a>
                        <a
                          href={doc.url}
                          download
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <Download className="w-4 h-4 text-gray-500" />
                        </a>
                        <button
                          onClick={() => deleteDocument(doc)}
                          className="p-2 hover:bg-red-100 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          ) : (
            <div className="bg-white rounded-xl border p-12 text-center">
              <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="font-medium text-gray-900 mb-2">No Documents</h3>
              <p className="text-gray-500 mb-4">
                {category !== 'all' ? `No ${category} documents yet` : 'Upload your first document'}
              </p>
              <button
                onClick={() => setShowUpload(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </button>
            </div>
          )}
        </div>

        {/* Sidebar - Templates */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Templates</h3>
            <div className="space-y-2">
              {templates.map(template => (
                <button
                  key={template.name}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-left"
                >
                  <FileText className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-700">{template.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
            <h3 className="font-semibold mb-2">Storage Used</h3>
            <div className="h-2 bg-white/20 rounded-full mb-2">
              <div className="h-full w-1/4 bg-white rounded-full" />
            </div>
            <p className="text-sm text-blue-100">
              {(documents.reduce((sum, d) => sum + d.file_size, 0) / (1024 * 1024)).toFixed(1)} MB of 5 GB used
            </p>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Upload Document</h2>
              <button onClick={() => setShowUpload(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={uploadData.category}
                  onChange={(e) => setUploadData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer"
                >
                  {uploading ? (
                    <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-spin" />
                  ) : (
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  )}
                  <p className="text-gray-600 mb-2">
                    {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-gray-500">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUpload(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
