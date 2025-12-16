'use client'

import { useState } from 'react'
import {
  BarChart3, PieChart, TrendingUp, Download, Calendar,
  Users, Home, DollarSign, Clock, FileText, Share2,
  ChevronDown, Filter, RefreshCw, Star, Target, Award
} from 'lucide-react'

interface ReportMetric {
  label: string
  value: string | number
  change?: number
  trend?: 'up' | 'down' | 'neutral'
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('30')
  const [reportType, setReportType] = useState('overview')

  // Sample metrics
  const metrics: ReportMetric[] = [
    { label: 'Total Leads', value: 47, change: 12, trend: 'up' },
    { label: 'Active Listings', value: 9, change: 2, trend: 'up' },
    { label: 'Showings', value: 23, change: -3, trend: 'down' },
    { label: 'Under Contract', value: 3, change: 1, trend: 'up' },
    { label: 'Closed Sales', value: 2, change: 0, trend: 'neutral' },
    { label: 'Commission Earned', value: '$47,500', change: 15, trend: 'up' },
  ]

  const leadSources = [
    { source: 'Zillow', leads: 15, percentage: 32 },
    { source: 'Facebook', leads: 12, percentage: 26 },
    { source: 'Referrals', leads: 8, percentage: 17 },
    { source: 'Website', leads: 6, percentage: 13 },
    { source: 'Open House', leads: 4, percentage: 8 },
    { source: 'Other', leads: 2, percentage: 4 },
  ]

  const recentActivity = [
    { date: '2024-12-13', type: 'New Lead', description: 'Sarah Johnson via Zillow' },
    { date: '2024-12-13', type: 'Showing', description: '2850 Winkler Ave - Mike Chen' },
    { date: '2024-12-12', type: 'Offer', description: 'Offer submitted on 3500 Oasis Blvd' },
    { date: '2024-12-12', type: 'Listing', description: 'New listing at 1420 SE 47th St' },
    { date: '2024-12-11', type: 'Closed', description: 'Closing completed - Cape Coral property' },
  ]

  const pipelineData = [
    { stage: 'New Leads', count: 12, value: 4800000 },
    { stage: 'Contacted', count: 8, value: 3200000 },
    { stage: 'Qualified', count: 6, value: 2700000 },
    { stage: 'Showing', count: 4, value: 1600000 },
    { stage: 'Negotiating', count: 2, value: 850000 },
    { stage: 'Closed', count: 2, value: 824000 },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="text-blue-600" /> Reports & Analytics
          </h1>
          <p className="text-gray-600 mt-1">Track your performance and business metrics</p>
        </div>
        
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last Year</option>
          </select>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2">
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white rounded-xl border p-4">
            <p className="text-sm text-gray-500 mb-1">{metric.label}</p>
            <p className="text-2xl font-bold">{metric.value}</p>
            {metric.change !== undefined && (
              <p className={`text-xs flex items-center gap-1 mt-1 ${
                metric.trend === 'up' ? 'text-green-600' :
                metric.trend === 'down' ? 'text-red-600' : 'text-gray-500'
              }`}>
                {metric.trend === 'up' && <TrendingUp size={12} />}
                {metric.trend === 'down' && <TrendingUp size={12} className="rotate-180" />}
                {metric.change > 0 ? '+' : ''}{metric.change}% vs last period
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pipeline Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border p-6">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <Target size={20} className="text-blue-600" />
            Sales Pipeline
          </h2>
          
          <div className="space-y-4">
            {pipelineData.map((stage, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{stage.stage}</span>
                  <span className="text-gray-600">{stage.count} clients • ${(stage.value / 1000000).toFixed(1)}M</span>
                </div>
                <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                  <div 
                    className={`h-full rounded-lg ${
                      idx === 5 ? 'bg-green-500' :
                      idx === 4 ? 'bg-amber-500' :
                      'bg-blue-500'
                    }`}
                    style={{ width: `${(stage.count / 12) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500">Total Pipeline</p>
                <p className="text-xl font-bold text-blue-600">$13.9M</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Conversion Rate</p>
                <p className="text-xl font-bold text-green-600">17%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg. Deal Size</p>
                <p className="text-xl font-bold">$412K</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Sources */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <PieChart size={20} className="text-purple-600" />
            Lead Sources
          </h2>
          
          <div className="space-y-3">
            {leadSources.map((source, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{source.source}</span>
                  <span className="text-gray-600">{source.leads} ({source.percentage}%)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div 
                    className={`h-full rounded-full ${
                      idx === 0 ? 'bg-blue-500' :
                      idx === 1 ? 'bg-purple-500' :
                      idx === 2 ? 'bg-green-500' :
                      idx === 3 ? 'bg-amber-500' :
                      idx === 4 ? 'bg-cyan-500' :
                      'bg-gray-400'
                    }`}
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <p className="text-sm text-gray-500 mb-1">Top Performing Source</p>
            <p className="font-bold text-lg">Zillow (32%)</p>
            <p className="text-xs text-green-600">+5% from last month</p>
          </div>
        </div>
      </div>

      {/* Activity & Goals */}
      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <Clock size={20} className="text-amber-600" />
            Recent Activity
          </h2>
          
          <div className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'New Lead' ? 'bg-blue-500' :
                  activity.type === 'Showing' ? 'bg-purple-500' :
                  activity.type === 'Offer' ? 'bg-amber-500' :
                  activity.type === 'Listing' ? 'bg-green-500' :
                  'bg-emerald-500'
                }`} />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">{activity.type}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <Award size={20} className="text-green-600" />
            Monthly Goals
          </h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Listings (Goal: 3)</span>
                <span className="font-medium">2/3</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '67%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Closings (Goal: 2)</span>
                <span className="font-medium text-green-600">2/2 ✓</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>New Leads (Goal: 50)</span>
                <span className="font-medium">47/50</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '94%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Commission (Goal: $50K)</span>
                <span className="font-medium">$47.5K</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '95%' }} />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t bg-green-50 -mx-6 -mb-6 p-4 rounded-b-xl">
            <div className="flex items-center gap-3">
              <Star className="text-green-600" size={24} />
              <div>
                <p className="font-bold text-green-800">Great Progress!</p>
                <p className="text-sm text-green-700">You're on track to hit all monthly goals</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
        <h2 className="font-bold mb-4">Year-to-Date Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-blue-200 text-sm">Total Volume</p>
            <p className="text-3xl font-bold">$8.7M</p>
          </div>
          <div>
            <p className="text-blue-200 text-sm">Transactions</p>
            <p className="text-3xl font-bold">24</p>
          </div>
          <div>
            <p className="text-blue-200 text-sm">Total Commission</p>
            <p className="text-3xl font-bold">$261K</p>
          </div>
          <div>
            <p className="text-blue-200 text-sm">Avg Days on Market</p>
            <p className="text-3xl font-bold">18</p>
          </div>
        </div>
      </div>
    </div>
  )
}
