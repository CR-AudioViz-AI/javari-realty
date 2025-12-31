'use client';

import React, { useState, useEffect } from 'react';
import { HomeExpense, ExpenseCategory } from '@/types/homeowner';

const CATEGORIES: Record<ExpenseCategory, { label: string; icon: string }> = {
  mortgage: { label: 'Mortgage', icon: '🏦' },
  property_tax: { label: 'Property Tax', icon: '🏛️' },
  insurance: { label: 'Insurance', icon: '🛡️' },
  hoa: { label: 'HOA Fees', icon: '🏘️' },
  utilities: { label: 'Utilities', icon: '💡' },
  maintenance: { label: 'Maintenance', icon: '🔧' },
  repairs: { label: 'Repairs', icon: '🔨' },
  improvements: { label: 'Improvements', icon: '📈' },
  landscaping: { label: 'Landscaping', icon: '🌳' },
  cleaning: { label: 'Cleaning', icon: '🧹' },
  pest_control: { label: 'Pest Control', icon: '🐜' },
  pool: { label: 'Pool/Spa', icon: '🏊' },
  security: { label: 'Security', icon: '🔐' },
  other: { label: 'Other', icon: '📁' },
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<HomeExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<{ year: number; category: string }>({
    year: new Date().getFullYear(),
    category: 'all',
  });
  const [newExpense, setNewExpense] = useState({
    category: 'other' as ExpenseCategory,
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    vendor: '',
    is_recurring: false,
    is_capital_improvement: false,
  });

  useEffect(() => {
    loadExpenses();
  }, [filter]);

  const loadExpenses = async () => {
    try {
      const response = await fetch(`/api/homeowner/expenses?year=${filter.year}`);
      if (response.ok) {
        const data = await response.json();
        setExpenses(data.expenses || []);
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async () => {
    if (!newExpense.description || !newExpense.amount) {
      alert('Please fill in description and amount');
      return;
    }

    try {
      const response = await fetch('/api/homeowner/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newExpense,
          amount: parseFloat(newExpense.amount),
        }),
      });

      if (response.ok) {
        await loadExpenses();
        setShowAddModal(false);
        setNewExpense({
          category: 'other',
          description: '',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          vendor: '',
          is_recurring: false,
          is_capital_improvement: false,
        });
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const deleteExpense = async (id: string) => {
    if (!confirm('Delete this expense?')) return;
    try {
      await fetch(`/api/homeowner/expenses?id=${id}`, { method: 'DELETE' });
      setExpenses(expenses.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  // Calculate totals
  const filteredExpenses = expenses.filter(e => 
    filter.category === 'all' || e.category === filter.category
  );

  const totalYTD = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const byCategory = filteredExpenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const capitalImprovements = filteredExpenses
    .filter(e => e.is_capital_improvement)
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">💰 Expense Tracker</h1>
            <p className="text-gray-600">Track all your home-related expenses</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            + Add Expense
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-gray-500 text-sm">Total {filter.year}</p>
            <p className="text-2xl font-bold text-gray-900">${totalYTD.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-gray-500 text-sm">Monthly Average</p>
            <p className="text-2xl font-bold text-gray-900">
              ${Math.round(totalYTD / 12).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-gray-500 text-sm">Capital Improvements</p>
            <p className="text-2xl font-bold text-green-600">${capitalImprovements.toLocaleString()}</p>
            <p className="text-xs text-gray-400">Tax basis tracking</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-gray-500 text-sm">Transactions</p>
            <p className="text-2xl font-bold text-gray-900">{filteredExpenses.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={filter.year}
            onChange={(e) => setFilter({ ...filter, year: parseInt(e.target.value) })}
            className="border rounded-lg px-4 py-2"
          >
            {[2025, 2024, 2023, 2022].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            className="border rounded-lg px-4 py-2"
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORIES).map(([key, val]) => (
              <option key={key} value={key}>{val.icon} {val.label}</option>
            ))}
          </select>
          <button
            onClick={() => window.open(`/api/homeowner/expenses/export?year=${filter.year}`, '_blank')}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            📤 Export CSV
          </button>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Breakdown by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {Object.entries(byCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, amount]) => (
                <div key={cat} className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl">{CATEGORIES[cat as ExpenseCategory]?.icon}</p>
                  <p className="text-sm text-gray-600">{CATEGORIES[cat as ExpenseCategory]?.label}</p>
                  <p className="font-bold text-indigo-600">${amount.toLocaleString()}</p>
                </div>
              ))}
          </div>
        </div>

        {/* Expense List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Description</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Vendor</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Amount</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm">
                    {CATEGORIES[expense.category]?.icon} {CATEGORIES[expense.category]?.label}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {expense.description}
                    {expense.is_capital_improvement && (
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                        Capital
                      </span>
                    )}
                    {expense.is_recurring && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        Recurring
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{expense.vendor || '-'}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium">${expense.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Expense Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Add Expense</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as ExpenseCategory })}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    {Object.entries(CATEGORIES).map(([key, val]) => (
                      <option key={key} value={key}>{val.icon} {val.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <input
                    type="text"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="What was this expense for?"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount</label>
                    <input
                      type="number"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Vendor (optional)</label>
                  <input
                    type="text"
                    value={newExpense.vendor}
                    onChange={(e) => setNewExpense({ ...newExpense, vendor: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Company or person"
                  />
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newExpense.is_recurring}
                      onChange={(e) => setNewExpense({ ...newExpense, is_recurring: e.target.checked })}
                    />
                    <span className="text-sm">Recurring</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newExpense.is_capital_improvement}
                      onChange={(e) => setNewExpense({ ...newExpense, is_capital_improvement: e.target.checked })}
                    />
                    <span className="text-sm">Capital Improvement</span>
                  </label>
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
                  onClick={addExpense}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add Expense
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
