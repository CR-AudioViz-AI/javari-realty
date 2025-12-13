import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Mail,
  Share2,
  FileText,
  Image,
  Calendar,
  TrendingUp,
  Users,
  Eye,
  MousePointer,
  Send,
  Plus,
  Megaphone,
  Instagram,
  Facebook,
  Linkedin,
  PenTool,
  Layout,
  Zap,
  BarChart3,
  Target,
  Clock,
  CheckCircle,
} from 'lucide-react'

export default async function MarketingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, organizations(*)')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/auth/login')

  // Get properties for marketing
  const teamMemberIds: string[] = [user.id]

  const { data: properties } = await supabase
    .from('properties')
    .select('id, title, price, city, photos, status')
    .in('agent_id', teamMemberIds)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(6)

  const activeListings = properties || []

  // Mock campaign stats (would come from email service integration)
  const campaignStats = {
    emailsSent: 1247,
    openRate: 42.3,
    clickRate: 8.7,
    leads: 23,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketing</h1>
          <p className="text-gray-500">Create campaigns, flyers, and social content</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/marketing/campaigns/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Emails Sent</p>
              <p className="text-2xl font-bold text-gray-900">{campaignStats.emailsSent.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Send className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Open Rate</p>
              <p className="text-2xl font-bold text-emerald-600">{campaignStats.openRate}%</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Click Rate</p>
              <p className="text-2xl font-bold text-purple-600">{campaignStats.clickRate}%</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <MousePointer className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Leads Generated</p>
              <p className="text-2xl font-bold text-amber-600">{campaignStats.leads}</p>
            </div>
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Marketing Tools Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Email Campaigns */}
        <Link href="/dashboard/marketing/campaigns" className="bg-white rounded-xl border p-6 hover:shadow-lg transition group">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Email Campaigns</h3>
          <p className="text-sm text-gray-500 mb-4">Create and send email campaigns to your contacts and leads</p>
          <div className="flex items-center text-blue-600 text-sm font-medium">
            <span>Create Campaign</span>
            <Zap className="w-4 h-4 ml-1" />
          </div>
        </Link>

        {/* Listing Flyers */}
        <Link href="/dashboard/marketing/flyers" className="bg-white rounded-xl border p-6 hover:shadow-lg transition group">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <FileText className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Listing Flyers</h3>
          <p className="text-sm text-gray-500 mb-4">Generate professional PDF flyers for your listings</p>
          <div className="flex items-center text-emerald-600 text-sm font-medium">
            <span>Create Flyer</span>
            <Zap className="w-4 h-4 ml-1" />
          </div>
        </Link>

        {/* Social Media */}
        <Link href="/dashboard/marketing/social" className="bg-white rounded-xl border p-6 hover:shadow-lg transition group">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Share2 className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Social Media</h3>
          <p className="text-sm text-gray-500 mb-4">Generate social posts for Instagram, Facebook, LinkedIn</p>
          <div className="flex items-center text-purple-600 text-sm font-medium">
            <span>Create Post</span>
            <Zap className="w-4 h-4 ml-1" />
          </div>
        </Link>

        {/* Open House */}
        <Link href="/dashboard/marketing/openhouse" className="bg-white rounded-xl border p-6 hover:shadow-lg transition group">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Calendar className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Open House Manager</h3>
          <p className="text-sm text-gray-500 mb-4">Schedule and promote open houses with sign-in sheets</p>
          <div className="flex items-center text-amber-600 text-sm font-medium">
            <span>Schedule Open House</span>
            <Zap className="w-4 h-4 ml-1" />
          </div>
        </Link>

        {/* Virtual Tours */}
        <Link href="/dashboard/marketing/tours" className="bg-white rounded-xl border p-6 hover:shadow-lg transition group">
          <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Image className="w-6 h-6 text-rose-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Virtual Tours</h3>
          <p className="text-sm text-gray-500 mb-4">Create and embed virtual property tours</p>
          <div className="flex items-center text-rose-600 text-sm font-medium">
            <span>Add Tour</span>
            <Zap className="w-4 h-4 ml-1" />
          </div>
        </Link>

        {/* Analytics */}
        <Link href="/dashboard/marketing/analytics" className="bg-white rounded-xl border p-6 hover:shadow-lg transition group">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Campaign Analytics</h3>
          <p className="text-sm text-gray-500 mb-4">Track performance across all marketing channels</p>
          <div className="flex items-center text-indigo-600 text-sm font-medium">
            <span>View Analytics</span>
            <Zap className="w-4 h-4 ml-1" />
          </div>
        </Link>
      </div>

      {/* Quick Create Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h2 className="font-semibold mb-4">Quick Create with AI</h2>
        <p className="text-blue-100 text-sm mb-4">Let Javari help you create marketing content in seconds</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-white/10 rounded-xl hover:bg-white/20 transition">
            <PenTool className="w-6 h-6 mb-2" />
            <span className="text-sm">Property Description</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-white/10 rounded-xl hover:bg-white/20 transition">
            <Instagram className="w-6 h-6 mb-2" />
            <span className="text-sm">Instagram Post</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-white/10 rounded-xl hover:bg-white/20 transition">
            <Mail className="w-6 h-6 mb-2" />
            <span className="text-sm">Email Template</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-white/10 rounded-xl hover:bg-white/20 transition">
            <Layout className="w-6 h-6 mb-2" />
            <span className="text-sm">Listing Flyer</span>
          </button>
        </div>
      </div>

      {/* Active Listings for Marketing */}
      <div className="bg-white rounded-xl border">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-gray-900">Market Your Active Listings</h2>
          <Link href="/dashboard/properties?status=active" className="text-sm text-blue-600 hover:text-blue-700">
            View All
          </Link>
        </div>
        
        {activeListings.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 divide-x divide-y">
            {activeListings.map((property) => (
              <div key={property.id} className="p-4">
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    {property.photos?.[0] ? (
                      <img src={property.photos[0]} alt={property.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Image className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">{property.title}</h4>
                    <p className="text-xs text-gray-500">{property.city}</p>
                    <p className="text-sm font-semibold text-emerald-600 mt-1">
                      ${(property.price / 1000000).toFixed(2)}M
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Link
                    href={`/dashboard/marketing/flyers/new?property=${property.id}`}
                    className="flex-1 text-center px-2 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition"
                  >
                    Flyer
                  </Link>
                  <Link
                    href={`/dashboard/marketing/social/new?property=${property.id}`}
                    className="flex-1 text-center px-2 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition"
                  >
                    Social
                  </Link>
                  <Link
                    href={`/dashboard/marketing/campaigns/new?property=${property.id}`}
                    className="flex-1 text-center px-2 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition"
                  >
                    Email
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Megaphone className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No active listings to market</p>
          </div>
        )}
      </div>

      {/* Recent Campaigns */}
      <div className="bg-white rounded-xl border">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-gray-900">Recent Campaigns</h2>
          <Link href="/dashboard/marketing/campaigns" className="text-sm text-blue-600 hover:text-blue-700">
            View All
          </Link>
        </div>
        <div className="p-8 text-center text-gray-500">
          <Mail className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="mb-4">No campaigns yet</p>
          <Link
            href="/dashboard/marketing/campaigns/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create First Campaign
          </Link>
        </div>
      </div>
    </div>
  )
}
