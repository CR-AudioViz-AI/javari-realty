// CR PROPERTY MANAGEMENT - TENANT PORTAL
// Created: December 3, 2025
// Design: Modern, Mobile-first, User-friendly

import { Metadata } from 'next';
import Link from 'next/link';
import {
  Home,
  DollarSign,
  Wrench,
  FileText,
  MessageSquare,
  Calendar,
  Bell,
  CreditCard,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Phone,
  Mail,
  User,
  Building2,
  Camera,
  Download,
  Shield,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tenant Portal | CR Property Management',
  description: 'Pay rent, submit maintenance requests, and manage your lease online',
};

// Feature Card
function FeatureCard({
  title,
  description,
  icon: Icon,
  href,
  variant = 'default',
  badge,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  variant?: 'default' | 'primary' | 'gradient';
  badge?: string;
}) {
  const styles = {
    default: {
      container: 'bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg',
      icon: 'bg-gray-50 text-gray-600',
      title: 'text-gray-900',
      description: 'text-gray-500',
    },
    primary: {
      container: 'bg-blue-600 hover:bg-blue-700',
      icon: 'bg-blue-500 text-white',
      title: 'text-white',
      description: 'text-blue-100',
    },
    gradient: {
      container: 'bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700',
      icon: 'bg-white/20 text-white',
      title: 'text-white',
      description: 'text-emerald-100',
    },
  };

  const s = styles[variant];

  return (
    <Link
      href={href}
      className={`group relative block p-6 rounded-2xl transition-all duration-300 ${s.container}`}
    >
      {badge && (
        <span className="absolute top-4 right-4 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
          {badge}
        </span>
      )}
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 ${s.icon}`}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className={`text-lg font-semibold mb-2 ${s.title}`}>{title}</h3>
      <p className={`text-sm ${s.description}`}>{description}</p>
      <div className={`flex items-center gap-1 mt-4 text-sm font-medium ${variant === 'default' ? 'text-blue-600' : 'text-white/90'}`}>
        <span>Access</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

// Payment Status Card
function PaymentStatusCard({
  amount,
  dueDate,
  status,
  daysUntilDue,
}: {
  amount: number;
  dueDate: string;
  status: 'upcoming' | 'due_soon' | 'overdue' | 'paid';
  daysUntilDue: number;
}) {
  const statusConfig = {
    upcoming: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      badge: 'bg-gray-100 text-gray-600',
      badgeText: `Due in ${daysUntilDue} days`,
    },
    due_soon: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      badge: 'bg-amber-100 text-amber-700',
      badgeText: `Due in ${daysUntilDue} days`,
    },
    overdue: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      badge: 'bg-red-100 text-red-700',
      badgeText: `${Math.abs(daysUntilDue)} days overdue`,
    },
    paid: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      badge: 'bg-emerald-100 text-emerald-700',
      badgeText: 'Paid',
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`rounded-2xl border-2 ${config.border} ${config.bg} p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Rent Payment</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.badge}`}>
          {config.badgeText}
        </span>
      </div>
      
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-1">Amount Due</p>
        <p className="text-4xl font-bold text-gray-900">${amount.toLocaleString()}</p>
        <p className="text-sm text-gray-500 mt-1">Due {dueDate}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/tenant-portal/pay-rent"
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
            status === 'paid' 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          {status === 'paid' ? 'Paid' : 'Pay Now'}
        </Link>
        <Link
          href="/tenant-portal/payments/autopay"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
        >
          <Clock className="w-5 h-5" />
          Set Up AutoPay
        </Link>
      </div>
    </div>
  );
}

// Maintenance Item
function MaintenanceItem({
  title,
  status,
  date,
  id,
}: {
  title: string;
  status: 'submitted' | 'scheduled' | 'in_progress' | 'completed';
  date: string;
  id: string;
}) {
  const statusConfig = {
    submitted: { color: 'bg-blue-100 text-blue-700', icon: Clock },
    scheduled: { color: 'bg-purple-100 text-purple-700', icon: Calendar },
    in_progress: { color: 'bg-amber-100 text-amber-700', icon: Wrench },
    completed: { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Link
      href={`/tenant-portal/maintenance/${id}`}
      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
    >
      <div className={`p-2.5 rounded-xl ${config.color}`}>
        <StatusIcon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{title}</p>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </Link>
  );
}

export default function TenantPortalPage() {
  // TODO: Replace with real tenant data from API
  const tenant = {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    unitNumber: '204',
    propertyName: 'Sunset Apartments',
    address: '123 Sunset Blvd, Fort Myers, FL 33901',
    moveInDate: '2024-03-15',
    leaseEnd: '2025-03-14',
    monthlyRent: 1850,
    balance: 0,
  };

  const rentInfo = {
    amount: tenant.monthlyRent,
    dueDate: 'January 1, 2025',
    status: 'due_soon' as const,
    daysUntilDue: 5,
  };

  const maintenanceRequests = [
    { id: 'MR-001', title: 'Leaky faucet in bathroom', status: 'scheduled' as const, date: 'Scheduled for Dec 28' },
    { id: 'MR-002', title: 'HVAC filter replacement', status: 'completed' as const, date: 'Completed Dec 15' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/tenant-portal" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-gray-900 block">Tenant Portal</span>
                <span className="text-xs text-gray-500">CR Property Management</span>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <button className="p-2.5 hover:bg-gray-100 rounded-xl relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-xl">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {tenant.firstName}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Hero */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 mb-8">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="tenant-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#tenant-grid)" />
            </svg>
          </div>
          
          {/* Gradient Orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />

          <div className="relative">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-blue-400 text-sm font-medium mb-2">Welcome back</p>
                <h1 className="text-3xl font-bold text-white mb-2">{tenant.firstName} {tenant.lastName}</h1>
                <div className="flex items-center gap-2 text-slate-400">
                  <Building2 className="w-4 h-4" />
                  <span>Unit {tenant.unitNumber} • {tenant.propertyName}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Lease Status</p>
                  <p className="font-semibold text-white">Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="mb-8">
          <PaymentStatusCard
            amount={rentInfo.amount}
            dueDate={rentInfo.dueDate}
            status={rentInfo.status}
            daysUntilDue={rentInfo.daysUntilDue}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <FeatureCard
            title="Pay Rent"
            description="Make a secure payment online"
            icon={DollarSign}
            href="/tenant-portal/pay-rent"
            variant="gradient"
          />
          <FeatureCard
            title="Maintenance"
            description="Submit or track requests"
            icon={Wrench}
            href="/tenant-portal/maintenance"
            badge="2 Active"
          />
          <FeatureCard
            title="My Lease"
            description="View documents & terms"
            icon={FileText}
            href="/tenant-portal/lease"
          />
          <FeatureCard
            title="Contact Us"
            description="Message your manager"
            icon={MessageSquare}
            href="/tenant-portal/messages"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Maintenance Requests */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Maintenance Requests</h2>
              <Link href="/tenant-portal/maintenance" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {maintenanceRequests.map((request) => (
                <MaintenanceItem
                  key={request.id}
                  id={request.id}
                  title={request.title}
                  status={request.status}
                  date={request.date}
                />
              ))}
              <Link
                href="/tenant-portal/maintenance/new"
                className="flex items-center justify-center gap-2 p-4 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 transition-colors"
              >
                <Wrench className="w-5 h-5" />
                Submit New Request
              </Link>
            </div>
          </div>

          {/* Lease Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Lease Information</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-50">
                  <span className="text-gray-500">Property</span>
                  <span className="font-medium text-gray-900">{tenant.propertyName}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-50">
                  <span className="text-gray-500">Unit</span>
                  <span className="font-medium text-gray-900">{tenant.unitNumber}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-50">
                  <span className="text-gray-500">Move-in Date</span>
                  <span className="font-medium text-gray-900">
                    {new Date(tenant.moveInDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-50">
                  <span className="text-gray-500">Lease Expires</span>
                  <span className="font-medium text-gray-900">
                    {new Date(tenant.leaseEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-500">Monthly Rent</span>
                  <span className="font-semibold text-gray-900">${tenant.monthlyRent.toLocaleString()}</span>
                </div>
              </div>
              <Link
                href="/tenant-portal/lease"
                className="flex items-center justify-center gap-2 mt-6 py-3 bg-gray-50 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors"
              >
                <FileText className="w-5 h-5" />
                View Full Lease
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Contact Property Management</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="tel:+1234567890"
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="p-3 bg-blue-100 rounded-xl">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-semibold text-gray-900">(123) 456-7890</p>
              </div>
            </a>
            <a
              href="mailto:support@crproperty.com"
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Mail className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-gray-900">support@crproperty.com</p>
              </div>
            </a>
            <Link
              href="/tenant-portal/messages"
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="p-3 bg-purple-100 rounded-xl">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Message Portal</p>
                <p className="font-semibold text-gray-900">Send Message</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="mt-6 bg-gradient-to-r from-red-50 to-red-50/50 border border-red-200 rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-red-100 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900">Emergency Maintenance</h3>
              <p className="text-sm text-red-700 mt-1">
                For after-hours emergencies (fire, flood, no heat/AC, security issues), 
                call our 24/7 emergency line: <strong>(123) 456-7899</strong>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
