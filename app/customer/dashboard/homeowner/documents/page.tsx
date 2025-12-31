'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { HomeDocument, DocumentCategory } from '@/types/homeowner';

const CATEGORIES: Record<DocumentCategory, { label: string; icon: string }> = {
  closing: { label: 'Closing', icon: '📋' },
  warranty: { label: 'Warranties', icon: '🛡️' },
  insurance: { label: 'Insurance', icon: '🏥' },
  hoa: { label: 'HOA', icon: '🏘️' },
  permits: { label: 'Permits', icon: '📜' },
  inspections: { label: 'Inspections', icon: '🔍' },
  manuals: { label: 'Manuals', icon: '📖' },
  invoices: { label: 'Invoices', icon: '💵' },
  receipts: { label: 'Receipts', icon: '🧾' },
  contracts: { label: 'Contracts', icon: '📝' },
  tax: { label: 'Tax Records', icon: '🏛️' },
  photos: { label: 'Photos', icon: '📷' },
  other: { label: 'Other', icon: '📁' },
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<HomeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<DocumentCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await fetch('/api/homeowner/documents');
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, category: DocumentCategory) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);
        formData.append('name', file.name);

        const response = await fetch('/api/homeowner/documents', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Upload failed');
      }
      await loadDocuments();
      setShowUploadModal(false);
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (id: string) => {
    if (!confirm('Delete this document?')) return;
    try {
      await fetch(`/api/homeowner/documents?id=${id}`, { method: 'DELETE' });
      setDocuments(documents.filter(d => d.id !== id));
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const filteredDocs = documents.filter(doc => {
    if (filter !== 'all' && doc.category !== filter) return false;
    if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const groupedDocs = filteredDocs.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, HomeDocument[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📁 Document Repository</h1>
            <p className="text-gray-600">Store and organize all your home documents</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            + Upload Document
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[200px] border rounded-lg px-4 py-2"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as DocumentCategory | 'all')}
            className="border rounded-lg px-4 py-2"
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORIES).map(([key, val]) => (
              <option key={key} value={key}>{val.icon} {val.label}</option>
            ))}
          </select>
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-4xl mb-4">📂</p>
            <p className="text-gray-600">No documents yet. Upload your first document!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedDocs).map(([category, docs]) => (
              <div key={category} className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {CATEGORIES[category as DocumentCategory]?.icon} {CATEGORIES[category as DocumentCategory]?.label}
                  <span className="text-gray-400 font-normal ml-2">({docs.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {docs.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4 hover:border-indigo-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{doc.name}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(doc.uploaded_at).toLocaleDateString()}
                          </p>
                          {doc.expiration_date && (
                            <p className={`text-sm ${
                              new Date(doc.expiration_date) < new Date() ? 'text-red-500' : 'text-green-600'
                            }`}>
                              Expires: {new Date(doc.expiration_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-2">
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            📥
                          </a>
                          <button
                            onClick={() => deleteDocument(doc.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Upload Document</h3>
              <div className="space-y-4">
                {Object.entries(CATEGORIES).map(([key, val]) => (
                  <label key={key} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <span className="text-2xl">{val.icon}</span>
                    <span className="flex-1">{val.label}</span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, key as DocumentCategory)}
                      disabled={uploading}
                    />
                    <span className="text-indigo-600">Select</span>
                  </label>
                ))}
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="mt-4 w-full py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
