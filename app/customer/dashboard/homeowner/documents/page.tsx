'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface HomeDocument {
  id: string;
  category: string;
  name: string;
  file_url: string;
  uploaded_at: string;
}

const CATEGORIES: Record<string, { label: string; icon: string }> = {
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
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => { loadDocuments(); }, []);

  const loadDocuments = async () => {
    try {
      const res = await fetch('/api/homeowner/documents');
      if (res.ok) setDocuments((await res.json()).documents || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, cat: string) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('category', cat);
      fd.append('name', file.name);
      await fetch('/api/homeowner/documents', { method: 'POST', body: fd });
    }
    loadDocuments();
    setShowUploadModal(false);
  };

  const deleteDoc = async (id: string) => {
    if (!confirm('Delete?')) return;
    await fetch(`/api/homeowner/documents?id=${id}`, { method: 'DELETE' });
    setDocuments(documents.filter(d => d.id !== id));
  };

  const filtered = documents.filter(d => (filter === 'all' || d.category === filter) && (!searchQuery || d.name.toLowerCase().includes(searchQuery.toLowerCase())));
  const grouped = filtered.reduce((a, d) => { (a[d.category] = a[d.category] || []).push(d); return a; }, {} as Record<string, HomeDocument[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-2xl font-bold">📁 Documents</h1></div>
          <button onClick={() => setShowUploadModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">+ Upload</button>
        </div>
        <div className="flex gap-4 mb-6">
          <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 border rounded-lg px-4 py-2" />
          <select value={filter} onChange={e => setFilter(e.target.value)} className="border rounded-lg px-4 py-2">
            <option value="all">All</option>
            {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
          </select>
        </div>
        {loading ? <div className="text-center py-12">Loading...</div> : Object.entries(grouped).map(([cat, docs]) => (
          <div key={cat} className="bg-white rounded-xl shadow-sm p-6 mb-4">
            <h2 className="font-semibold mb-4">{CATEGORIES[cat]?.icon} {CATEGORIES[cat]?.label} ({docs.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {docs.map(d => (
                <div key={d.id} className="border rounded-lg p-4 flex justify-between">
                  <div><p className="font-medium truncate">{d.name}</p><p className="text-sm text-gray-500">{new Date(d.uploaded_at).toLocaleDateString()}</p></div>
                  <div className="flex gap-2"><a href={d.file_url} target="_blank">📥</a><button onClick={() => deleteDoc(d.id)}>🗑️</button></div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="font-semibold mb-4">Upload Document</h3>
              {Object.entries(CATEGORIES).map(([k, v]) => (
                <label key={k} className="flex items-center gap-3 p-3 border rounded-lg mb-2 cursor-pointer hover:bg-gray-50">
                  <span>{v.icon}</span><span className="flex-1">{v.label}</span>
                  <input type="file" multiple className="hidden" onChange={e => handleUpload(e, k)} />
                  <span className="text-indigo-600">Select</span>
                </label>
              ))}
              <button onClick={() => setShowUploadModal(false)} className="w-full py-2 border rounded-lg mt-4">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
