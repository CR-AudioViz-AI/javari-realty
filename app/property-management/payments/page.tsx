// CR REALTOR PLATFORM - PAYMENTS PAGE
// Created: December 3, 2025

'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Plus,
  Search,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  CreditCard,
  Eye,
  RefreshCw
} from 'lucide-react';

const mockPayments = [
  { id: '1', tenant: 'John Smith', unit: 'Unit 204', property: 'Sunset Apartments', amount: 1850, dueDate: '2025-01-01', paidDate: '2024-12-30', status: 'paid', method: 'ach', lateFee: 0 },
  { id: '2', tenant: 'Sarah Johnson', unit: 'Unit 305', property: 'Sunset Apartments', amount: 1950, dueDate: '2025-01-01', paidDate: '2025-01-01', status: 'paid', method: 'credit_card', lateFee: 0 },
  { id: '3', tenant: 'Michael Brown', unit: 'Unit 112', property: 'Oakwood Townhomes', amount: 2200, dueDate: '2025-01-01', paidDate: null, status: 'late', method: null, lateFee: 110 },
  { id: '4', tenant: 'Emily Davis', unit: 'Unit 418', property: 'Sunset Apartments', amount: 1750, dueDate: '2025-01-01', paidDate: null, status: 'pending', method: null, lateFee: 0 },
  { id: '5', tenant: 'Robert Wilson', unit: 'Unit 201', property: 'Riverside Duplexes', amount: 1650, dueDate: '2025-01-01', paidDate: '2025-01-02', status: 'paid', method: 'check', lateFee: 0 },
  { id: '6', tenant: 'Anna Lee', unit: 'Unit 101', property: 'Sunset Apartments', amount: 1450, dueDate: '2025-01-01', paidDate: '2024-12-28', status: 'paid', method: 'online', lateFee: 0 },
  { id: '7', tenant: 'Mark Chen', unit: 'Unit 102', property: 'Sunset Apartments', amount: 1450, dueDate: '2025-01-01', paidDate: null, status: 'pending', method: null, lateFee: 0 },
  { id: '8', tenant: 'Lisa Park', unit: 'Unit 202', property: 'Sunset Apartments', amount: 1750, dueDate: '2025-01-01', paidDate: '2024-12-31', status: 'paid', method: 'ach', lateFee: 0 },
];

const statusConfig: Record<string, { color: string; bgColor: string; label: string; icon: React.ComponentType<{className?: string}> }> = {
  paid: { color: 'text-green-700', bgColor: 'bg-green-100', label: 'Paid', icon: CheckCircle },
  pending: { color: 'text-yellow-700', bgColor: 'bg-yellow-100', label: 'Pending', icon: Clock },
  late: { color: 'text-red-700', bgColor: 'bg-red-100', label: 'Late', icon: AlertTriangle },
  partial: { color: 'text-orange-700', bgColor: 'bg-orange-100', label: 'Partial', icon: Clock },
};

const methodLabels: Record<string, string> = {
  ach: 'ACH Transfer',
  credit_card: 'Credit Card',
  check: 'Check',
  cash: 'Cash',
  online: 'Online Portal',
  money_order: 'Money Order',
};

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('2025-01');

  const filteredPayments = mockPayments.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (searchQuery && !p.tenant.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const collected = mockPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const outstanding = mockPayments.filter(p => p.status !== 'paid').reduce((sum, p) => sum + p.amount + p.lateFee, 0);
  const lateCount = mockPayments.filter(p => p.status === 'late').length;

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500">Track rent collection and payment history</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/property-management/payments/record"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Record Payment
          </Link>
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium">
            <RefreshCw className="w-4 h-4" />
            Generate Invoices
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Collected (MTD)</p>
          <p className="text-2xl font-bold text-green-600">${collected.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Outstanding</p>
          <p className="text-2xl font-bold text-red-600">${outstanding.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Late Payments</p>
          <p className="text-2xl font-bold text-yellow-600">{lateCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Collection Rate</p>
          <p className="text-2xl font-bold text-gray-900">
            {Math.round((collected / (collected + outstanding)) * 100)}%
          </p>
        </div>
      </div>

      {lateCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-red-900">
                {lateCount} payment{lateCount > 1 ? 's are' : ' is'} past due
              </p>
              <p className="text-sm text-red-700">Late fees have been applied. Consider sending reminders.</p>
            </div>
            <button className="ml-auto px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200">
              Send Reminders
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by tenant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <input
          type="month"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="late">Late</option>
        </select>
        <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tenant / Unit</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Due Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Late Fee</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Paid</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Method</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPayments.map((payment) => {
              const status = statusConfig[payment.status];
              const StatusIcon = status.icon;
              
              return (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{payment.tenant}</p>
                      <p className="text-sm text-gray-500">{payment.unit} • {payment.property}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {new Date(payment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900">
                    ${payment.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {payment.lateFee > 0 ? (
                      <span className="text-red-600">${payment.lateFee}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${status.bgColor} ${status.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {payment.paidDate 
                      ? new Date(payment.paidDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : <span className="text-gray-400">—</span>
                    }
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {payment.method ? (
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3" />
                        {methodLabels[payment.method] || payment.method}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/property-management/payments/${payment.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </Link>
                      {payment.status !== 'paid' && (
                        <Link href={`/property-management/payments/record?payment=${payment.id}`} className="p-1.5 hover:bg-green-50 rounded-lg">
                          <DollarSign className="w-4 h-4 text-green-600" />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
