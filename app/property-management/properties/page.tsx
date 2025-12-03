// CR REALTOR PLATFORM - PROPERTIES LIST PAGE
// Created: December 3, 2025

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Home,
  Store,
  Factory,
  Plus,
  Search,
  MoreVertical,
  MapPin,
  DollarSign,
  Wrench,
  Eye,
  Edit,
  Trash2,
  Grid,
  List,
  Download
} from 'lucide-react';

// Mock data - will be replaced with real API calls
const mockProperties = [
  {
    id: '1',
    name: 'Sunset Apartments',
    address: '123 Sunset Blvd',
    city: 'Fort Myers',
    state: 'FL',
    zip: '33901',
    category: 'residential',
    type: 'apartment',
    total_units: 24,
    occupied_units: 22,
    market_rent: 1850,
    total_monthly_income: 40700,
    maintenance_open: 3,
    image: null,
  },
  {
    id: '2',
    name: 'Palm Plaza Shopping Center',
    address: '456 Palm Ave',
    city: 'Cape Coral',
    state: 'FL',
    zip: '33990',
    category: 'commercial',
    type: 'retail',
    total_units: 12,
    occupied_units: 10,
    market_rent: 3500,
    total_monthly_income: 35000,
    maintenance_open: 1,
    image: null,
  },
  {
    id: '3',
    name: 'Industrial Park West',
    address: '789 Industrial Way',
    city: 'Lehigh Acres',
    state: 'FL',
    zip: '33936',
    category: 'industrial',
    type: 'warehouse',
    total_units: 8,
    occupied_units: 8,
    market_rent: 5000,
    total_monthly_income: 40000,
    maintenance_open: 0,
    image: null,
  },
  {
    id: '4',
    name: 'Oakwood Townhomes',
    address: '321 Oak Street',
    city: 'Fort Myers',
    state: 'FL',
    zip: '33901',
    category: 'residential',
    type: 'townhouse',
    total_units: 16,
    occupied_units: 14,
    market_rent: 2200,
    total_monthly_income: 30800,
    maintenance_open: 2,
    image: null,
  },
  {
    id: '5',
    name: 'Downtown Office Complex',
    address: '100 Main Street',
    city: 'Fort Myers',
    state: 'FL',
    zip: '33901',
    category: 'commercial',
    type: 'office',
    total_units: 20,
    occupied_units: 18,
    market_rent: 2800,
    total_monthly_income: 50400,
    maintenance_open: 1,
    image: null,
  },
];

const categoryIcons: Record<string, React.ComponentType<{className?: string}>> = {
  residential: Home,
  commercial: Store,
  industrial: Factory,
};

const categoryColors: Record<string, string> = {
  residential: 'bg-green-100 text-green-700',
  commercial: 'bg-blue-100 text-blue-700',
  industrial: 'bg-orange-100 text-orange-700',
};

