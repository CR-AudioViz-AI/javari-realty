// CR PROPERTY MANAGEMENT - MAIN DASHBOARD
// Created: December 3, 2025
// Design: Premium, beats AppFolio/Buildium

import { Metadata } from 'next';
import Link from 'next/link';
import {
  Building2,
  Home,
  Users,
  FileText,
  Wrench,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Plus,
  Bell,
  Search,
  Sparkles,
  Factory,
  Store,
  BarChart3,
  Zap,
  Target,
  PiggyBank
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard | CR Property Management',
  description: 'AI-powered property management platform',
};

// Premium Gradient Card
function GradientStatCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon: Icon,
  gradient,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${gradient} p-6 text-white`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
            <Icon className="w-5 h-5" />
          </div>
          {trend && trendValue && (
            <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
              trend === 'up' ? 'bg-white/20' : 'bg-white/20'
            }`}>
              {trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {trendValue}
            </div>
          )}
        </div>
        <p className="text-3xl font-bold tracking-tight mb-1">{value}</p>
        <p className="text-sm opacity-90">{title}</p>
        {subtitle && <p className="text-xs opacity-75 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

// Quick Stat Card
function QuickStat({
  label,
  value,
  icon: Icon,
  color,
  href,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
      <div className={`p-2.5 rounded-xl ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

// Activity Item
function ActivityItem({
  icon: Icon,
  iconColor,
  title,
  description,
  time,
}: {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-4 py-4">
      <div className={`p-2 rounded-lg ${iconColor}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <span className="text-xs text-gray-400 whitespace-nowrap">{time}</span>
    </div>
  );
}

// Property Type Card
function PropertyTypeCard({
  type,
  icon: Icon,
  properties,
  units,
  occupancy,
  revenue,
  color,
}: {
  type: string;
  icon: React.ComponentType<{ className?: string }>;
  properties: number;
  units: number;
  occupancy: number;
  revenue: number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2.5 rounded-xl ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{type}</h3>
          <p className="text-xs text-gray-500">{properties} properties • {units} units</p>
        </div>
      </div>
      
      {/* Occupancy Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-gray-500">Occupancy</span>
          <span className={`font-semibold ${
            occupancy >= 90 ? 'text-emerald-600' : 
            occupancy >= 70 ? 'text-amber-600' : 
            'text-red-600'
          }`}>{occupancy}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              occupancy >= 90 ? 'bg-emerald-500' : 
              occupancy >= 70 ? 'bg-amber-500' : 
              'bg-red-500'
            }`}
            style={{ width: `${occupancy}%` }}
          />
        </div>
      </div>
      
      {/* Revenue */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <span className="text-sm text-gray-500">Monthly Revenue</span>
        <span className="font-semibold text-gray-900">${revenue.toLocaleString()}</span>
      </div>
    </div>
  );
}

// Alert Item
function AlertItem({
  type,
  title,
  description,
  time,
  href,
}: {
  type: 'emergency' | 'warning' | 'info';
  title: string;
  description: string;
  time: string;
  href?: string;
}) {
  const styles = {
    emergency: {
      bg: 'bg-red-50 border-l-red-500',
      dot: 'bg-red-500 animate-pulse',
    },
    warning: {
      bg: 'bg-amber-50 border-l-amber-500',
      dot: 'bg-amber-500',
    },
    info: {
      bg: 'bg-blue-50 border-l-blue-500',
      dot: 'bg-blue-500',
    },
  };

  const s = styles[type];

  const content = (
    <div className={`border-l-4 rounded-r-xl p-4 ${s.bg}`}>
      <div className="flex items-start gap-3">
        <div className={`w-2 h-2 rounded-full mt-2 ${s.dot}`} />
        <div className="flex-1">
          <p className="font-semibold text-gray-900">{title}</p>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          <p className="text-xs text-gray-400 mt-2">{time}</p>
        </div>
        {href && <ChevronRight className="w-5 h-5 text-gray-400" />}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="block">{content}</Link>;
  }
  return content;
}

export default function PropertyManagementDashboard() {
  // TODO: Replace with real data from API
  const stats = {
    totalProperties: 48,
    totalUnits: 312,
    occupiedUnits: 294,
    occupancyRate: 94,
    activeLeases: 294,
    expiringLeases: 18,
    rentCollectedMTD: 524800,
    rentOutstanding: 28400,
    openMaintenance: 24,
    emergencyMaintenance: 2,
    activeTenants: 294,
    newApplicants: 12,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="hero-grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#hero-grid)" />
          </svg>
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  All Systems Online
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Enabled
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Property Management Dashboard
              </h1>
              <p className="text-slate-400">
                Welcome back! Here's your portfolio overview for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                href="/property-management/properties/new"
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-900 rounded-xl font-medium hover:bg-gray-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Property
              </Link>
              <button className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors relative">
                <Bell className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <GradientStatCard
              title="Total Revenue (MTD)"
              value={`$${(stats.rentCollectedMTD / 1000).toFixed(0)}K`}
              subtitle={`$${(stats.rentOutstanding / 1000).toFixed(1)}K outstanding`}
              trend="up"
              trendValue="+8.2%"
              icon={DollarSign}
              gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
            />
            <GradientStatCard
              title="Occupancy Rate"
              value={`${stats.occupancyRate}%`}
              subtitle={`${stats.occupiedUnits}/${stats.totalUnits} units`}
              trend="up"
              trendValue="+2.1%"
              icon={Target}
              gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
            />
            <GradientStatCard
              title="Properties"
              value={stats.totalProperties}
              subtitle={`${stats.totalUnits} total units`}
              icon={Building2}
              gradient="bg-gradient-to-br from-violet-500 to-purple-600"
            />
            <GradientStatCard
              title="Active Leases"
              value={stats.activeLeases}
              subtitle={`${stats.expiringLeases} expiring soon`}
              icon={FileText}
              gradient="bg-gradient-to-br from-orange-500 to-amber-600"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Secondary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <QuickStat
            label="Active Tenants"
            value={stats.activeTenants}
            icon={Users}
            color="bg-blue-50 text-blue-600"
            href="/property-management/tenants"
          />
          <QuickStat
            label="Open Maintenance"
            value={stats.openMaintenance}
            icon={Wrench}
            color="bg-amber-50 text-amber-600"
            href="/property-management/maintenance"
          />
          <QuickStat
            label="Expiring Leases"
            value={stats.expiringLeases}
            icon={Calendar}
            color="bg-purple-50 text-purple-600"
            href="/property-management/leases?filter=expiring"
          />
          <QuickStat
            label="New Applicants"
            value={stats.newApplicants}
            icon={Users}
            color="bg-emerald-50 text-emerald-600"
            href="/property-management/applications"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: 'Add Property', icon: Building2, href: '/property-management/properties/new', color: 'bg-blue-500 hover:bg-blue-600' },
                  { title: 'Add Tenant', icon: Users, href: '/property-management/tenants/new', color: 'bg-emerald-500 hover:bg-emerald-600' },
                  { title: 'Create Lease', icon: FileText, href: '/property-management/leases/new', color: 'bg-purple-500 hover:bg-purple-600' },
                  { title: 'Record Payment', icon: DollarSign, href: '/property-management/payments/record', color: 'bg-amber-500 hover:bg-amber-600' },
                ].map((action) => (
                  <Link
                    key={action.title}
                    href={action.href}
                    className={`${action.color} text-white rounded-xl p-4 transition-colors group`}
                  >
                    <action.icon className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="font-medium text-sm">{action.title}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Urgent Alerts */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Urgent Alerts</h2>
                <Link href="/property-management/alerts" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                <AlertItem
                  type="emergency"
                  title="Emergency: Water Leak - Unit 204 Sunset Apartments"
                  description="Tenant reported major water leak in bathroom. Plumber dispatched."
                  time="15 minutes ago"
                  href="/property-management/maintenance/MR-2024-00847"
                />
                <AlertItem
                  type="warning"
                  title="Late Payments: 5 Tenants Past Grace Period"
                  description="Late fees have been applied. Collection process initiated."
                  time="2 hours ago"
                  href="/property-management/payments?filter=late"
                />
                <AlertItem
                  type="info"
                  title="Lease Renewals: 8 Leases Expiring in 30 Days"
                  description="Renewal offers ready to send. AI-optimized rent recommendations available."
                  time="Today"
                  href="/property-management/leases?filter=expiring"
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-gray-50">
                <h2 className="font-semibold text-gray-900">Recent Activity</h2>
                <Link href="/property-management/activity" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="divide-y divide-gray-50 px-5">
                <ActivityItem
                  icon={CheckCircle}
                  iconColor="bg-emerald-50 text-emerald-600"
                  title="Payment Received"
                  description="Unit 305 Sunset Apartments - $1,850"
                  time="10 min ago"
                />
                <ActivityItem
                  icon={Wrench}
                  iconColor="bg-blue-50 text-blue-600"
                  title="Maintenance Completed"
                  description="HVAC repair - Unit 112 Oak Townhomes"
                  time="1 hour ago"
                />
                <ActivityItem
                  icon={FileText}
                  iconColor="bg-purple-50 text-purple-600"
                  title="Lease Signed"
                  description="Sarah Johnson - Unit 418 Palm Plaza"
                  time="3 hours ago"
                />
                <ActivityItem
                  icon={Users}
                  iconColor="bg-amber-50 text-amber-600"
                  title="New Application"
                  description="Michael Chen - Unit 201 Sunset Apartments"
                  time="5 hours ago"
                />
                <ActivityItem
                  icon={Calendar}
                  iconColor="bg-indigo-50 text-indigo-600"
                  title="Inspection Scheduled"
                  description="Move-out inspection - Unit 108 tomorrow 10 AM"
                  time="Yesterday"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Portfolio by Type */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Portfolio by Type</h2>
              <div className="space-y-4">
                <PropertyTypeCard
                  type="Residential"
                  icon={Home}
                  properties={32}
                  units={198}
                  occupancy={96}
                  revenue={356400}
                  color="bg-emerald-50 text-emerald-600"
                />
                <PropertyTypeCard
                  type="Commercial"
                  icon={Store}
                  properties={12}
                  units={86}
                  occupancy={91}
                  revenue={142000}
                  color="bg-blue-50 text-blue-600"
                />
                <PropertyTypeCard
                  type="Industrial"
                  icon={Factory}
                  properties={4}
                  units={28}
                  occupancy={89}
                  revenue={26400}
                  color="bg-orange-50 text-orange-600"
                />
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-semibold">AI Insights</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="font-medium">Rent Optimization</p>
                  <p className="text-white/80 mt-1">12 units are below market rate. Potential additional revenue: $3,400/mo</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="font-medium">Tenant Risk Alert</p>
                  <p className="text-white/80 mt-1">2 tenants showing payment pattern changes. Review recommended.</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="font-medium">Maintenance Prediction</p>
                  <p className="text-white/80 mt-1">HVAC system at 145 Oak St due for service in ~30 days.</p>
                </div>
              </div>
              <Link
                href="/property-management/ai-insights"
                className="flex items-center justify-center gap-2 mt-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                View All Insights
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Upcoming */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Upcoming This Week</h3>
              <div className="space-y-3">
                {[
                  { title: 'Move-in: Unit 302', time: 'Tomorrow, 10 AM', icon: Users },
                  { title: 'Inspection: 445 Oak St', time: 'Wed, 2 PM', icon: CheckCircle },
                  { title: 'Lease Signing', time: 'Thu, 11 AM', icon: FileText },
                  { title: 'Vendor Meeting', time: 'Fri, 9 AM', icon: Wrench },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2">
                    <div className="p-1.5 bg-gray-50 rounded-lg">
                      <item.icon className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/property-management/calendar"
                className="flex items-center justify-center gap-1 mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View Calendar
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
