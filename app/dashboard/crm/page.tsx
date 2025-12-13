import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Plus,
  Users,
  Phone,
  Mail,
  MapPin,
  Search,
  Filter,
  MoreVertical,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  Home,
  DollarSign,
  Tag,
  ChevronRight,
} from 'lucide-react'

export default async function CRMPage({
  searchParams,
}: {
  searchParams: { status?: string; tag?: string; search?: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, organizations(*)')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/auth/login')

  const isAdmin = profile.role === 'admin' || profile.is_admin

  // Get team member IDs
  let teamMemberIds: string[] = [user.id]
  if (false && profile.organization_id) { // Disabled - organization_id not in schema
    const { data: team } = await supabase
      .from('profiles')
      .select('id')
      .eq('organization_id', profile.organization_id)
    if (team) teamMemberIds = team.map(m => m.id)
  }

  // Query contacts
  let contactsQuery = supabase
    .from('contacts')
    .select('*')
    .order('updated_at', { ascending: false })

  if (!isAdmin) {
    contactsQuery = contactsQuery.in('agent_id', teamMemberIds)
  }

  if (searchParams.status && searchParams.status !== 'all') {
    contactsQuery = contactsQuery.eq('status', searchParams.status)
  }

  if (searchParams.tag) {
    contactsQuery = contactsQuery.contains('tags', [searchParams.tag])
  }

  const { data: contacts, error } = await contactsQuery

  // Get leads for pipeline view
  let leadsQuery = supabase
    .from('realtor_leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (!isAdmin) {
    leadsQuery = leadsQuery.in('agent_id', teamMemberIds)
  }

  const { data: leads } = await leadsQuery

  const allContacts = contacts || []
  const allLeads = leads || []

  // Calculate stats
  const activeContacts = allContacts.filter(c => c.status === 'active').length
  const hotLeads = allLeads.filter(l => l.priority === 'high' || l.status === 'hot').length
  const newThisWeek = allContacts.filter(c => {
    const created = new Date(c.created_at)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return created > weekAgo
  }).length

  // Pipeline stages
  const pipelineStages = [
    { id: 'new', label: 'New Lead', color: 'blue', count: allLeads.filter(l => l.status === 'new').length },
    { id: 'contacted', label: 'Contacted', color: 'indigo', count: allLeads.filter(l => l.status === 'contacted').length },
    { id: 'qualified', label: 'Qualified', color: 'purple', count: allLeads.filter(l => l.status === 'qualified').length },
    { id: 'showing', label: 'Showing', color: 'amber', count: allLeads.filter(l => l.status === 'showing').length },
    { id: 'offer', label: 'Offer', color: 'orange', count: allLeads.filter(l => l.status === 'offer').length },
    { id: 'closed', label: 'Closed', color: 'emerald', count: allLeads.filter(l => l.status === 'closed').length },
  ]

  const statusFilter = searchParams.status

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CRM</h1>
          <p className="text-gray-500">
            {allContacts.length} contacts • {allLeads.length} leads in pipeline
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/crm/contacts/new"
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
          >
            <Users className="w-4 h-4 mr-2" />
            Add Contact
          </Link>
          <Link
            href="/dashboard/leads/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Contacts</p>
              <p className="text-2xl font-bold text-gray-900">{allContacts.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Hot Leads</p>
              <p className="text-2xl font-bold text-red-600">{hotLeads}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">New This Week</p>
              <p className="text-2xl font-bold text-emerald-600">{newThisWeek}</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Pipeline</p>
              <p className="text-2xl font-bold text-purple-600">{allLeads.filter(l => l.status !== 'closed' && l.status !== 'lost').length}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Funnel */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Lead Pipeline</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {pipelineStages.map((stage, index) => (
            <Link
              key={stage.id}
              href={`/dashboard/leads?status=${stage.id}`}
              className={`flex-1 min-w-[120px] p-4 rounded-xl border-2 border-dashed hover:border-solid transition cursor-pointer ${
                stage.count > 0 ? `border-${stage.color}-300 bg-${stage.color}-50` : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stage.count}</p>
                <p className="text-xs text-gray-500 mt-1">{stage.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Contacts & Hot Leads Split View */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Contacts */}
        <div className="bg-white rounded-xl border">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold text-gray-900">Recent Contacts</h2>
            <Link href="/dashboard/crm/contacts" className="text-sm text-blue-600 hover:text-blue-700">
              View All
            </Link>
          </div>
          <div className="divide-y">
            {allContacts.slice(0, 5).map((contact) => (
              <Link
                key={contact.id}
                href={`/dashboard/crm/contacts/${contact.id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">
                  {contact.full_name?.split(' ').map((n: string) => n[0]).join('') || 'C'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {contact.full_name || 'Customer'}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{contact.email}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
            ))}
            {allContacts.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No contacts yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Hot Leads */}
        <div className="bg-white rounded-xl border">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold text-gray-900">🔥 Hot Leads</h2>
            <Link href="/dashboard/leads?priority=high" className="text-sm text-blue-600 hover:text-blue-700">
              View All
            </Link>
          </div>
          <div className="divide-y">
            {allLeads.filter(l => l.priority === 'high' || l.status === 'hot').slice(0, 5).map((lead) => (
              <Link
                key={lead.id}
                href={`/dashboard/leads/${lead.id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white font-medium">
                  {lead.full_name?.[0] || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{lead.full_name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {lead.budget_max && (
                      <span>${(lead.budget_max / 1000).toFixed(0)}K budget</span>
                    )}
                    {lead.property_type && (
                      <span>• {lead.property_type}</span>
                    )}
                  </div>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                  HOT
                </span>
              </Link>
            ))}
            {allLeads.filter(l => l.priority === 'high' || l.status === 'hot').length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No hot leads</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h2 className="font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/dashboard/crm/contacts/new"
            className="flex flex-col items-center p-4 bg-white/10 rounded-xl hover:bg-white/20 transition"
          >
            <Users className="w-6 h-6 mb-2" />
            <span className="text-sm">New Contact</span>
          </Link>
          <Link
            href="/dashboard/leads/new"
            className="flex flex-col items-center p-4 bg-white/10 rounded-xl hover:bg-white/20 transition"
          >
            <Plus className="w-6 h-6 mb-2" />
            <span className="text-sm">New Lead</span>
          </Link>
          <Link
            href="/dashboard/crm/tasks"
            className="flex flex-col items-center p-4 bg-white/10 rounded-xl hover:bg-white/20 transition"
          >
            <CheckCircle className="w-6 h-6 mb-2" />
            <span className="text-sm">Tasks</span>
          </Link>
          <Link
            href="/dashboard/crm/calendar"
            className="flex flex-col items-center p-4 bg-white/10 rounded-xl hover:bg-white/20 transition"
          >
            <Calendar className="w-6 h-6 mb-2" />
            <span className="text-sm">Calendar</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
