// CR REALTOR PLATFORM - PROPERTY MANAGEMENT DASHBOARD
// Created: December 3, 2025
// Access: Standalone OR Realtor Addon

import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Building2, 
  Home, 
  Users, 
  FileText, 
  Wrench, 
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  Factory,
  Store
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Property Management | CR Realtor Platform',
  description: 'Manage residential, commercial, and industrial rental properties',
};

// Dashboard stat card component
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
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              changeType === 'positive' ? 'text-green-600' :
              changeType === 'negative' ? 'text-red-600' :
              'text-gray-500'
            }`}>
              {changeType === 'positive' && <ArrowUpRight className="w-4 h-4 mr-1" />}
              {changeType === 'negative' && <ArrowDownRight className="w-4 h-4 mr-1" />}
              {change}
            </div>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

// Quick action button
function QuickAction({ 
  title, 
  description, 
  icon: Icon, 
  href,
  color = 'blue'
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
    green: 'bg-green-50 text-green-600 group-hover:bg-green-100',
    purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100',
    orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-100',
  };

  return (
    <Link 
      href={href}
      className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all"
    >
      <div className={`p-3 rounded-lg transition-colors ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
          {title}
        </p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </Link>
  );
}

// Alert item for urgent matters
function AlertItem({
  title,
  description,
  type,
  time
}: {
  title: string;
  description: string;
  type: 'emergency' | 'warning' | 'info';
  time: string;
}) {
  const styles = {
    emergency: 'border-l-red-500 bg-red-50',
    warning: 'border-l-yellow-500 bg-yellow-50',
    info: 'border-l-blue-500 bg-blue-50',
  };

  const icons = {
    emergency: <AlertTriangle className="w-5 h-5 text-red-500" />,
    warning: <Clock className="w-5 h-5 text-yellow-500" />,
    info: <CheckCircle className="w-5 h-5 text-blue-500" />,
  };

  return (
    <div className={`border-l-4 rounded-r-lg p-4 ${styles[type]}`}>
      <div className="flex items-start gap-3">
        {icons[type]}
        <div className="flex-1">
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          <p className="text-xs text-gray-400 mt-2">{time}</p>
        </div>
      </div>
    </div>
  );
}

