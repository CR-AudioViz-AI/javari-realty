// CR REALTOR PLATFORM - UNITS LIST PAGE
// Created: December 3, 2025

'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Home,
  Plus,
  Search,
  Building2,
  Users,
  DollarSign,
  Calendar,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Grid,
  List
} from 'lucide-react';

const mockUnits = [
  { id: '1', number: '101', property: 'Sunset Apartments', propertyId: '1', beds: 1, baths: 1, sqft: 650, rent: 1450, status: 'occupied', tenant: 'Anna Lee', leaseEnd: '2025-08-31' },
  { id: '2', number: '102', property: 'Sunset Apartments', propertyId: '1', beds: 1, baths: 1, sqft: 650, rent: 1450, status: 'occupied', tenant: 'Mark Chen', leaseEnd: '2025-06-15' },
  { id: '3', number: '201', property: 'Sunset Apartments', propertyId: '1', beds: 2, baths: 1, sqft: 850, rent: 1750, status: 'available', tenant: null, leaseEnd: null, availableDate: '2025-01-15' },
  { id: '4', number: '202', property: 'Sunset Apartments', propertyId: '1', beds: 2, baths: 1, sqft: 850, rent: 1750, status: 'occupied', tenant: 'Lisa Park', leaseEnd: '2025-09-30' },
  { id: '5', number: '204', property: 'Sunset Apartments', propertyId: '1', beds: 2, baths: 2, sqft: 950, rent: 1850, status: 'occupied', tenant: 'John Smith', leaseEnd: '2025-03-14' },
  { id: '6', number: '301', property: 'Sunset Apartments', propertyId: '1', beds: 2, baths: 2, sqft: 1000, rent: 1950, status: 'occupied', tenant: 'Sarah Johnson', leaseEnd: '2025-06-30' },
  { id: '7', number: 'A', property: 'Oakwood Townhomes', propertyId: '2', beds: 3, baths: 2.5, sqft: 1800, rent: 2200, status: 'occupied', tenant: 'Michael Brown', leaseEnd: '2025-01-31' },
  { id: '8', number: 'B', property: 'Oakwood Townhomes', propertyId: '2', beds: 3, baths: 2.5, sqft: 1800, rent: 2200, status: 'available', tenant: null, leaseEnd: null, availableDate: '2025-02-01' },
  { id: '9', number: '1', property: 'Riverside Duplexes', propertyId: '3', beds: 2, baths: 1, sqft: 1100, rent: 1650, status: 'occupied', tenant: 'Robert Wilson', leaseEnd: '2025-02-28' },
  { id: '10', number: '2', property: 'Riverside Duplexes', propertyId: '3', beds: 2, baths: 1, sqft: 1100, rent: 1650, status: 'occupied', tenant: 'Emma Thompson', leaseEnd: '2025-07-31' },
];

export default function UnitsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const properties = [...new Set(mockUnits.map(u => u.property))];

  const filteredUnits = mockUnits.filter(u => {
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    if (propertyFilter !== 'all' && u.property !== propertyFilter) return false;
    if (searchQuery && !u.number.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !u.property.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const occupiedCount = mockUnits.filter(u => u.status === 'occupied').length;
  const availableCount = mockUnits.filter(u => u.status === 'available').length;
  const totalRent = mockUnits.filter(u => u.status === 'occupied').reduce((sum, u) => sum + u.rent, 0);

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Units</h1>
          <p className="text-gray-500">Manage all rental units across properties</p>
        </div>
        <Link
          href="/property-management/units/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Unit
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Units</p>
          <p className="text-2xl font-bold text-gray-900">{mockUnits.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Occupied</p>
          <p className="text-2xl font-bold text-green-600">{occupiedCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Available</p>
          <p className="text-2xl font-bold text-blue-600">{availableCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Monthly Income</p>
          <p className="text-2xl font-bold text-gray-900">${totalRent.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search units..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={propertyFilter}
          onChange={(e) => setPropertyFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Properties</option>
          {properties.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="occupied">Occupied</option>
          <option value="available">Available</option>
        </select>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUnits.map((unit) => (
            <div key={unit.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Home className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Unit {unit.number}</p>
                    <p className="text-xs text-gray-500">{unit.property}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  unit.status === 'occupied' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {unit.status}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{unit.beds} bed / {unit.baths} bath</span>
                  <span className="text-gray-700">{unit.sqft} sqft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Rent</span>
                  <span className="font-semibold text-gray-900">${unit.rent.toLocaleString()}/mo</span>
                </div>
                {unit.tenant && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tenant</span>
                    <span className="text-gray-700">{unit.tenant}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                <Link href={`/property-management/units/${unit.id}`} className="flex-1 py-1.5 text-center text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
                  View
                </Link>
                <Link href={`/property-management/units/${unit.id}/edit`} className="flex-1 py-1.5 text-center text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Unit</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Property</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Details</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Rent</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tenant</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUnits.map((unit) => (
                <tr key={unit.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">Unit {unit.number}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{unit.property}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {unit.beds}bd / {unit.baths}ba • {unit.sqft} sqft
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900">${unit.rent.toLocaleString()}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                      unit.status === 'occupied' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {unit.status === 'occupied' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {unit.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {unit.tenant || <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/property-management/units/${unit.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </Link>
                      <Link href={`/property-management/units/${unit.id}/edit`} className="p-1.5 hover:bg-gray-100 rounded-lg">
                        <Edit className="w-4 h-4 text-gray-500" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
