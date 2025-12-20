'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Mail, Send, FileText, Image, BarChart3, Users, Calendar,
  Plus, Search, Filter, Eye, Edit, Trash2, CheckCircle,
  Clock, TrendingUp, Share2, Facebook, Instagram, Linkedin
} from 'lucide-react'

const CAMPAIGNS = [
  {
    id: 1,
    name: 'New Listing Alert - Naples Luxury',
    type: 'Email',
    status: 'Active',
    sent: 1250,
    opened: 423,
    clicked: 89,
    date: '2024-12-18'
  },
  {
    id: 2,
    name: 'Cape Coral Gulf Access Homes',
    type: 'Email',
    status: 'Scheduled',
    sent: 0,
    opened: 0,
    clicked: 0,
    date: '2024-12-22'
  },
  {
    id: 3,
    name: 'Holiday Market Update',
    type: 'Newsletter',
    status: 'Draft',
    sent: 0,
    opened: 0,
    clicked: 0,
    date: null
  },
  {
    id: 4,
    name: 'First-Time Buyer Webinar',
    type: 'Email',
    status: 'Completed',
    sent: 890,
    opened: 312,
    clicked: 67,
    date: '2024-12-10'
  }
]

const TEMPLATES = [
  { id: 1, name: 'New Listing', category: 'Property', uses: 45 },
  { id: 2, name: 'Just Sold', category: 'Property', uses: 32 },
  { id: 3, name: 'Open House Invite', category: 'Event', uses: 28 },
  { id: 4, name: 'Market Report', category: 'Newsletter', uses: 12 },
  { id: 5, name: 'Price Reduction', category: 'Property', uses: 19 },
  { id: 6, name: 'Holiday Greeting', category: 'Seasonal', uses: 8 }
]

const SOCIAL_POSTS = [
  { id: 1, platform: 'Facebook', content: 'Just listed! Beautiful 4BR in Naples...', scheduled: '2024-12-20 10:00 AM', status: 'Scheduled' },
  { id: 2, platform: 'Instagram', content: 'Gulf access dream home in Cape Coral 🌴', scheduled: '2024-12-20 2:00 PM', status: 'Scheduled' },
  { id: 3, platform: 'LinkedIn', content: 'SW Florida market update for December...', scheduled: '2024-12-21 9:00 AM', status: 'Draft' }
]

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'templates' | 'social'>('campaigns')

  const openRate = Math.round((CAMPAIGNS.filter(c => c.sent > 0).reduce((a, b) => a + b.opened, 0) / CAMPAIGNS.filter(c => c.sent > 0).reduce((a, b) => a + b.sent, 0)) * 100)
  const clickRate = Math.round((CAMPAIGNS.filter(c => c.opened > 0).reduce((a, b) => a + b.clicked, 0) / CAMPAIGNS.filter(c => c.opened > 0).reduce((a, b) => a + b.opened, 0)) * 100)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Marketing Hub</h1>
            <p className="text-gray-500">Manage campaigns, templates, and social media</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-5 h-5" />
            New Campaign
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-gray-500">Total Sent</span>
            </div>
            <div className="text-3xl font-bold">2,140</div>
            <div className="text-sm text-green-600">+12% vs last month</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-gray-500">Open Rate</span>
            </div>
            <div className="text-3xl font-bold">{openRate}%</div>
            <div className="text-sm text-green-600">Above industry avg</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-gray-500">Click Rate</span>
            </div>
            <div className="text-3xl font-bold">{clickRate}%</div>
            <div className="text-sm text-gray-500">Industry avg: 2.5%</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-gray-500">Subscribers</span>
            </div>
            <div className="text-3xl font-bold">1,847</div>
            <div className="text-sm text-green-600">+89 this month</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'campaigns' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
          >
            <Mail className="w-4 h-4 inline mr-2" />
            Campaigns
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'templates' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Templates
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'social' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
          >
            <Share2 className="w-4 h-4 inline mr-2" />
            Social Media
          </button>
        </div>

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-4 font-medium text-gray-500">Campaign</th>
                  <th className="text-left px-6 py-4 font-medium text-gray-500">Type</th>
                  <th className="text-left px-6 py-4 font-medium text-gray-500">Status</th>
                  <th className="text-left px-6 py-4 font-medium text-gray-500">Sent</th>
                  <th className="text-left px-6 py-4 font-medium text-gray-500">Opened</th>
                  <th className="text-left px-6 py-4 font-medium text-gray-500">Clicked</th>
                  <th className="text-left px-6 py-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {CAMPAIGNS.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{campaign.name}</td>
                    <td className="px-6 py-4 text-gray-500">{campaign.type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.status === 'Active' ? 'bg-green-100 text-green-700' :
                        campaign.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                        campaign.status === 'Completed' ? 'bg-gray-100 text-gray-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{campaign.sent.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-500">{campaign.opened.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-500">{campaign.clicked.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Edit className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEMPLATES.map((template) => (
              <div key={template.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    {template.category}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">{template.name}</h3>
                <p className="text-sm text-gray-500 mb-4">Used {template.uses} times</p>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 border rounded-lg hover:bg-gray-50 text-sm">
                    Preview
                  </button>
                  <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                    Use Template
                  </button>
                </div>
              </div>
            ))}
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer hover:border-gray-300">
              <Plus className="w-8 h-8 mb-2" />
              <span>Create Template</span>
            </div>
          </div>
        )}

        {/* Social Media Tab */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Facebook className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="font-semibold">Facebook</div>
                    <div className="text-sm text-gray-500">2,450 followers</div>
                  </div>
                </div>
                <button className="w-full py-2 border rounded-lg hover:bg-gray-50">
                  Schedule Post
                </button>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Instagram className="w-8 h-8 text-pink-600" />
                  <div>
                    <div className="font-semibold">Instagram</div>
                    <div className="text-sm text-gray-500">1,890 followers</div>
                  </div>
                </div>
                <button className="w-full py-2 border rounded-lg hover:bg-gray-50">
                  Schedule Post
                </button>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Linkedin className="w-8 h-8 text-blue-700" />
                  <div>
                    <div className="font-semibold">LinkedIn</div>
                    <div className="text-sm text-gray-500">560 connections</div>
                  </div>
                </div>
                <button className="w-full py-2 border rounded-lg hover:bg-gray-50">
                  Schedule Post
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="font-semibold">Scheduled Posts</h3>
              </div>
              <div className="divide-y">
                {SOCIAL_POSTS.map((post) => (
                  <div key={post.id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {post.platform === 'Facebook' && <Facebook className="w-6 h-6 text-blue-600" />}
                      {post.platform === 'Instagram' && <Instagram className="w-6 h-6 text-pink-600" />}
                      {post.platform === 'LinkedIn' && <Linkedin className="w-6 h-6 text-blue-700" />}
                      <div>
                        <div className="font-medium">{post.content}</div>
                        <div className="text-sm text-gray-500">{post.scheduled}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      post.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
