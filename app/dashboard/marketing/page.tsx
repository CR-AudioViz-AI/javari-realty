'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Mail, MessageSquare, Facebook, Instagram, Megaphone,
  BarChart3, Send, Clock, CheckCircle, AlertCircle,
  Plus, TrendingUp, Users, Eye, MousePointer, DollarSign
} from 'lucide-react'

const CAMPAIGNS = [
  {
    id: '1',
    name: 'New Listing Alert - Naples Luxury',
    type: 'email',
    status: 'active',
    sent: 1250,
    opened: 485,
    clicked: 127,
    leads: 8,
    date: '2024-12-18'
  },
  {
    id: '2',
    name: 'Cape Coral Gulf Access Homes',
    type: 'email',
    status: 'active',
    sent: 890,
    opened: 312,
    clicked: 89,
    leads: 5,
    date: '2024-12-15'
  },
  {
    id: '3',
    name: 'Holiday Home Buying Tips',
    type: 'social',
    status: 'completed',
    sent: 0,
    opened: 0,
    clicked: 0,
    leads: 12,
    reach: 4500,
    engagement: 234,
    date: '2024-12-10'
  },
  {
    id: '4',
    name: 'First-Time Buyer Webinar',
    type: 'email',
    status: 'scheduled',
    sent: 0,
    opened: 0,
    clicked: 0,
    leads: 0,
    scheduledFor: '2024-12-22',
    date: '2024-12-19'
  }
]

const QUICK_STATS = [
  { label: 'Email Subscribers', value: '3,247', change: '+124 this month', icon: Mail, color: 'text-blue-600' },
  { label: 'Social Followers', value: '8,912', change: '+287 this month', icon: Users, color: 'text-purple-600' },
  { label: 'Avg Open Rate', value: '38.7%', change: '+2.3% vs last month', icon: Eye, color: 'text-green-600' },
  { label: 'Leads Generated', value: '47', change: 'This month', icon: TrendingUp, color: 'text-orange-600' }
]

const TEMPLATES = [
  { id: '1', name: 'New Listing Announcement', type: 'email', uses: 45 },
  { id: '2', name: 'Open House Invitation', type: 'email', uses: 32 },
  { id: '3', name: 'Market Update', type: 'email', uses: 28 },
  { id: '4', name: 'Just Sold!', type: 'social', uses: 56 },
  { id: '5', name: 'Price Reduction Alert', type: 'email', uses: 19 }
]

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'templates' | 'analytics'>('campaigns')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Marketing Hub</h1>
            <p className="text-gray-500">Manage campaigns, templates, and track performance</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <BarChart3 className="w-5 h-5" />
              Reports
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-5 h-5" />
              New Campaign
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {QUICK_STATS.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gray-50 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
              <div className="text-green-600 text-sm mt-1">{stat.change}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {[
            { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
            { id: 'templates', label: 'Templates', icon: Mail },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Recent Campaigns</h2>
            </div>
            <div className="divide-y">
              {CAMPAIGNS.map(campaign => (
                <div key={campaign.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        campaign.type === 'email' ? 'bg-blue-50' : 'bg-purple-50'
                      }`}>
                        {campaign.type === 'email' ? (
                          <Mail className={`w-6 h-6 ${campaign.type === 'email' ? 'text-blue-600' : 'text-purple-600'}`} />
                        ) : (
                          <Facebook className="w-6 h-6 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{campaign.name}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span className={`flex items-center gap-1 ${
                            campaign.status === 'active' ? 'text-green-600' :
                            campaign.status === 'scheduled' ? 'text-yellow-600' :
                            'text-gray-500'
                          }`}>
                            {campaign.status === 'active' && <CheckCircle className="w-4 h-4" />}
                            {campaign.status === 'scheduled' && <Clock className="w-4 h-4" />}
                            {campaign.status === 'completed' && <CheckCircle className="w-4 h-4" />}
                            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                          </span>
                          <span>{campaign.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 text-center">
                      {campaign.type === 'email' ? (
                        <>
                          <div>
                            <div className="text-xl font-semibold">{campaign.sent.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">Sent</div>
                          </div>
                          <div>
                            <div className="text-xl font-semibold">{campaign.opened}</div>
                            <div className="text-sm text-gray-500">Opened</div>
                          </div>
                          <div>
                            <div className="text-xl font-semibold">{campaign.clicked}</div>
                            <div className="text-sm text-gray-500">Clicked</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <div className="text-xl font-semibold">{campaign.reach?.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">Reach</div>
                          </div>
                          <div>
                            <div className="text-xl font-semibold">{campaign.engagement}</div>
                            <div className="text-sm text-gray-500">Engagement</div>
                          </div>
                        </>
                      )}
                      <div>
                        <div className="text-xl font-semibold text-green-600">{campaign.leads}</div>
                        <div className="text-sm text-gray-500">Leads</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATES.map(template => (
              <div key={template.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${template.type === 'email' ? 'bg-blue-50' : 'bg-purple-50'}`}>
                    {template.type === 'email' ? (
                      <Mail className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Instagram className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                  <span className="text-sm text-gray-500 capitalize">{template.type}</span>
                </div>
                <h3 className="font-semibold mb-2">{template.name}</h3>
                <p className="text-sm text-gray-500">Used {template.uses} times</p>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100">
                    Use Template
                  </button>
                  <button className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50">
                    Edit
                  </button>
                </div>
              </div>
            ))}
            <div className="bg-gray-100 rounded-xl p-6 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-blue-400 cursor-pointer">
              <Plus className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-gray-600 font-medium">Create Template</span>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6">Campaign Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">2,140</div>
                <div className="text-gray-600">Total Emails Sent</div>
                <div className="text-sm text-green-600 mt-1">+15% vs last month</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">38.7%</div>
                <div className="text-gray-600">Average Open Rate</div>
                <div className="text-sm text-green-600 mt-1">Industry avg: 21%</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">$12,450</div>
                <div className="text-gray-600">Est. Commission from Leads</div>
                <div className="text-sm text-gray-500 mt-1">Based on 25 qualified leads</div>
              </div>
            </div>
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Detailed analytics charts coming soon</p>
              <p className="text-sm">Connect Google Analytics for advanced insights</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
