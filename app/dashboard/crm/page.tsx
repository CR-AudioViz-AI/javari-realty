import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Users, UserPlus, Phone, Mail, MapPin, Search, Filter, Star,
  Clock, CheckCircle, AlertCircle, TrendingUp, Calendar, Home,
  DollarSign, Tag, ChevronRight, Building2, Target, Briefcase
} from 'lucide-react'

export default async function CRMDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // Get leads
  const { data: leads, count: leadsCount } = await supabase
    .from('realtor_leads')
    .select('*', { count: 'exact' })
    .eq('realtor_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Get customers
  const { data: customers, count: customersCount } = await supabase
    .from('realtor_customers')
    .select('*', { count: 'exact' })
    .eq('assigned_agent_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Get contacts
  const { data: contacts, count: contactsCount } = await supabase
    .from('contacts')
    .select('*', { count: 'exact' })
    .eq('agent_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const hotLeads = leads?.filter(l => l.status === 'hot' || l.priority === 'high').length || 0
  const activeCustomers = customers?.filter(c => c.status === 'active').length || 0

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">CRM Dashboard</h1>
          <p className="text-gray-600">Manage all your relationships in one place</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/leads/new">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <UserPlus size={18} /> New Lead
            </button>
          </Link>
          <Link href="/dashboard/customers">
            <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
              <Users size={18} /> Add Customer
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Leads</p>
              <p className="text-2xl font-bold">{leadsCount || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingUp className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Hot Leads</p>
              <p className="text-2xl font-bold">{hotLeads}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Customers</p>
              <p className="text-2xl font-bold">{activeCustomers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Briefcase className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">All Contacts</p>
              <p className="text-2xl font-bold">{contactsCount || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads Column */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold flex items-center gap-2">
              <Target size={18} className="text-blue-600" /> Recent Leads
            </h2>
            <Link href="/dashboard/leads" className="text-blue-600 text-sm hover:underline">View All</Link>
          </div>
          <div className="divide-y max-h-96 overflow-y-auto">
            {leads && leads.length > 0 ? leads.slice(0, 5).map((lead: any) => (
              <div key={lead.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{lead.full_name || lead.name}</p>
                    <p className="text-sm text-gray-500">{lead.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    lead.status === 'hot' ? 'bg-red-100 text-red-800' :
                    lead.status === 'warm' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {lead.status || 'new'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{formatDate(lead.created_at)}</p>
              </div>
            )) : (
              <div className="p-8 text-center text-gray-500">
                <Target className="mx-auto mb-2 text-gray-400" size={32} />
                <p>No leads yet</p>
                <Link href="/dashboard/leads/new" className="text-blue-600 text-sm">Add your first lead</Link>
              </div>
            )}
          </div>
        </div>

        {/* Customers Column */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold flex items-center gap-2">
              <Users size={18} className="text-green-600" /> Active Customers
            </h2>
            <Link href="/dashboard/customers" className="text-blue-600 text-sm hover:underline">View All</Link>
          </div>
          <div className="divide-y max-h-96 overflow-y-auto">
            {customers && customers.length > 0 ? customers.slice(0, 5).map((customer: any) => (
              <div key={customer.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{customer.full_name}</p>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {customer.status || 'active'}
                  </span>
                </div>
                {customer.budget_max && (
                  <p className="text-xs text-gray-500 mt-1">
                    Budget: ${(customer.budget_min || 0).toLocaleString()} - ${customer.budget_max.toLocaleString()}
                  </p>
                )}
              </div>
            )) : (
              <div className="p-8 text-center text-gray-500">
                <Users className="mx-auto mb-2 text-gray-400" size={32} />
                <p>No customers yet</p>
                <Link href="/dashboard/customers" className="text-blue-600 text-sm">Invite a customer</Link>
              </div>
            )}
          </div>
        </div>

        {/* Contacts Column */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold flex items-center gap-2">
              <Briefcase size={18} className="text-purple-600" /> All Contacts
            </h2>
            <Link href="/dashboard/crm/contacts" className="text-blue-600 text-sm hover:underline">View All</Link>
          </div>
          <div className="divide-y max-h-96 overflow-y-auto">
            {contacts && contacts.length > 0 ? contacts.slice(0, 5).map((contact: any) => (
              <div key={contact.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{contact.first_name} {contact.last_name}</p>
                    <p className="text-sm text-gray-500">{contact.email}</p>
                  </div>
                  {contact.tags && contact.tags.length > 0 && (
                    <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                      {contact.tags[0]}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">{contact.company || contact.phone}</p>
              </div>
            )) : (
              <div className="p-8 text-center text-gray-500">
                <Briefcase className="mx-auto mb-2 text-gray-400" size={32} />
                <p>No contacts yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow border p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/leads/new">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <UserPlus size={18} /> Add Lead
            </button>
          </Link>
          <Link href="/dashboard/customers">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Users size={18} /> Invite Customer
            </button>
          </Link>
          <Link href="/dashboard/messages">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Mail size={18} /> Send Message
            </button>
          </Link>
          <Link href="/dashboard/calendar">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Calendar size={18} /> Schedule
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
