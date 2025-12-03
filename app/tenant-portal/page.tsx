// CR REALTOR PLATFORM - TENANT PORTAL
// Created: December 3, 2025
// Access: Tenants only (separate from buyer/customer portal)

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
  Building2
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tenant Portal | CR Realtor Platform',
  description: 'Manage your rental, pay rent, and submit maintenance requests',
};

// Quick action card
function QuickAction({
  title,
  description,
  icon: Icon,
  href,
  variant = 'default'
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  variant?: 'default' | 'primary' | 'success';
}) {
  const variants = {
    default: 'bg-white border-gray-200 hover:border-gray-300',
    primary: 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700',
    success: 'bg-green-600 border-green-600 text-white hover:bg-green-700',
  };

  const iconVariants = {
    default: 'bg-gray-100 text-gray-600',
    primary: 'bg-blue-500 text-white',
    success: 'bg-green-500 text-white',
  };

  return (
    <Link
      href={href}
      className={`block p-6 rounded-xl border transition-all ${variants[variant]}`}
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${iconVariants[variant]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className={`font-semibold mb-1 ${variant === 'default' ? 'text-gray-900' : ''}`}>
        {title}
      </h3>
      <p className={`text-sm ${variant === 'default' ? 'text-gray-500' : 'opacity-90'}`}>
        {description}
      </p>
    </Link>
  );
}

// Status badge
function StatusBadge({ status }: { status: 'paid' | 'due' | 'overdue' | 'pending' }) {
  const styles = {
    paid: 'bg-green-100 text-green-700',
    due: 'bg-yellow-100 text-yellow-700',
    overdue: 'bg-red-100 text-red-700',
    pending: 'bg-gray-100 text-gray-700',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function TenantPortalPage() {
  // TODO: Fetch real tenant data from API
  // These are placeholder values for UI demonstration
  
  const tenant = {
    name: 'John Smith',
    email: 'john.smith@email.com',
    unit: 'Unit 204',
    property: 'Sunset Apartments',
    address: '123 Sunset Blvd, Fort Myers, FL 33901',
    moveInDate: '2024-03-15',
    leaseEnd: '2025-03-14',
  };

  const rentInfo = {
    amount: 1850,
    dueDate: 'January 1, 2025',
    status: 'due' as const,
    balance: 0,
  };

  const recentPayments = [
    { id: 1, date: 'Dec 1, 2024', amount: 1850, status: 'paid' as const },
    { id: 2, date: 'Nov 1, 2024', amount: 1850, status: 'paid' as const },
    { id: 3, date: 'Oct 1, 2024', amount: 1850, status: 'paid' as const },
  ];

  const maintenanceRequests = [
    { id: 1, title: 'Leaky faucet in bathroom', status: 'scheduled', date: 'Dec 28, 2024' },
    { id: 2, title: 'HVAC filter replacement', status: 'completed', date: 'Dec 15, 2024' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">Tenant Portal</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {tenant.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome & Unit Info */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8 text-white mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">Welcome back, {tenant.name.split(' ')[0]}!</h1>
              <div className="flex items-center gap-2 text-blue-100">
                <Building2 className="w-4 h-4" />
                <span>{tenant.unit} • {tenant.property}</span>
              </div>
              <p className="text-blue-100 text-sm mt-1">{tenant.address}</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/tenant-portal/pay-rent"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                Pay Rent
              </Link>
            </div>
          </div>
        </div>

        {/* Rent Status Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Current Rent Status</h2>
            <StatusBadge status={rentInfo.status} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Amount Due</p>
              <p className="text-3xl font-bold text-gray-900">
                ${rentInfo.amount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Due Date</p>
              <p className="text-lg font-medium text-gray-900">{rentInfo.dueDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Outstanding Balance</p>
              <p className={`text-lg font-medium ${rentInfo.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                ${rentInfo.balance.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
            <Link
              href="/tenant-portal/pay-rent"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              Pay Now
            </Link>
            <Link
              href="/tenant-portal/payments/autopay"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <Clock className="w-4 h-4" />
              Set Up AutoPay
            </Link>
            <Link
              href="/tenant-portal/payments"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Payment History
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <QuickAction
            title="Pay Rent"
            description="Make a payment"
            icon={DollarSign}
            href="/tenant-portal/pay-rent"
            variant="primary"
          />
          <QuickAction
            title="Maintenance"
            description="Submit a request"
            icon={Wrench}
            href="/tenant-portal/maintenance/new"
          />
          <QuickAction
            title="My Lease"
            description="View documents"
            icon={FileText}
            href="/tenant-portal/lease"
          />
          <QuickAction
            title="Contact Us"
            description="Message manager"
            icon={MessageSquare}
            href="/tenant-portal/messages"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Payments */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Recent Payments</h2>
              <Link 
                href="/tenant-portal/payments" 
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      payment.status === 'paid' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <CheckCircle className={`w-4 h-4 ${
                        payment.status === 'paid' ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">${payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{payment.date}</p>
                    </div>
                  </div>
                  <StatusBadge status={payment.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Requests */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Maintenance Requests</h2>
              <Link 
                href="/tenant-portal/maintenance" 
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {maintenanceRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      request.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      <Wrench className={`w-4 h-4 ${
                        request.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{request.title}</p>
                      <p className="text-sm text-gray-500">{request.date}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    request.status === 'completed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
              ))}
              <Link
                href="/tenant-portal/maintenance/new"
                className="flex items-center justify-center gap-2 p-4 text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Wrench className="w-4 h-4" />
                <span className="font-medium">Submit New Request</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Lease Info & Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Lease Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Lease Information</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Move-in Date</span>
                <span className="font-medium text-gray-900">
                  {new Date(tenant.moveInDate).toLocaleDateString('en-US', { 
                    month: 'long', day: 'numeric', year: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Lease Expires</span>
                <span className="font-medium text-gray-900">
                  {new Date(tenant.leaseEnd).toLocaleDateString('en-US', { 
                    month: 'long', day: 'numeric', year: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Monthly Rent</span>
                <span className="font-medium text-gray-900">${rentInfo.amount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-500">Rent Due</span>
                <span className="font-medium text-gray-900">1st of each month</span>
              </div>
            </div>
            <Link
              href="/tenant-portal/lease"
              className="mt-4 flex items-center justify-center gap-2 w-full py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-4 h-4" />
              View Full Lease
            </Link>
          </div>

          {/* Contact Property Manager */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Property Management</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">CR Property Management</p>
                <p className="text-sm text-gray-500">Your property manager</p>
              </div>
            </div>
            <div className="space-y-3">
              <a
                href="tel:+1234567890"
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">(123) 456-7890</p>
                </div>
              </a>
              <a
                href="mailto:support@crpropmanagement.com"
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">support@crpropmanagement.com</p>
                </div>
              </a>
            </div>
            <Link
              href="/tenant-portal/messages"
              className="mt-4 flex items-center justify-center gap-2 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Send Message
            </Link>
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900">Emergency Maintenance</h3>
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
