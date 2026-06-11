// CR PROPERTY MANAGEMENT - LANDLORD/OWNER PORTAL
// Created: December 3, 2025
// Full-featured owner dashboard with financial statements

import { Metadata } from 'next';
import Link from 'next/link';
import {
  Building2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Download,
  Calendar,
  ChevronRight,
  Wrench,
  Eye,
  BarChart3,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  User,
  Home,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Owner Portal | CR Property Management',
  description: 'View your property portfolio performance and financial statements',
};

// Stat Card
function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend === 'up' ? 'text-emerald-600' : 'text-red-500'
          }`}>
            {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {trendValue}
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}

// Property Row
function PropertyRow({
  name,
  address,
  units,
  occupancy,
  income,
  expenses,
}: {
  name: string;
  address: string;
  units: number;
  occupancy: number;
  income: number;
  expenses: number;
}) {
  const netIncome = income - expenses;
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{name}</p>
            <p className="text-sm text-gray-500">{address}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-gray-900">{units}</td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                occupancy >= 90 ? 'bg-emerald-500' :
                occupancy >= 70 ? 'bg-amber-500' :
                'bg-red-500'
              }`}
              style={{ width: `${occupancy}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">{occupancy}%</span>
        </div>
      </td>
      <td className="px-4 py-4 text-emerald-600 font-medium">${income.toLocaleString()}</td>
      <td className="px-4 py-4 text-red-500 font-medium">${expenses.toLocaleString()}</td>
      <td className={`px-4 py-4 font-semibold ${netIncome >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
        ${netIncome.toLocaleString()}
      </td>
      <td className="px-4 py-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Eye className="w-4 h-4 text-gray-500" />
        </button>
      </td>
    </tr>
  );
}

// Statement Row
function StatementRow({
  period,
  income,
  expenses,
  netIncome,
  status,
}: {
  period: string;
  income: number;
  expenses: number;
  netIncome: number;
  status: 'pending' | 'sent' | 'paid';
}) {
  const statusConfig = {
    pending: { color: 'bg-amber-100 text-amber-700', label: 'Pending' },
    sent: { color: 'bg-blue-100 text-blue-700', label: 'Sent' },
    paid: { color: 'bg-emerald-100 text-emerald-700', label: 'Paid' },
  };

  const config = statusConfig[status];

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-4 font-medium text-gray-900">{period}</td>
      <td className="px-4 py-4 text-emerald-600">${income.toLocaleString()}</td>
      <td className="px-4 py-4 text-red-500">${expenses.toLocaleString()}</td>
      <td className={`px-4 py-4 font-semibold ${netIncome >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
        ${netIncome.toLocaleString()}
      </td>
      <td className="px-4 py-4">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
          {config.label}
        </span>
      </td>
      <td className="px-4 py-4">
        <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
          <Download className="w-4 h-4" />
          PDF
        </button>
      </td>
    </tr>
  );
}

export default function LandlordPortalPage() {
  // TODO: Replace with real data from API
  const owner = {
    firstName: 'Robert',
    lastName: 'Williams',
    email: 'robert.williams@email.com',
    totalProperties: 4,
    totalUnits: 52,
    occupancyRate: 94,
  };

  const financials = {
    monthlyIncome: 86400,
    monthlyExpenses: 24200,
    netIncome: 62200,
    ytdIncome: 345600,
    ytdExpenses: 96800,
    ytdNet: 248800,
    pendingPayout: 58400,
    nextPayoutDate: 'December 15, 2025',
  };

  const properties = [
    { name: 'Sunset Apartments', address: '123 Sunset Blvd, Fort Myers', units: 24, occupancy: 96, income: 43200, expenses: 12100 },
    { name: 'Oak Street Townhomes', address: '456 Oak St, Cape Coral', units: 12, occupancy: 92, income: 21600, expenses: 6050 },
    { name: 'Palm Plaza', address: '789 Palm Dr, Fort Myers', units: 8, occupancy: 100, income: 14400, expenses: 4030 },
    { name: 'River View Condos', address: '321 River Rd, Fort Myers', units: 8, occupancy: 88, income: 7200, expenses: 2020 },
  ];

  const statements = [
    { period: 'November 2025', income: 86400, expenses: 24200, netIncome: 62200, status: 'paid' as const },
    { period: 'October 2025', income: 84800, expenses: 22800, netIncome: 62000, status: 'paid' as const },
    { period: 'September 2025', income: 85600, expenses: 25100, netIncome: 60500, status: 'paid' as const },
    { period: 'August 2025', income: 84000, expenses: 23400, netIncome: 60600, status: 'paid' as const },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-emerald-50/30">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/landlord" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-gray-900 block">Owner Portal</span>
                <span className="text-xs text-gray-500">CR Property Management</span>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <button className="p-2.5 hover:bg-gray-100 rounded-xl relative">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-xl">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {owner.firstName}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {owner.firstName}!</h1>
          <p className="text-gray-500 mt-1">Here's an overview of your property portfolio</p>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Monthly Income"
            value={`$${financials.monthlyIncome.toLocaleString()}`}
            trend="up"
            trendValue="+3.2%"
            icon={TrendingUp}
            color="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            title="Monthly Expenses"
            value={`$${financials.monthlyExpenses.toLocaleString()}`}
            trend="down"
            trendValue="-1.5%"
            icon={TrendingDown}
            color="bg-red-50 text-red-600"
          />
          <StatCard
            title="Net Income"
            value={`$${financials.netIncome.toLocaleString()}`}
            trend="up"
            trendValue="+4.8%"
            icon={DollarSign}
            color="bg-blue-50 text-blue-600"
          />
          <StatCard
            title="Pending Payout"
            value={`$${financials.pendingPayout.toLocaleString()}`}
            subtitle={`Next: ${financials.nextPayoutDate}`}
            icon={PiggyBank}
            color="bg-purple-50 text-purple-600"
          />
        </div>

        {/* YTD Summary */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 mb-8 text-white">
          <h2 className="text-lg font-semibold mb-6">Year-to-Date Summary</h2>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-emerald-100 text-sm mb-1">Total Income</p>
              <p className="text-3xl font-bold">${financials.ytdIncome.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-emerald-100 text-sm mb-1">Total Expenses</p>
              <p className="text-3xl font-bold">${financials.ytdExpenses.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-emerald-100 text-sm mb-1">Net Profit</p>
              <p className="text-3xl font-bold">${financials.ytdNet.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">Portfolio Occupancy</p>
                <p className="text-xl font-semibold">{owner.occupancyRate}% ({owner.totalUnits} units)</p>
              </div>
              <Link
                href="/landlord/reports"
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                View Reports
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Properties */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-gray-50">
                <h2 className="font-semibold text-gray-900">Your Properties</h2>
                <Link href="/landlord/properties" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Property</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Units</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Occupancy</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Income</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Expenses</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Net</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {properties.map((property) => (
                      <PropertyRow key={property.name} {...property} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900">Quick Links</h2>
            {[
              { title: 'Monthly Statements', description: 'View & download statements', icon: FileText, href: '/landlord/statements', color: 'bg-blue-50 text-blue-600' },
              { title: 'Tax Documents', description: '1099s and tax summaries', icon: FileText, href: '/landlord/tax-documents', color: 'bg-purple-50 text-purple-600' },
              { title: 'Maintenance Updates', description: '3 active work orders', icon: Wrench, href: '/landlord/maintenance', color: 'bg-amber-50 text-amber-600' },
              { title: 'Financial Reports', description: 'Detailed analytics', icon: BarChart3, href: '/landlord/reports', color: 'bg-emerald-50 text-emerald-600' },
            ].map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
              >
                <div className={`p-3 rounded-xl ${link.color}`}>
                  <link.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{link.title}</p>
                  <p className="text-sm text-gray-500">{link.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Statements */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">Recent Statements</h2>
            <Link href="/landlord/statements" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Period</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Income</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Expenses</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Net Income</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {statements.map((statement) => (
                  <StatementRow key={statement.period} {...statement} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
