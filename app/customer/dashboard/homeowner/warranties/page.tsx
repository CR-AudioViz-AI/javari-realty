'use client';

import React, { useState, useEffect } from 'react';
import { Warranty } from '@/types/homeowner';

const WARRANTY_CATEGORIES = [
  { id: 'appliances', label: 'Appliances', icon: '🔌' },
  { id: 'hvac', label: 'HVAC', icon: '❄️' },
  { id: 'roof', label: 'Roof', icon: '🏠' },
  { id: 'plumbing', label: 'Plumbing', icon: '🚿' },
  { id: 'electrical', label: 'Electrical', icon: '⚡' },
  { id: 'structural', label: 'Structural', icon: '🏗️' },
  { id: 'pool', label: 'Pool/Spa', icon: '🏊' },
  { id: 'home_warranty', label: 'Home Warranty', icon: '🏡' },
  { id: 'other', label: 'Other', icon: '📋' },
];

export default function WarrantiesPage() {
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'expiring' | 'expired'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWarranty, setNewWarranty] = useState({
    item_name: '',
    item_category: 'appliances',
    brand: '',
    model: '',
    serial_number: '',
    purchase_date: '',
    warranty_start_date: '',
    warranty_end_date: '',
    warranty_type: 'manufacturer' as const,
    provider_name: '',
    provider_phone: '',
    coverage_details: '',
  });

  useEffect(() => {
    loadWarranties();
  }, []);

  const loadWarranties = async () => {
    try {
      const response = await fetch('/api/homeowner/warranties');
      if (response.ok) {
        const data = await response.json();
        setWarranties(data.warranties || []);
      }
    } catch (error) {
      console.error('Error loading warranties:', error);
    } finally {
      setLoading(false);
    }
  };

  const addWarranty = async () => {
    if (!newWarranty.item_name || !newWarranty.warranty_end_date) {
      alert('Please fill in item name and warranty end date');
      return;
    }

    try {
      const response = await fetch('/api/homeowner/warranties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWarranty),
      });

      if (response.ok) {
        await loadWarranties();
        setShowAddModal(false);
        setNewWarranty({
          item_name: '',
          item_category: 'appliances',
          brand: '',
          model: '',
          serial_number: '',
          purchase_date: '',
          warranty_start_date: '',
          warranty_end_date: '',
          warranty_type: 'manufacturer',
          provider_name: '',
          provider_phone: '',
          coverage_details: '',
        });
      }
    } catch (error) {
      console.error('Error adding warranty:', error);
    }
  };

  const deleteWarranty = async (id: string) => {
    if (!confirm('Delete this warranty?')) return;
    try {
      await fetch(`/api/homeowner/warranties?id=${id}`, { method: 'DELETE' });
      setWarranties(warranties.filter(w => w.id !== id));
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const getWarrantyStatus = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return { status: 'expired', label: 'Expired', color: 'bg-red-100 text-red-700' };
    if (daysUntilExpiry <= 30) return { status: 'expiring', label: `${daysUntilExpiry} days left`, color: 'bg-yellow-100 text-yellow-700' };
    if (daysUntilExpiry <= 90) return { status: 'expiring', label: `${daysUntilExpiry} days left`, color: 'bg-orange-100 text-orange-700' };
    return { status: 'active', label: 'Active', color: 'bg-green-100 text-green-700' };
  };

  const filteredWarranties = warranties.filter(w => {
    const status = getWarrantyStatus(w.warranty_end_date).status;
    if (filter === 'all') return true;
    if (filter === 'expiring') return status === 'expiring';
    return status === filter;
  });

  const stats = {
    total: warranties.length,
    active: warranties.filter(w => getWarrantyStatus(w.warranty_end_date).status === 'active').length,
    expiring: warranties.filter(w => getWarrantyStatus(w.warranty_end_date).status === 'expiring').length,
    expired: warranties.filter(w => getWarrantyStatus(w.warranty_end_date).status === 'expired').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🛡️ Warranty Tracker</h1>
            <p className="text-gray-600">Never miss a warranty expiration</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            + Add Warranty
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`p-4 rounded-xl text-left transition-all ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white shadow-sm hover:shadow'}`}
          >
            <p className={filter === 'all' ? 'text-indigo-100' : 'text-gray-500'}>Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`p-4 rounded-xl text-left transition-all ${filter === 'active' ? 'bg-green-600 text-white' : 'bg-white shadow-sm hover:shadow'}`}
          >
            <p className={filter === 'active' ? 'text-green-100' : 'text-gray-500'}>Active</p>
            <p className="text-2xl font-bold">{stats.active}</p>
          </button>
          <button
            onClick={() => setFilter('expiring')}
            className={`p-4 rounded-xl text-left transition-all ${filter === 'expiring' ? 'bg-yellow-600 text-white' : 'bg-white shadow-sm hover:shadow'}`}
          >
            <p className={filter === 'expiring' ? 'text-yellow-100' : 'text-gray-500'}>Expiring Soon</p>
            <p className="text-2xl font-bold">{stats.expiring}</p>
          </button>
          <button
            onClick={() => setFilter('expired')}
            className={`p-4 rounded-xl text-left transition-all ${filter === 'expired' ? 'bg-red-600 text-white' : 'bg-white shadow-sm hover:shadow'}`}
          >
            <p className={filter === 'expired' ? 'text-red-100' : 'text-gray-500'}>Expired</p>
            <p className="text-2xl font-bold">{stats.expired}</p>
          </button>
        </div>

        {/* Warranty List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : filteredWarranties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-4xl mb-4">🛡️</p>
            <p className="text-gray-600">No warranties found. Add your first warranty!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWarranties.map((warranty) => {
              const statusInfo = getWarrantyStatus(warranty.warranty_end_date);
              const category = WARRANTY_CATEGORIES.find(c => c.id === warranty.item_category);
              
              return (
                <div key={warranty.id} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{category?.icon || '📋'}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{warranty.item_name}</h3>
                        <p className="text-sm text-gray-500">{warranty.brand} {warranty.model}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Expires:</span>
                      <span className="font-medium">{new Date(warranty.warranty_end_date).toLocaleDateString()}</span>
                    </div>
                    {warranty.serial_number && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Serial:</span>
                        <span className="font-mono text-xs">{warranty.serial_number}</span>
                      </div>
                    )}
                    {warranty.provider_name && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Provider:</span>
                        <span>{warranty.provider_name}</span>
                      </div>
                    )}
                    {warranty.provider_phone && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Phone:</span>
                        <a href={`tel:${warranty.provider_phone}`} className="text-indigo-600">
                          {warranty.provider_phone}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <button className="flex-1 py-1.5 text-sm border rounded-lg hover:bg-gray-50">
                      View Details
                    </button>
                    <button
                      onClick={() => deleteWarranty(warranty.id)}
                      className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Warranty Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 my-8">
              <h3 className="text-lg font-semibold mb-4">Add Warranty</h3>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Item Name *</label>
                    <input
                      type="text"
                      value={newWarranty.item_name}
                      onChange={(e) => setNewWarranty({ ...newWarranty, item_name: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="e.g., Samsung Refrigerator"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      value={newWarranty.item_category}
                      onChange={(e) => setNewWarranty({ ...newWarranty, item_category: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      {WARRANTY_CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Warranty Type</label>
                    <select
                      value={newWarranty.warranty_type}
                      onChange={(e) => setNewWarranty({ ...newWarranty, warranty_type: e.target.value as any })}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="manufacturer">Manufacturer</option>
                      <option value="extended">Extended</option>
                      <option value="home_warranty">Home Warranty</option>
                      <option value="service_contract">Service Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Brand</label>
                    <input
                      type="text"
                      value={newWarranty.brand}
                      onChange={(e) => setNewWarranty({ ...newWarranty, brand: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Model</label>
                    <input
                      type="text"
                      value={newWarranty.model}
                      onChange={(e) => setNewWarranty({ ...newWarranty, model: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Serial Number</label>
                    <input
                      type="text"
                      value={newWarranty.serial_number}
                      onChange={(e) => setNewWarranty({ ...newWarranty, serial_number: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Purchase Date</label>
                    <input
                      type="date"
                      value={newWarranty.purchase_date}
                      onChange={(e) => setNewWarranty({ ...newWarranty, purchase_date: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Warranty End Date *</label>
                    <input
                      type="date"
                      value={newWarranty.warranty_end_date}
                      onChange={(e) => setNewWarranty({ ...newWarranty, warranty_end_date: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Provider Name</label>
                    <input
                      type="text"
                      value={newWarranty.provider_name}
                      onChange={(e) => setNewWarranty({ ...newWarranty, provider_name: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Provider Phone</label>
                    <input
                      type="tel"
                      value={newWarranty.provider_phone}
                      onChange={(e) => setNewWarranty({ ...newWarranty, provider_phone: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Coverage Details</label>
                    <textarea
                      value={newWarranty.coverage_details}
                      onChange={(e) => setNewWarranty({ ...newWarranty, coverage_details: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      rows={3}
                      placeholder="What's covered under this warranty?"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addWarranty}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add Warranty
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
