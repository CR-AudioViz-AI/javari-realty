'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Home, Users, Calendar, FileText, BarChart3,
  Settings, HelpCircle, LogOut, ChevronDown, ChevronRight,
  GraduationCap, Bot, Building2, MapPin, TrendingUp, Scale,
  Mail, Share2, QrCode, Calculator, Briefcase, Clock, FolderOpen,
  Zap, Target, DollarSign, Megaphone, Star
} from 'lucide-react'
import { useState } from 'react'

interface NavItem {
  name: string
  href: string
  icon: any
  badge?: string
  children?: NavItem[]
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Properties', href: '/dashboard/properties', icon: Home, badge: '9' },
  { name: 'Clients', href: '/dashboard/pipeline', icon: Users },
  { name: 'Showings', href: '/dashboard/showings', icon: Calendar },
  { name: 'Open Houses', href: '/dashboard/open-houses', icon: Clock },
  { name: 'Documents', href: '/dashboard/documents', icon: FolderOpen },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    children: [
      { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
      { name: 'Market Data', href: '/dashboard/analytics/market', icon: TrendingUp },
      { name: 'Property Intel', href: '/dashboard/intelligence', icon: Zap },
    ]
  },
  {
    name: 'Marketing',
    href: '/dashboard/marketing',
    icon: Megaphone,
    children: [
      { name: 'Social Media', href: '/dashboard/marketing/social', icon: Share2 },
      { name: 'Email Templates', href: '/dashboard/marketing/emails', icon: Mail },
      { name: 'QR Codes', href: '/dashboard/marketing/qr-codes', icon: QrCode },
    ]
  },
  {
    name: 'Tools',
    href: '/dashboard/tools',
    icon: Briefcase,
    children: [
      { name: 'Net Sheet', href: '/dashboard/calculators/net-sheet', icon: Calculator },
      { name: 'Compare Properties', href: '/dashboard/compare', icon: Scale },
      { name: 'Mortgage Calculators', href: 'https://mortgage.craudiovizai.com', icon: DollarSign },
    ]
  },
  {
    name: 'Add-Ons',
    href: '/dashboard/addons',
    icon: Star,
    badge: 'PRO',
    children: [
      { name: 'Education Center', href: '/dashboard/education', icon: GraduationCap },
      { name: 'AI Assistant', href: '/dashboard/assistant', icon: Bot },
      { name: 'Vendor Network', href: '/dashboard/vendors', icon: Building2 },
    ]
  },
]

const bottomNav: NavItem[] = [
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Help & Support', href: '/dashboard/help', icon: HelpCircle },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(['Analytics', 'Marketing', 'Tools', 'Add-Ons'])

  const toggleExpand = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name)
        : [...prev, name]
    )
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const NavItemComponent = ({ item, depth = 0 }: { item: NavItem, depth?: number }) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.name)
    const active = isActive(item.href)
    const isExternal = item.href.startsWith('http')

    if (hasChildren) {
      return (
        <div>
          <button
            onClick={() => toggleExpand(item.name)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
              active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={18} />
              <span>{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.badge && (
                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                  {item.badge}
                </span>
              )}
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          </button>
          {isExpanded && (
            <div className="ml-6 mt-1 space-y-1">
              {item.children?.map(child => (
                <NavItemComponent key={child.name} item={child} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      )
    }

    const LinkComponent = isExternal ? 'a' : Link
    const linkProps = isExternal 
      ? { href: item.href, target: '_blank', rel: 'noopener noreferrer' }
      : { href: item.href }

    return (
      <LinkComponent
        {...linkProps}
        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
          active 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center gap-3">
          <item.icon size={18} />
          <span>{item.name}</span>
        </div>
        {item.badge && (
          <span className={`px-1.5 py-0.5 text-xs rounded ${
            active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}>
            {item.badge}
          </span>
        )}
      </LinkComponent>
    )
  }

  return (
    <aside className="w-64 bg-white border-r h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <Home className="text-white" size={20} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">RealtorPro</h1>
            <p className="text-xs text-gray-500">by CR AudioViz AI</p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map(item => (
          <NavItemComponent key={item.name} item={item} />
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t space-y-1">
        {bottomNav.map(item => (
          <NavItemComponent key={item.name} item={item} />
        ))}
        <button className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm transition-colors">
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