// Property category summary
function CategorySummary({
  category,
  icon: Icon,
  units,
  occupied,
  revenue
}: {
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  units: number;
  occupied: number;
  revenue: number;
}) {
  const occupancyRate = units > 0 ? Math.round((occupied / units) * 100) : 0;
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon className="w-5 h-5 text-gray-700" />
        </div>
        <h3 className="font-semibold text-gray-900">{category}</h3>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Total Units</span>
          <span className="font-medium">{units}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Occupied</span>
          <span className="font-medium">{occupied} ({occupancyRate}%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${occupancyRate}%` }}
          />
        </div>
        <div className="flex justify-between text-sm pt-2 border-t">
          <span className="text-gray-500">Monthly Revenue</span>
          <span className="font-semibold text-green-600">
            ${revenue.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function PropertyManagementDashboard() {
  // TODO: Fetch real data from API
  // These are placeholder values for UI demonstration
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Property Management
              </h1>
              <p className="text-gray-500 mt-1">
                Manage your rental properties, tenants, and maintenance
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/property-management/properties/new"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                + Add Property
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Properties"
            value={24}
            change="+2 this month"
            changeType="positive"
            icon={Building2}
            href="/property-management/properties"
          />
          <StatCard
            title="Total Units"
            value={156}
            change="94% occupied"
            changeType="positive"
            icon={Home}
            href="/property-management/units"
          />
          <StatCard
            title="Active Tenants"
            value={147}
            change="+5 new this month"
            changeType="positive"
            icon={Users}
            href="/property-management/tenants"
          />
          <StatCard
            title="Rent Collected (MTD)"
            value="$284,500"
            change="$12,400 outstanding"
            changeType="neutral"
            icon={DollarSign}
            href="/property-management/payments"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Leases"
            value={147}
            icon={FileText}
            href="/property-management/leases"
          />
          <StatCard
            title="Expiring in 60 Days"
            value={12}
            change="Action needed"
            changeType="negative"
            icon={Calendar}
            href="/property-management/leases?filter=expiring"
          />
          <StatCard
            title="Open Maintenance"
            value={18}
            change="3 emergency"
            changeType="negative"
            icon={Wrench}
            href="/property-management/maintenance"
          />
          <StatCard
            title="Avg Response Time"
            value="4.2 hrs"
            change="↓ 15% vs last month"
            changeType="positive"
            icon={Clock}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions & Alerts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <QuickAction
                  title="Add New Property"
                  description="List a new rental property"
                  icon={Building2}
                  href="/property-management/properties/new"
                  color="blue"
                />
                <QuickAction
                  title="Add Tenant"
                  description="Register a new tenant"
                  icon={Users}
                  href="/property-management/tenants/new"
                  color="green"
                />
                <QuickAction
                  title="Create Lease"
                  description="Draft a new lease agreement"
                  icon={FileText}
                  href="/property-management/leases/new"
                  color="purple"
                />
                <QuickAction
                  title="Record Payment"
                  description="Log rent payment received"
                  icon={DollarSign}
                  href="/property-management/payments/record"
                  color="orange"
                />
              </div>
            </div>

            {/* Urgent Alerts */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Urgent Alerts
                </h2>
                <Link 
                  href="/property-management/alerts"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                <AlertItem
                  title="Emergency: Water Leak - Unit 204"
                  description="Tenant reported major water leak in bathroom. Plumber dispatched."
                  type="emergency"
                  time="15 minutes ago"
                />
                <AlertItem
                  title="Late Payment: 3 Tenants Overdue"
                  description="Rent payments past grace period. Late fees applied."
                  type="warning"
                  time="2 hours ago"
                />
                <AlertItem
                  title="Lease Renewal: Unit 108"
                  description="Lease expires in 45 days. Renewal notice sent to tenant."
                  type="info"
                  time="Today at 9:00 AM"
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </h2>
                <Link 
                  href="/property-management/activity"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  View All
                </Link>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 divide-y">
                {[
                  { action: 'Payment received', detail: 'Unit 305 - $1,850', time: '10 min ago', icon: CheckCircle, color: 'text-green-500' },
                  { action: 'Maintenance completed', detail: 'HVAC repair - Unit 112', time: '1 hour ago', icon: Wrench, color: 'text-blue-500' },
                  { action: 'New lease signed', detail: 'Sarah Johnson - Unit 418', time: '3 hours ago', icon: FileText, color: 'text-purple-500' },
                  { action: 'Move-out inspection', detail: 'Scheduled for Unit 201', time: 'Yesterday', icon: Calendar, color: 'text-orange-500' },
                  { action: 'Tenant application', detail: 'Background check in progress', time: 'Yesterday', icon: Users, color: 'text-gray-500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.action}</p>
                      <p className="text-sm text-gray-500">{item.detail}</p>
                    </div>
                    <span className="text-xs text-gray-400">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Category Breakdown */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Portfolio by Category
            </h2>
            
            <CategorySummary
              category="Residential"
              icon={Home}
              units={98}
              occupied={94}
              revenue={178500}
            />
            
            <CategorySummary
              category="Commercial"
              icon={Store}
              units={42}
              occupied={38}
              revenue={89000}
            />
            
            <CategorySummary
              category="Industrial"
              icon={Factory}
              units={16}
              occupied={15}
              revenue={45000}
            />

            {/* Upcoming */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">
                Upcoming This Week
              </h3>
              <div className="space-y-3">
                {[
                  { title: 'Move-in: Unit 302', date: 'Tomorrow, 10 AM' },
                  { title: 'Inspection: 445 Oak St', date: 'Wed, 2 PM' },
                  { title: 'Lease Signing: Unit 118', date: 'Thu, 11 AM' },
                  { title: 'Vendor Meeting: HVAC', date: 'Fri, 9 AM' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{item.title}</span>
                    <span className="text-gray-400">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
