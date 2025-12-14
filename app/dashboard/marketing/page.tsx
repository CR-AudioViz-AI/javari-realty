import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Mail, Share2, FileText, Image, Calendar, TrendingUp, Users, Eye,
  MousePointer, Send, Plus, Megaphone, PenTool, Layout, Zap, BarChart3,
  Target, Clock, CheckCircle, Globe, Smartphone, MessageCircle, Video,
  Instagram, Facebook, Linkedin, Twitter, Youtube
} from 'lucide-react'

export default async function MarketingHubPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // Get marketing stats
  const { count: listingsCount } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', user.id)
    .eq('status', 'active')

  const { count: emailCampaigns } = await supabase
    .from('email_campaigns')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', user.id)

  const { count: socialPosts } = await supabase
    .from('social_posts')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', user.id)

  const marketingChannels = [
    { name: 'Website', icon: Globe, color: 'blue', status: 'active', link: '/dashboard/marketing/website' },
    { name: 'Social Media', icon: Share2, color: 'purple', status: 'active', link: '/dashboard/marketing/social' },
    { name: 'Email Campaigns', icon: Mail, color: 'green', status: 'active', link: '/dashboard/marketing/email' },
    { name: 'Mobile App', icon: Smartphone, color: 'orange', status: 'coming', link: '#' },
    { name: 'Video Marketing', icon: Video, color: 'red', status: 'coming', link: '#' },
    { name: 'SMS Marketing', icon: MessageCircle, color: 'teal', status: 'coming', link: '#' },
  ]

  const socialPlatforms = [
    { name: 'Facebook', icon: Facebook, connected: false, color: 'text-blue-600' },
    { name: 'Instagram', icon: Instagram, connected: false, color: 'text-pink-600' },
    { name: 'LinkedIn', icon: Linkedin, connected: false, color: 'text-blue-800' },
    { name: 'Twitter/X', icon: Twitter, connected: false, color: 'text-gray-800' },
    { name: 'YouTube', icon: Youtube, connected: false, color: 'text-red-600' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Marketing Hub</h1>
          <p className="text-gray-600">Manage all your marketing channels in one place</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/marketing/campaigns/new">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <Plus size={18} /> New Campaign
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Listings</p>
              <p className="text-2xl font-bold">{listingsCount || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Mail className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email Campaigns</p>
              <p className="text-2xl font-bold">{emailCampaigns || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Share2 className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Social Posts</p>
              <p className="text-2xl font-bold">{socialPosts || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Engagement Rate</p>
              <p className="text-2xl font-bold">--</p>
            </div>
          </div>
        </div>
      </div>

      {/* Marketing Channels */}
      <div className="bg-white rounded-lg shadow border p-6">
        <h2 className="text-lg font-semibold mb-4">Marketing Channels</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {marketingChannels.map((channel) => (
            <Link key={channel.name} href={channel.link} className={channel.status === 'coming' ? 'pointer-events-none' : ''}>
              <div className={`p-4 rounded-lg border hover:shadow-md transition-shadow ${channel.status === 'coming' ? 'opacity-60' : ''}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 bg-${channel.color}-100 rounded-lg`}>
                    <channel.icon className={`text-${channel.color}-600`} size={24} />
                  </div>
                  {channel.status === 'coming' ? (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Coming Soon</span>
                  ) : (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Active</span>
                  )}
                </div>
                <h3 className="font-medium">{channel.name}</h3>
                <p className="text-sm text-gray-500">
                  {channel.name === 'Website' && 'Manage your agent website and listings'}
                  {channel.name === 'Social Media' && 'Schedule and publish social content'}
                  {channel.name === 'Email Campaigns' && 'Create and send email campaigns'}
                  {channel.name === 'Mobile App' && 'Push notifications and app marketing'}
                  {channel.name === 'Video Marketing' && 'Virtual tours and property videos'}
                  {channel.name === 'SMS Marketing' && 'Text message campaigns'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Social Media Connections */}
      <div className="bg-white rounded-lg shadow border p-6">
        <h2 className="text-lg font-semibold mb-4">Social Media Accounts</h2>
        <p className="text-gray-500 mb-4">Connect your social accounts to post directly from this platform</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {socialPlatforms.map((platform) => (
            <div key={platform.name} className="text-center p-4 border rounded-lg hover:bg-gray-50">
              <platform.icon className={`mx-auto mb-2 ${platform.color}`} size={32} />
              <p className="font-medium text-sm">{platform.name}</p>
              <button className="mt-2 text-xs text-blue-600 hover:underline">
                {platform.connected ? 'Connected' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow border p-6">
          <h2 className="text-lg font-semibold mb-4">Create Content</h2>
          <div className="space-y-3">
            <Link href="/dashboard/marketing/listings/promote" className="block">
              <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50">
                <Megaphone className="text-blue-600" size={20} />
                <div>
                  <p className="font-medium">Promote a Listing</p>
                  <p className="text-sm text-gray-500">Create ads for your properties</p>
                </div>
              </div>
            </Link>
            <Link href="/dashboard/marketing/social/new" className="block">
              <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50">
                <PenTool className="text-purple-600" size={20} />
                <div>
                  <p className="font-medium">Create Social Post</p>
                  <p className="text-sm text-gray-500">Schedule content across platforms</p>
                </div>
              </div>
            </Link>
            <Link href="/dashboard/marketing/email/new" className="block">
              <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50">
                <Mail className="text-green-600" size={20} />
                <div>
                  <p className="font-medium">Email Campaign</p>
                  <p className="text-sm text-gray-500">Send newsletters and updates</p>
                </div>
              </div>
            </Link>
            <Link href="/dashboard/marketing/flyers" className="block">
              <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50">
                <Layout className="text-orange-600" size={20} />
                <div>
                  <p className="font-medium">Design Flyer</p>
                  <p className="text-sm text-gray-500">Create property flyers and brochures</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <h2 className="text-lg font-semibold mb-4">Marketing Tools</h2>
          <div className="space-y-3">
            <Link href="/dashboard/share-listings" className="block">
              <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50">
                <Share2 className="text-blue-600" size={20} />
                <div>
                  <p className="font-medium">Share Listings</p>
                  <p className="text-sm text-gray-500">Generate shareable listing links</p>
                </div>
              </div>
            </Link>
            <Link href="/dashboard/marketing/analytics" className="block">
              <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50">
                <BarChart3 className="text-purple-600" size={20} />
                <div>
                  <p className="font-medium">Analytics</p>
                  <p className="text-sm text-gray-500">Track marketing performance</p>
                </div>
              </div>
            </Link>
            <Link href="/dashboard/marketing/templates" className="block">
              <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50">
                <FileText className="text-green-600" size={20} />
                <div>
                  <p className="font-medium">Templates</p>
                  <p className="text-sm text-gray-500">Email and social templates</p>
                </div>
              </div>
            </Link>
            <Link href="/dashboard/marketing/brand" className="block">
              <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50">
                <Zap className="text-orange-600" size={20} />
                <div>
                  <p className="font-medium">Brand Kit</p>
                  <p className="text-sm text-gray-500">Logos, colors, and brand assets</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
