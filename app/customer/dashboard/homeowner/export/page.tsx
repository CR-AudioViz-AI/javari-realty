'use client';

import React, { useState } from 'react';

export default function ExportPage() {
  const [exporting, setExporting] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf' | 'zip'>('zip');

  const exportOptions = [
    { id: 'all', label: 'Everything', icon: '📦', desc: 'All documents, expenses, warranties, and maintenance records' },
    { id: 'documents', label: 'Documents Only', icon: '📁', desc: 'All uploaded files and documents' },
    { id: 'expenses', label: 'Expenses', icon: '💰', desc: 'Expense history and reports' },
    { id: 'warranties', label: 'Warranties', icon: '🛡️', desc: 'Warranty information and details' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧', desc: 'Maintenance schedule and history' },
    { id: 'tax_report', label: 'Tax Report', icon: '🏛️', desc: 'Tax-deductible expenses and capital improvements' },
  ];

  const handleExport = async (type: string) => {
    setExporting(type);
    try {
      const response = await fetch(`/api/homeowner/export?type=${type}&format=${exportFormat}`);
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `homeowner-${type}-${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">📤 Export Your Data</h1>
          <p className="text-gray-600 mt-1">Download all your home data anytime. Your data belongs to you.</p>
        </div>

        {/* Format Selection */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Export Format</h2>
          <div className="flex gap-4">
            <label className={`flex-1 p-4 border-2 rounded-xl cursor-pointer transition-all ${
              exportFormat === 'zip' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="format"
                value="zip"
                checked={exportFormat === 'zip'}
                onChange={() => setExportFormat('zip')}
                className="sr-only"
              />
              <div className="text-center">
                <span className="text-3xl">🗂️</span>
                <p className="font-medium mt-2">ZIP Archive</p>
                <p className="text-sm text-gray-500">All files + data</p>
              </div>
            </label>
            <label className={`flex-1 p-4 border-2 rounded-xl cursor-pointer transition-all ${
              exportFormat === 'csv' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="format"
                value="csv"
                checked={exportFormat === 'csv'}
                onChange={() => setExportFormat('csv')}
                className="sr-only"
              />
              <div className="text-center">
                <span className="text-3xl">📊</span>
                <p className="font-medium mt-2">CSV</p>
                <p className="text-sm text-gray-500">Spreadsheet format</p>
              </div>
            </label>
            <label className={`flex-1 p-4 border-2 rounded-xl cursor-pointer transition-all ${
              exportFormat === 'pdf' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="format"
                value="pdf"
                checked={exportFormat === 'pdf'}
                onChange={() => setExportFormat('pdf')}
                className="sr-only"
              />
              <div className="text-center">
                <span className="text-3xl">📄</span>
                <p className="font-medium mt-2">PDF Report</p>
                <p className="text-sm text-gray-500">Printable summary</p>
              </div>
            </label>
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">What to Export</h2>
          <div className="space-y-3">
            {exportOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between p-4 border rounded-xl hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{option.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{option.label}</p>
                    <p className="text-sm text-gray-500">{option.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleExport(option.id)}
                  disabled={exporting !== null}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    exporting === option.id
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {exporting === option.id ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span> Exporting...
                    </span>
                  ) : (
                    'Download'
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Data Ownership Notice */}
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <h3 className="font-semibold text-green-900">Your Data, Your Rights</h3>
              <p className="text-sm text-green-700 mt-1">
                You can export all your data anytime, in standard formats. We believe your information 
                belongs to you. No lock-in, no restrictions. Take it with you wherever you go.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
