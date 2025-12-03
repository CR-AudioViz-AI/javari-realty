// CR REALTOR PLATFORM - LANDLORD / OWNER PORTAL
// Created: December 3, 2025
// Access: Property Owners to view their portfolio managed by CR Property Management

import { Metadata } from 'next';
import Link from 'next/link';
import {
  Building2,
  DollarSign,
  FileText,
  TrendingUp,
  Home,
  Users,
  Wrench,
  Calendar,
  Download,
  ChevronRight,
  Bell,
  User,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  PiggyBank,
  Receipt,
  Clock
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Owner Portal | CR Realtor Platform',
  description: 'View your rental property portfolio, income statements, and reports',
};

// Stat card component
function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  href
}: {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
}) {
  const content = (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        {change && (
          <div className={`flex items-center text-sm ${
            changeType === 'positive' ? 'text-green-600' :
            changeType === 'negative' ? 'text-red-600' :
            'text-gray-500'
          }`}>
            {changeType === 'positive' && <ArrowUpRight className="w-4 h-4" />}
            {changeType === 'negative' && <ArrowDownRight className="w-4 h-4" />}
            {change}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

// Property summary row
function PropertyRow({
  property
}: {
  property: {
    id: string;
    name: string;
    address: string;
    units: number;
    occupied: number;
    monthlyIncome: number;
    maintenance: number;
  };
}) {
  const occupancyRate = Math.round((property.occupied / property.units) * 100);

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{property.name}</p>
            <p className="text-sm text-gray-500">{property.address}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-900">{property.occupied}/{property.units}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded ${
            occupancyRate >= 90 ? 'bg-green-100 text-green-700' :
            occupancyRate >= 70 ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {occupancyRate}%
          </span>
        </div>
      </td>
      <td className="px-4 py-4 font-medium text-green-600">
        ${property.monthlyIncome.toLocaleString()}
      </td>
      <td className="px-4 py-4">
        {property.maintenance > 0 ? (
          <span className="text-orange-600">{property.maintenance} open</span>
        ) : (
          <span className="text-gray-400">None</span>
        )}
      </td>
      <td className="px-4 py-4">
        <Link
          href={`/landlord/properties/${property.id}`}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          View Details
        </Link>
      </td>
    </tr>
  );
}

export default function LandlordPortalPage() {
  // TODO: Fetch real owner data from API
  // These are placeholder values for UI demonstration
  
  const owner = {
    name: 'Robert Johnson',
    email: 'robert.johnson@email.com',
    propertiesCount: 3,
    totalUnits: 48,
  };

  const financials = {
    totalIncome: 86400,
    totalExpenses: 24500,
    netIncome: 61900,
    pendingPayout: 15475,
    nextPayoutDate: 'January 15, 2025',
    ytdIncome: 986400,
    ytdExpenses: 287500,
    ytdNet: 698900,
  };

  const properties = [
    {
      id: '1',
      name: 'Sunset Apartments',
      address: '123 Sunset Blvd, Fort Myers, FL',
      units: 24,
      occupied: 22,
      monthlyIncome: 40700,
      maintenance: 3,
    },
    {
      id: '2',
      name: 'Oakwood Townhomes',
      address: '321 Oak Street, Fort Myers, FL',
      units: 16,
      occupied: 14,
      monthlyIncome: 30800,
      maintenance: 2,
    },
    {
      id: '3',
      name: 'Riverside Duplexes',
      address: '555 River Road, Cape Coral, FL',
      units: 8,
      occupied: 8,
      monthlyIncome: 14900,
      maintenance: 0,
    },
  ];

  const recentStatements = [
    { id: '1', month: 'December 2024', income: 86400, expenses: 24500, net: 61900 },
    { id: '2', month: 'November 2024', income: 86400, expenses: 21200, net: 65200 },
    { id: '3', month: 'October 2024', income: 84550, expenses: 28900, net: 55650 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">Owner Portal</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {owner.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">Welcome, {owner.name.split(' ')[0]}!</h1>
              <p className="text-blue-100">
                Managing {owner.propertiesCount} properties • {owner.totalUnits} total units
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/landlord/statements"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors border border-white/20"
              >
                <FileText className="w-4 h-4" />
                Statements
              </Link>
              <Link
                href="/landlord/reports"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                Reports
              </Link>
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Monthly Income"
            value={`$${financials.totalIncome.toLocaleString()}`}
            change="+2.3%"
            changeType="positive"
            icon={DollarSign}
          />
          <StatCard
            title="Monthly Expenses"
            value={`$${financials.totalExpenses.toLocaleString()}`}
            change="-5.1%"
            changeType="positive"
            icon={Receipt}
          />
          <StatCard
            title="Net Income"
            value={`$${financials.netIncome.toLocaleString()}`}
            change="+8.2%"
            changeType="positive"
            icon={TrendingUp}
          />
          <StatCard
            title="Pending Payout"
            value={`$${financials.pendingPayout.toLocaleString()}`}
            icon={PiggyBank}
          />
        </div>

        {/* Next Payout Banner */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-900">Next Owner Payout</p>
                <p className="text-sm text-green-700">{financials.nextPayoutDate}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-700">
                ${financials.pendingPayout.toLocaleString()}
              </p>
              <p className="text-sm text-green-600">Direct deposit</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* YTD Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Year-to-Date Summary</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-500">Total Income</span>
                  <span className="font-semibold text-gray-900">
                    ${financials.ytdIncome.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-500">Total Expenses</span>
                  <span className="font-semibold text-gray-900">
                    ${financials.ytdExpenses.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-400 h-2 rounded-full" 
                    style={{ width: `${(financials.ytdExpenses / financials.ytdIncome) * 100}%` }} 
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Net Income</span>
                  <span className="text-xl font-bold text-green-600">
                    ${financials.ytdNet.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Statements */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Recent Statements</h2>
              <Link 
                href="/landlord/statements" 
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Month</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Income</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Expenses</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Net</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentStatements.map((statement) => (
                    <tr key={statement.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{statement.month}</td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        ${statement.income.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        ${statement.expenses.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-green-600">
                        ${statement.net.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-blue-600 hover:text-blue-700">
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Properties Table */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Your Properties</h2>
            <Link 
              href="/landlord/properties" 
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Property</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Occupancy</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Monthly Income</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Maintenance</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {properties.map((property) => (
                  <PropertyRow key={property.id} property={property} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <Link
            href="/landlord/statements"
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Statements</p>
              <p className="text-sm text-gray-500">View all statements</p>
            </div>
          </Link>
          <Link
            href="/landlord/tax-documents"
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-2 bg-green-50 rounded-lg">
              <Receipt className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Tax Documents</p>
              <p className="text-sm text-gray-500">1099s & summaries</p>
            </div>
          </Link>
          <Link
            href="/landlord/maintenance"
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-2 bg-orange-50 rounded-lg">
              <Wrench className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Maintenance</p>
              <p className="text-sm text-gray-500">View all requests</p>
            </div>
          </Link>
          <Link
            href="/landlord/reports"
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-2 bg-purple-50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Reports</p>
              <p className="text-sm text-gray-500">Analytics & insights</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
