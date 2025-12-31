'use client';

import React, { useState, useEffect } from 'react';
import { MortgageRate, Lender, LOAN_TYPE_INFO, LoanType, MortgageCalculation } from '@/types/mortgage';

export default function MortgageComparisonPage() {
  const [rates, setRates] = useState<MortgageRate[]>([]);
  const [lenders, setLenders] = useState<Lender[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    loanType: 'conventional' as LoanType,
    termYears: 30,
    loanAmount: 400000,
    downPayment: 80000,
    creditScore: 720,
  });
  const [calculation, setCalculation] = useState<MortgageCalculation | null>(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [targetRate, setTargetRate] = useState('');

  useEffect(() => {
    loadRates();
  }, [filters]);

  const loadRates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        loanType: filters.loanType,
        termYears: filters.termYears.toString(),
        loanAmount: filters.loanAmount.toString(),
        creditScore: filters.creditScore.toString(),
      });
      const res = await fetch(`/api/mortgage/rates?${params}`);
      if (res.ok) {
        const data = await res.json();
        setRates(data.rates || []);
        setLenders(data.lenders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const calculatePayment = (rate: number) => {
    const principal = filters.loanAmount - filters.downPayment;
    const monthlyRate = rate / 100 / 12;
    const numPayments = filters.termYears * 12;
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    return Math.round(payment);
  };

  const createRateAlert = async () => {
    if (!targetRate) return;
    try {
      await fetch('/api/mortgage/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loan_type: filters.loanType,
          term_years: filters.termYears,
          target_rate: parseFloat(targetRate),
        }),
      });
      setShowAlertModal(false);
      setTargetRate('');
      alert('Rate alert created! We\'ll notify you when rates drop.');
    } catch (e) {
      console.error(e);
    }
  };

  const sortedRates = [...rates].sort((a, b) => a.rate - b.rate);
  const avgRate = rates.length > 0 ? rates.reduce((s, r) => s + r.rate, 0) / rates.length : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">🏦 Javari Mortgage Comparison</h1>
          <p className="text-green-100 mt-1">Compare rates from top lenders instantly</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Loan Type</label>
              <select
                value={filters.loanType}
                onChange={(e) => setFilters({ ...filters, loanType: e.target.value as LoanType })}
                className="w-full border rounded-lg px-3 py-2"
              >
                {Object.entries(LOAN_TYPE_INFO).map(([k, v]) => (
                  <option key={k} value={k}>{v.icon} {v.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Term</label>
              <select
                value={filters.termYears}
                onChange={(e) => setFilters({ ...filters, termYears: parseInt(e.target.value) })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value={30}>30 Years</option>
                <option value={20}>20 Years</option>
                <option value={15}>15 Years</option>
                <option value={10}>10 Years</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Loan Amount</label>
              <input
                type="number"
                value={filters.loanAmount}
                onChange={(e) => setFilters({ ...filters, loanAmount: parseInt(e.target.value) || 0 })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Down Payment</label>
              <input
                type="number"
                value={filters.downPayment}
                onChange={(e) => setFilters({ ...filters, downPayment: parseInt(e.target.value) || 0 })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Credit Score</label>
              <select
                value={filters.creditScore}
                onChange={(e) => setFilters({ ...filters, creditScore: parseInt(e.target.value) })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value={760}>760+ Excellent</option>
                <option value={720}>720-759 Very Good</option>
                <option value={680}>680-719 Good</option>
                <option value={640}>640-679 Fair</option>
                <option value={600}>600-639 Poor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-gray-500 text-sm">Lowest Rate</p>
            <p className="text-2xl font-bold text-green-600">{sortedRates[0]?.rate.toFixed(3) || '--'}%</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-gray-500 text-sm">Average Rate</p>
            <p className="text-2xl font-bold">{avgRate.toFixed(3)}%</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-gray-500 text-sm">Lenders Found</p>
            <p className="text-2xl font-bold">{rates.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-gray-500 text-sm">Est. Monthly</p>
            <p className="text-2xl font-bold">${calculatePayment(sortedRates[0]?.rate || 7).toLocaleString()}</p>
          </div>
        </div>

        {/* Rate Alert Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowAlertModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            🔔 Set Rate Alert
          </button>
        </div>

        {/* Rates Table */}
        {loading ? (
          <div className="text-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div></div>
        ) : sortedRates.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-4xl mb-4">🏦</p>
            <p className="text-gray-600">No rates found for your criteria.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Lender</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Rate</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">APR</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Monthly</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Points</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Fees</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Rating</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sortedRates.map((rate, idx) => (
                  <tr key={rate.id} className={idx === 0 ? 'bg-green-50' : 'hover:bg-gray-50'}>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">🏦</div>
                        <div>
                          <p className="font-medium">{rate.lender_name}</p>
                          {idx === 0 && <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded">Best Rate</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-bold text-lg">{rate.rate.toFixed(3)}%</td>
                    <td className="px-4 py-4">{rate.apr.toFixed(3)}%</td>
                    <td className="px-4 py-4 font-medium">${calculatePayment(rate.rate).toLocaleString()}</td>
                    <td className="px-4 py-4">{rate.points}</td>
                    <td className="px-4 py-4">${rate.fees.toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span>4.5</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                        Get Quote
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Rate Alert Modal */}
        {showAlertModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">🔔 Set Rate Alert</h3>
              <p className="text-gray-600 mb-4">We'll email you when {filters.termYears}-year {filters.loanType} rates drop to your target.</p>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Target Rate (%)</label>
                <input
                  type="number"
                  step="0.125"
                  value={targetRate}
                  onChange={(e) => setTargetRate(e.target.value)}
                  placeholder={`e.g., ${(avgRate - 0.25).toFixed(3)}`}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowAlertModal(false)} className="flex-1 py-2 border rounded-lg">Cancel</button>
                <button onClick={createRateAlert} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg">Create Alert</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
