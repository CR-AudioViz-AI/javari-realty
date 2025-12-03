// CR REALTOR PLATFORM - LEASES LIST PAGE
// Created: December 3, 2025

'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Search,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  RefreshCw,
  Download
} from 'lucide-react';

const mockLeases = [
  {
    id: '1',
    tenant: 'John Smith',
    unit: 'Unit 204',
    property: 'Sunset Apartments',
    type: 'fixed',
    startDate: '2024-03-15',
    endDate: '2025-03-14',
    rent: 1850,
    deposit: 1850,
    status: 'active',
    daysUntilExpiry: 75,
  },
  {
    id: '2',
    tenant: 'Sarah Johnson',
    unit: 'Unit 305',
    property: 'Sunset Apartments',
    type: 'fixed',
    startDate: '2024-07-01',
    endDate: '2025-06-30',
    rent: 1950,
    deposit: 1950,
    status: 'active',
    daysUntilExpiry: 183,
  },
  {
    id: '3',
    tenant: 'Michael Brown',
    unit: 'Unit 112',
    property: 'Oakwood Townhomes',
    type: 'fixed',
    startDate: '2023-02-01',
    endDate: '2025-01-31',
    rent: 2200,
    deposit: 2200,
    status: 'expiring_soon',
    daysUntilExpiry: 28,
  },
  {
    id: '4',
    tenant: 'Emily Davis',
    unit: 'Unit 418',
    property: 'Sunset Apartments',
    type: 'fixed',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    rent: 1750,
    deposit: 1750,
    status: 'pending_signature',
    daysUntilExpiry: 363,
  },
  {
    id: '5',
    tenant: 'Robert Wilson',
    unit: 'Unit 201',
    property: 'Riverside Duplexes',
    type: 'month_to_month',
    startDate: '2023-03-01',
    endDate: null,
    rent: 1650,
    deposit: 1650,
    status: 'active',
    daysUntilExpiry: null,
  },
];

const statusConfig: Record<string, { color: string; label: string; icon: React.ComponentType<{className?: string}> }> = {
  active: { color: 'bg-green-100 text-green-700', label: 'Active', icon: CheckCircle },
  expiring_soon: { color: 'bg-yellow-100 text-yellow-700', label: 'Expiring Soon', icon: AlertTriangle },
  pending_signature: { color: 'bg-blue-100 text-blue-700', label: 'Pending Signature', icon: Clock },
  expired: { color: 'bg-red-100 text-red-700', label: 'Expired', icon: AlertTriangle },
  terminated: { color: 'bg-gray-100 text-gray-700', label: 'Terminated', icon: FileText },
};

export default function LeasesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredLeases = mockLeases.filter(l => {
    if (statusFilter !== 'all' && l.status !== statusFilter) return false;
    if (searchQuery && !l.tenant.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const expiringCount = mockLeases.filter(l => l.status === 'expiring_soon').length;
  const pendingCount = mockLeases.filter(l => l.status === 'pending_signature').length;

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leases</h1>
          <p className="text-gray-500">Manage lease agreements and renewals</p>
        </div>
        <Link
          href="/property-management/leases/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Create Lease
        </Link>
      </div>

      {/* Alert for expiring leases */}
      {expiringCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-900">
                {expiringCount} lease{expiringCount > 1 ? 's' : ''} expiring within 60 days
              </p>
              <p className="text-sm text-yellow-700">Review and send renewal offers</p>
            </div>
            <Link
              href="/property-management/leases?status=expiring_soon"
              className="ml-auto px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200"
            >
              View All
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Leases</p>
          <p className="text-2xl font-bold text-gray-900">{mockLeases.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600">
            {mockLeases.filter(l => l.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Expiring Soon</p>
          <p className="text-2xl font-bold text-yellow-600">{expiringCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Pending Signature</p>
          <p className="text-2xl font-bold text-blue-600">{pendingCount}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by tenant name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="expiring_soon">Expiring Soon</option>
          <option value="pending_signature">Pending Signature</option>
          <option value="expired">Expired</option>
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
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Term</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Rent</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLeases.map((lease) => {
              const status = statusConfig[lease.status] || statusConfig.active;
              const StatusIcon = status.icon;
              
              return (
                <tr key={lease.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <FileText className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{lease.tenant}</p>
                        <p className="text-sm text-gray-500">{lease.unit} • {lease.property}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="capitalize text-gray-700">
                      {lease.type.replace('_', '-')}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <p className="text-gray-900">
                      {new Date(lease.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      {' - '}
                      {lease.endDate 
                        ? new Date(lease.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                        : 'Ongoing'
                      }
                    </p>
                    {lease.daysUntilExpiry !== null && lease.daysUntilExpiry <= 60 && (
                      <p className="text-yellow-600 text-xs mt-1">
                        {lease.daysUntilExpiry} days remaining
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900">
                    ${lease.rent.toLocaleString()}/mo
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/property-management/leases/${lease.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg" title="View">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </Link>
                      <Link href={`/property-management/leases/${lease.id}/edit`} className="p-1.5 hover:bg-gray-100 rounded-lg" title="Edit">
                        <Edit className="w-4 h-4 text-gray-500" />
                      </Link>
                      {lease.status === 'expiring_soon' && (
                        <button className="p-1.5 hover:bg-blue-50 rounded-lg" title="Renew">
                          <RefreshCw className="w-4 h-4 text-blue-500" />
                        </button>
                      )}
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg" title="Download">
                        <Download className="w-4 h-4 text-gray-500" />
                      </button>
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
