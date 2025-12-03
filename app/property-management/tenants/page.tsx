// CR REALTOR PLATFORM - TENANTS LIST PAGE
// Created: December 3, 2025

'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  Eye,
  Edit,
  Download
} from 'lucide-react';

const mockTenants = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '(239) 555-0101',
    unit: 'Unit 204',
    property: 'Sunset Apartments',
    rent: 1850,
    leaseEnd: '2025-03-14',
    status: 'active',
    paymentStatus: 'current',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '(239) 555-0102',
    unit: 'Unit 305',
    property: 'Sunset Apartments',
    rent: 1950,
    leaseEnd: '2025-06-30',
    status: 'active',
    paymentStatus: 'current',
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'mbrown@email.com',
    phone: '(239) 555-0103',
    unit: 'Unit 112',
    property: 'Oakwood Townhomes',
    rent: 2200,
    leaseEnd: '2025-01-31',
    status: 'active',
    paymentStatus: 'late',
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.d@email.com',
    phone: '(239) 555-0104',
    unit: 'Unit 418',
    property: 'Sunset Apartments',
    rent: 1750,
    leaseEnd: '2025-12-31',
    status: 'active',
    paymentStatus: 'current',
  },
  {
    id: '5',
    name: 'Robert Wilson',
    email: 'rwilson@email.com',
    phone: '(239) 555-0105',
    unit: 'Unit 201',
    property: 'Riverside Duplexes',
    rent: 1650,
    leaseEnd: '2025-02-28',
    status: 'notice_given',
    paymentStatus: 'current',
  },
];

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  notice_given: 'bg-yellow-100 text-yellow-700',
  applicant: 'bg-blue-100 text-blue-700',
  moved_out: 'bg-gray-100 text-gray-700',
};

const paymentColors: Record<string, string> = {
  current: 'bg-green-100 text-green-700',
  late: 'bg-red-100 text-red-700',
  partial: 'bg-yellow-100 text-yellow-700',
};

export default function TenantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTenants = mockTenants.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
          <p className="text-gray-500">Manage all tenants across your properties</p>
        </div>
        <Link
          href="/property-management/tenants/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Tenant
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Tenants</p>
          <p className="text-2xl font-bold text-gray-900">{mockTenants.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600">
            {mockTenants.filter(t => t.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Notice Given</p>
          <p className="text-2xl font-bold text-yellow-600">
            {mockTenants.filter(t => t.status === 'notice_given').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Late Payments</p>
          <p className="text-2xl font-bold text-red-600">
            {mockTenants.filter(t => t.paymentStatus === 'late').length}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tenants..."
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
          <option value="notice_given">Notice Given</option>
          <option value="applicant">Applicant</option>
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
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tenant</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Unit</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Rent</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Lease Ends</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Payment</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTenants.map((tenant) => (
              <tr key={tenant.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {tenant.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{tenant.name}</p>
                      <p className="text-sm text-gray-500">{tenant.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="text-gray-900">{tenant.unit}</p>
                  <p className="text-sm text-gray-500">{tenant.property}</p>
                </td>
                <td className="px-4 py-4 font-medium text-gray-900">
                  ${tenant.rent.toLocaleString()}/mo
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">
                  {new Date(tenant.leaseEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[tenant.status] || 'bg-gray-100 text-gray-700'}`}>
                    {tenant.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${paymentColors[tenant.paymentStatus] || 'bg-gray-100 text-gray-700'}`}>
                    {tenant.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Link href={`/property-management/tenants/${tenant.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg">
                      <Eye className="w-4 h-4 text-gray-500" />
                    </Link>
                    <Link href={`/property-management/tenants/${tenant.id}/edit`} className="p-1.5 hover:bg-gray-100 rounded-lg">
                      <Edit className="w-4 h-4 text-gray-500" />
                    </Link>
                    <a href={`mailto:${tenant.email}`} className="p-1.5 hover:bg-gray-100 rounded-lg">
                      <Mail className="w-4 h-4 text-gray-500" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTenants.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tenants found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or add a new tenant</p>
          <Link
            href="/property-management/tenants/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Tenant
          </Link>
        </div>
      )}
    </div>
  );
}