function PropertyCard({ property }: { property: typeof mockProperties[0] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const CategoryIcon = categoryIcons[property.category] || Building2;
  const occupancyRate = Math.round((property.occupied_units / property.total_units) * 100);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <CategoryIcon className="w-16 h-16 text-gray-300" />
        </div>
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${categoryColors[property.category] || 'bg-gray-100 text-gray-700'}`}>
          {property.category.charAt(0).toUpperCase() + property.category.slice(1)}
        </div>
        <div className="absolute top-3 right-3">
          <div className="relative">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 bg-white/90 hover:bg-white rounded-lg shadow-sm"
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <Link href={`/property-management/properties/${property.id}`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Eye className="w-4 h-4" /> View Details
                  </Link>
                  <Link href={`/property-management/properties/${property.id}/edit`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Edit className="w-4 h-4" /> Edit Property
                  </Link>
                  <Link href={`/property-management/properties/${property.id}/units`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Home className="w-4 h-4" /> Manage Units
                  </Link>
                  <hr className="my-1" />
                  <button className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{property.name}</h3>
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
          <MapPin className="w-4 h-4" />
          {property.address}, {property.city}, {property.state}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500">Occupancy</p>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{property.occupied_units}/{property.total_units}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                occupancyRate >= 90 ? 'bg-green-100 text-green-700' :
                occupancyRate >= 70 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>{occupancyRate}%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500">Monthly Income</p>
            <p className="font-semibold text-green-600">${property.total_monthly_income.toLocaleString()}</p>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
          <div className={`h-1.5 rounded-full ${
            occupancyRate >= 90 ? 'bg-green-500' : occupancyRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
          }`} style={{ width: `${occupancyRate}%` }} />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-gray-500">
              <DollarSign className="w-4 h-4" />${property.market_rent.toLocaleString()}/mo avg
            </span>
          </div>
          {property.maintenance_open > 0 && (
            <span className="flex items-center gap-1 text-sm text-orange-600">
              <Wrench className="w-4 h-4" />{property.maintenance_open}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function PropertyRow({ property }: { property: typeof mockProperties[0] }) {
  const CategoryIcon = categoryIcons[property.category] || Building2;
  const occupancyRate = Math.round((property.occupied_units / property.total_units) * 100);

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${categoryColors[property.category] || 'bg-gray-100 text-gray-700'}`}>
            <CategoryIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{property.name}</p>
            <p className="text-sm text-gray-500">{property.type}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-sm text-gray-600">{property.address}, {property.city}</td>
      <td className="px-4 py-4">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryColors[property.category] || 'bg-gray-100 text-gray-700'}`}>
          {property.category}
        </span>
      </td>
      <td className="px-4 py-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-900">{property.occupied_units}/{property.total_units}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded ${
            occupancyRate >= 90 ? 'bg-green-100 text-green-700' :
            occupancyRate >= 70 ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>{occupancyRate}%</span>
        </div>
      </td>
      <td className="px-4 py-4 text-sm font-medium text-green-600">${property.total_monthly_income.toLocaleString()}</td>
      <td className="px-4 py-4 text-sm">
        {property.maintenance_open > 0 ? (
          <span className="flex items-center gap-1 text-orange-600"><Wrench className="w-4 h-4" />{property.maintenance_open}</span>
        ) : <span className="text-gray-400">-</span>}
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <Link href={`/property-management/properties/${property.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <Eye className="w-4 h-4 text-gray-500" />
          </Link>
          <Link href={`/property-management/properties/${property.id}/edit`} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <Edit className="w-4 h-4 text-gray-500" />
          </Link>
        </div>
      </td>
    </tr>
  );
}

export default function PropertiesPage() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Read URL params on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      if (cat) setCategoryFilter(cat);
    }
  }, []);

  const filteredProperties = mockProperties.filter(p => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totals = filteredProperties.reduce((acc, p) => ({
    properties: acc.properties + 1,
    units: acc.units + p.total_units,
    occupied: acc.occupied + p.occupied_units,
    income: acc.income + p.total_monthly_income,
  }), { properties: 0, units: 0, occupied: 0, income: 0 });

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-500">Manage your rental properties across all categories</p>
        </div>
        <Link href="/property-management/properties/new" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Plus className="w-4 h-4" /> Add Property
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Properties</p>
          <p className="text-2xl font-bold text-gray-900">{totals.properties}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Units</p>
          <p className="text-2xl font-bold text-gray-900">{totals.units}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Occupancy</p>
          <p className="text-2xl font-bold text-gray-900">{totals.units > 0 ? Math.round((totals.occupied / totals.units) * 100) : 0}%</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Monthly Income</p>
          <p className="text-2xl font-bold text-green-600">${totals.income.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search properties..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setCategoryFilter('all')} className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${categoryFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>All</button>
          <button onClick={() => setCategoryFilter('residential')} className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${categoryFilter === 'residential' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>Residential</button>
          <button onClick={() => setCategoryFilter('commercial')} className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${categoryFilter === 'commercial' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}>Commercial</button>
          <button onClick={() => setCategoryFilter('industrial')} className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${categoryFilter === 'industrial' ? 'bg-orange-600 text-white' : 'bg-orange-50 text-orange-700 hover:bg-orange-100'}`}>Industrial</button>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}>
            <Grid className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}>
            <List className="w-4 h-4" />
          </button>
        </div>

        <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => <PropertyCard key={property.id} property={property} />)}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Property</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Address</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Occupancy</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Income</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Maintenance</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProperties.map((property) => <PropertyRow key={property.id} property={property} />)}
            </tbody>
          </table>
        </div>
      )}

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-500 mb-4">{searchQuery ? 'Try adjusting your search terms' : 'Get started by adding your first property'}</p>
          <Link href="/property-management/properties/new" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Add Property
          </Link>
        </div>
      )}
    </div>
  );
}
