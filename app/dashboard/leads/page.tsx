import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, Mail, Phone, Calendar, Plus, Search, Filter, ArrowRight } from 'lucide-react'

export default async function LeadsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_admin')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin' || profile?.is_admin

  // Get all leads (admin sees all, agents see all for now - can filter later)
  const { data: leads } = await supabase
    .from('realtor_leads')
    .select('*')
    .order('created_at', { ascending: false })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700'
      case 'contacted': return 'bg-amber-100 text-amber-700'
      case 'qualified': return 'bg-emerald-100 text-emerald-700'
      case 'proposal': return 'bg-purple-100 text-purple-700'
      case 'converted': return 'bg-green-100 text-green-700'
      case 'lost': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200'
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'low': return 'bg-gray-50 text-gray-600 border-gray-200'
      default: return 'bg-gray-50 text-gray-600 border-gray-200'
    }
  }

  const newLeads = leads?.filter(l => l.status === 'new').length || 0
  const contactedLeads = leads?.filter(l => l.status === 'contacted').length || 0
  const qualifiedLeads = leads?.filter(l => l.status === 'qualified').length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-500">{leads?.length || 0} total leads</p>
        </div>
        <Link
          href="/dashboard/leads/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">New</p>
          <p className="text-2xl font-bold text-blue-600">{newLeads}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Contacted</p>
          <p className="text-2xl font-bold text-amber-600">{contactedLeads}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Qualified</p>
          <p className="text-2xl font-bold text-emerald-600">{qualifiedLeads}</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="px-4 py-2.5 bg-white border rounded-xl hover:bg-gray-50 transition flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          Filter
        </button>
      </div>

      {/* Leads List */}
      {!leads || leads.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Leads Yet</h3>
          <p className="text-gray-600">Leads will appear here when potential buyers contact you</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="divide-y">
            {leads.map((lead) => (
              <Link
                key={lead.id}
                href={`/dashboard/leads/${lead.id}`}
                className="block p-4 hover:bg-gray-50 transition group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {lead.full_name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition">
                          {lead.full_name}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(lead.priority)}`}>
                          {lead.priority}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {lead.email && (
                          <span className="flex items-center gap-1 truncate">
                            <Mail className="w-3.5 h-3.5" />
                            {lead.email}
                          </span>
                        )}
                        {lead.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            {lead.phone}
                          </span>
                        )}
                      </div>
                      
                      {lead.notes && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-1">
                          {lead.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-400">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
