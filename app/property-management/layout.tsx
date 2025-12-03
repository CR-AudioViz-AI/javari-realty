// CR REALTOR PLATFORM - PROPERTY MANAGEMENT LAYOUT
// Created: December 3, 2025

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  Home,
  Users,
  FileText,
  Wrench,
  DollarSign,
  ClipboardCheck,
  Truck,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Bell,
  Search,
  HelpCircle,
  LogOut,
  User,
  Building,
  Factory,
  Store
} from 'lucide-react';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/property-management', 
    icon: BarChart3,
    exact: true 
  },
  { 
    name: 'Properties', 
    href: '/property-management/properties', 
    icon: Building2,
    badge: 24
  },
  { 
    name: 'Units', 
    href: '/property-management/units', 
    icon: Home,
    badge: 156
  },
  { 
    name: 'Tenants', 
    href: '/property-management/tenants', 
    icon: Users,
    badge: 147
  },
  { 
    name: 'Leases', 
    href: '/property-management/leases', 
    icon: FileText 
  },
  { 
    name: 'Payments', 
    href: '/property-management/payments', 
    icon: DollarSign 
  },
  { 
    name: 'Maintenance', 
    href: '/property-management/maintenance', 
    icon: Wrench,
    badge: 18,
    badgeColor: 'red'
  },
  { 
    name: 'Inspections', 
    href: '/property-management/inspections', 
    icon: ClipboardCheck 
  },
  { 
    name: 'Vendors', 
    href: '/property-management/vendors', 
    icon: Truck 
  },
  { 
    name: 'Reports', 
    href: '/property-management/reports', 
    icon: BarChart3 
  },
  { 
    name: 'Settings', 
    href: '/property-management/settings', 
    icon: Settings 
  },
];

const categoryFilters = [
  { name: 'All Properties', icon: Building2, filter: 'all' },
  { name: 'Residential', icon: Home, filter: 'residential' },
  { name: 'Commercial', icon: Store, filter: 'commercial' },
  { name: 'Industrial', icon: Factory, filter: 'industrial' },
];

export default function PropertyManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200
        transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {!sidebarCollapsed && (
            <Link href="/property-management" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">PropManager</span>
            </Link>
          )}
          {sidebarCollapsed && (
            <div className="w-full flex justify-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          {navigation.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                  ${active 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                  ${sidebarCollapsed ? 'justify-center' : ''}
                `}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-blue-600' : ''}`} />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 font-medium">{item.name}</span>
                    {item.badge && (
                      <span className={`
                        px-2 py-0.5 text-xs font-medium rounded-full
                        ${item.badgeColor === 'red' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-gray-100 text-gray-600'
                        }
                      `}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}

          {/* Category Filters */}
          {!sidebarCollapsed && (
            <div className="pt-6 mt-6 border-t border-gray-200">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Filter by Type
              </p>
              {categoryFilters.map((item) => (
                <Link
                  key={item.name}
                  href={`/property-management/properties?category=${item.filter}`}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          )}
        </nav>

        {/* Collapse Button (Desktop only) */}
        <div className="absolute bottom-4 left-0 right-0 px-4 hidden lg:block">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`
        transition-all duration-300
        ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search */}
            <div className="hidden sm:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties, tenants, units..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <HelpCircle className="w-5 h-5 text-gray-600" />
              </button>
              <div className="hidden sm:block w-px h-6 bg-gray-200 mx-2" />
              <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  Property Manager
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
