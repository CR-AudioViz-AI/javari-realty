'use client'

import { useState } from 'react'
import { 
  BarChart3, Mail, MessageSquare, Share2, TrendingUp, Users,
  Calendar, Eye, MousePointer, DollarSign, ArrowUpRight,
  Plus, Settings, Play, Pause, Clock, CheckCircle
} from 'lucide-react'

const CAMPAIGN_STATS = [
  { label: 'Email Sent', value: '1,247', change: '+12%', icon: Mail },
  { label: 'Open Rate', value: '32.4%', change: '+5%', icon: Eye },
  { label: 'Click Rate', value: '8.7%', change: '+2%', icon: MousePointer },
  { label: 'Leads Generated', value: '47', change: '+18%', icon: Users }
]

const CAMPAIGNS = [
  {
    id: 1,
    name: 'New Listings Alert - Naples',
    type: 'Email',
    status: 'active',
    sent: 856,
    opened: 312,
    clicked: 78,
    leads: 12,
    lastSent: '2 hours ago'
  },
  {
    id: 2,
    name: 'First-Time Buyer Guide',
    type: 'Email',
    status: 'active',
    sent: 1420,
    opened: 498,
    clicked: 156,
    leads: 23,
    lastSent: '1 day ago'
  },
  {
    id: 3,
    name: 'Market Update - Cape Coral',
    type: 'Email',
    status: 'scheduled',
    sent: 0,
    opened: 0,
    clicked: 0,
    leads: 0,
    lastSent: 'Scheduled for tomorrow'
  },
  {
    id: 4,
    name: 'Holiday Open House Invite',
    type: 'Email',
    status: 'draft',
    sent: 0,
    opened: 0,
    clicked: 0,
    leads: 0,
    lastSent: 'Draft'
  }
]

const SOCIAL_POSTS = [
  { platform: 'Facebook', posts: 24, reach: '12.5K', engagement: '8.2%' },
  { platform: 'Instagram', posts: 18, reach: '8.3K', engagement: '12.4%' },
  { platform: 'LinkedIn', posts: 12, reach: '3.2K', engagement: '5.6%' }
]

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState('campaigns')

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Marketing Hub</h1>
            <p className="text-gray-500">Manage campaigns, emails, and social media</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-5 h-5" />
            New Campaign
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {CAMPAIGN_STATS.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4" />
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'campaigns' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            Email Campaigns
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'social' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            Social Media
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'templates' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            Templates
          </button>
        </div>

        {/* Campaigns Table */}
        {activeTab === 'campaigns' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Campaign</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Sent</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Opened</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Clicked</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Leads</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {CAMPAIGNS.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-sm text-gray-500">{campaign.type} • {campaign.lastSent}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                        campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {campaign.status === 'active' && <Play className="w-3 h-3" />}
                        {campaign.status === 'scheduled' && <Clock className="w-3 h-3" />}
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{campaign.sent.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      {campaign.sent > 0 ? (
                        <div>
                          <span className="font-medium">{campaign.opened}</span>
                          <span className="text-gray-500 text-sm"> ({Math.round(campaign.opened / campaign.sent * 100)}%)</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {campaign.opened > 0 ? (
                        <div>
                          <span className="font-medium">{campaign.clicked}</span>
                          <span className="text-gray-500 text-sm"> ({Math.round(campaign.clicked / campaign.opened * 100)}%)</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded font-medium">
                        {campaign.leads}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <Settings className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Social Media Tab */}
        {activeTab === 'social' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SOCIAL_POSTS.map((social, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4">{social.platform}</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Posts this month</span>
                    <span className="font-medium">{social.posts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Reach</span>
                    <span className="font-medium">{social.reach}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Engagement Rate</span>
                    <span className="font-medium text-green-600">{social.engagement}</span>
                  </div>
                </div>
                <button className="w-full mt-4 py-2 border rounded-lg hover:bg-gray-50">
                  View Analytics
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['New Listing Announcement', 'Open House Invite', 'Market Update', 'Just Sold', 'Buyer Newsletter', 'Holiday Greeting'].map((template, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="h-32 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg mb-4 flex items-center justify-center">
                  <Mail className="w-12 h-12 text-blue-400" />
                </div>
                <h3 className="font-medium mb-2">{template}</h3>
                <p className="text-sm text-gray-500">Email template</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
