'use client';

import React, { useState, useEffect } from 'react';

interface ValueHistory {
  id: string;
  date: string;
  estimated_value: number;
  source: string;
  change_percent?: number;
}

export default function HomeValuePage() {
  const [history, setHistory] = useState<ValueHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentValue, setCurrentValue] = useState(0);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newValue, setNewValue] = useState({ value: '', source: 'manual' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch('/api/homeowner/value');
      if (res.ok) {
        const data = await res.json();
        setHistory(data.history || []);
        setCurrentValue(data.current_value || 0);
        setPurchasePrice(data.purchase_price || 0);
        setPurchaseDate(data.purchase_date || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addValue = async () => {
    if (!newValue.value) return;
    try {
      await fetch('/api/homeowner/value', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estimated_value: parseFloat(newValue.value),
          source: newValue.source,
        }),
      });
      loadData();
      setShowAddModal(false);
      setNewValue({ value: '', source: 'manual' });
    } catch (e) {
      console.error(e);
    }
  };

  const fetchEstimate = async (source: string) => {
    try {
      const res = await fetch(`/api/homeowner/value/estimate?source=${source}`);
      if (res.ok) {
        const data = await res.json();
        if (data.estimate) {
          setNewValue({ value: data.estimate.toString(), source });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const equity = currentValue - purchasePrice;
  const equityPercent = purchasePrice > 0 ? ((equity / purchasePrice) * 100).toFixed(1) : 0;
  const appreciation = history.length > 1 
    ? ((currentValue - history[history.length - 1].estimated_value) / history[history.length - 1].estimated_value * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">📈 Home Value Tracker</h1>
          <p className="text-blue-100 mt-1">Track your home's equity and appreciation</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Current Estimate</p>
            <p className="text-3xl font-bold text-gray-900">${currentValue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Purchase Price</p>
            <p className="text-3xl font-bold text-gray-900">${purchasePrice.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Equity</p>
            <p className={`text-3xl font-bold ${equity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(equity).toLocaleString()}
            </p>
            <p className={`text-sm ${equity >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {equity >= 0 ? '+' : '-'}{equityPercent}%
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">YoY Appreciation</p>
            <p className={`text-3xl font-bold ${Number(appreciation) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {appreciation}%
            </p>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Value History</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              + Add Value
            </button>
          </div>
          
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-4xl mb-2">📊</p>
                <p>No value history yet. Add your first estimate!</p>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-end justify-between gap-2 px-4">
              {history.slice(-12).map((h, idx) => {
                const maxVal = Math.max(...history.map(v => v.estimated_value));
                const height = (h.estimated_value / maxVal) * 100;
                return (
                  <div key={h.id} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-indigo-500 rounded-t-lg transition-all hover:bg-indigo-600"
                      style={{ height: `${height}%` }}
                      title={`$${h.estimated_value.toLocaleString()}`}
                    />
                    <p className="text-xs text-gray-500 mt-2 rotate-45 origin-left">
                      {new Date(h.date).toLocaleDateString('en-US', { month: 'short' })}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Value Sources */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Get Fresh Estimate</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['zillow', 'redfin', 'realtor', 'manual'].map((source) => (
              <button
                key={source}
                onClick={() => source === 'manual' ? setShowAddModal(true) : fetchEstimate(source)}
                className="p-4 border rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
              >
                <p className="text-2xl mb-2">
                  {source === 'zillow' ? '🏠' : source === 'redfin' ? '🔴' : source === 'realtor' ? '🏡' : '✏️'}
                </p>
                <p className="font-medium capitalize">{source}</p>
                <p className="text-xs text-gray-500">
                  {source === 'manual' ? 'Enter manually' : 'Fetch estimate'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <h2 className="text-lg font-semibold p-6 border-b">All Estimates</h2>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Value</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Change</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {history.map((h) => (
                <tr key={h.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{new Date(h.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-medium">${h.estimated_value.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {h.change_percent !== undefined && (
                      <span className={h.change_percent >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {h.change_percent >= 0 ? '+' : ''}{h.change_percent.toFixed(1)}%
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 capitalize">{h.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Value Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Add Home Value</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Estimated Value</label>
                  <input
                    type="number"
                    value={newValue.value}
                    onChange={(e) => setNewValue({ ...newValue, value: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="450000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Source</label>
                  <select
                    value={newValue.source}
                    onChange={(e) => setNewValue({ ...newValue, source: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="manual">Manual Entry</option>
                    <option value="appraisal">Professional Appraisal</option>
                    <option value="zillow">Zillow</option>
                    <option value="redfin">Redfin</option>
                    <option value="realtor">Realtor.com</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAddModal(false)} className="flex-1 py-2 border rounded-lg">Cancel</button>
                <button onClick={addValue} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg">Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
