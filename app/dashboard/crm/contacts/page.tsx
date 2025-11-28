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
  Star,
  Tag,
  ChevronRight,
  Building2,
  Calendar,
  MoreHorizontal,
} from 'lucide-react'

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: { status?: string; tag?: string; type?: string }
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

  let teamMemberIds: string[] = [user.id]
  if (profile.organization_id) {
    const { data: team } = await supabase
      .from('profiles')
      .select('id')
      .eq('organization_id', profile.organization_id)
    if (team) teamMemberIds = team.map(m => m.id)
  }

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

  if (searchParams.type && searchParams.type !== 'all') {
    contactsQuery = contactsQuery.eq('contact_type', searchParams.type)
  }

  const { data: contacts } = await contactsQuery

  const allContacts = contacts || []
  
  const buyers = allContacts.filter(c => c.contact_type === 'buyer').length
  const sellers = allContacts.filter(c => c.contact_type === 'seller').length
  const investors = allContacts.filter(c => c.contact_type === 'investor').length
  const vendors = allContacts.filter(c => c.contact_type === 'vendor').length

  const typeFilter = searchParams.type

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/dashboard/crm" className="hover:text-blue-600">CRM</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Contacts</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-500">{allContacts.length} total contacts</p>
        </div>
        <Link
          href="/dashboard/crm/contacts/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </Link>
      </div>

      {/* Type Filters */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/dashboard/crm/contacts"
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            !typeFilter || typeFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({allContacts.length})
        </Link>
        <Link
          href="/dashboard/crm/contacts?type=buyer"
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            typeFilter === 'buyer'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Buyers ({buyers})
        </Link>
        <Link
          href="/dashboard/crm/contacts?type=seller"
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            typeFilter === 'seller'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Sellers ({sellers})
        </Link>
        <Link
          href="/dashboard/crm/contacts?type=investor"
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            typeFilter === 'investor'
              ? 'bg-amber-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Investors ({investors})
        </Link>
        <Link
          href="/dashboard/crm/contacts?type=vendor"
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            typeFilter === 'vendor'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Vendors ({vendors})
        </Link>
      </div>

      {/* Contacts Grid */}
      {allContacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allContacts.map((contact) => (
            <Link
              key={contact.id}
              href={`/dashboard/crm/contacts/${contact.id}`}
              className="bg-white rounded-xl border p-4 hover:shadow-md transition group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {contact.first_name?.[0]}{contact.last_name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition">
                      {contact.first_name} {contact.last_name}
                    </h3>
                    {contact.is_favorite && (
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    )}
                  </div>
                  <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full mt-1 ${
                    contact.contact_type === 'buyer' ? 'bg-emerald-100 text-emerald-700' :
                    contact.contact_type === 'seller' ? 'bg-purple-100 text-purple-700' :
                    contact.contact_type === 'investor' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {contact.contact_type || 'Contact'}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-500">
                {contact.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{contact.phone}</span>
                  </div>
                )}
                {(contact.city || contact.state) && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{[contact.city, contact.state].filter(Boolean).join(', ')}</span>
                  </div>
                )}
              </div>

              {contact.tags && contact.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {contact.tags.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                  {contact.tags.length > 3 && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{contact.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {contact.last_contact_date && (
                <div className="mt-3 pt-3 border-t flex items-center gap-2 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  Last contact: {new Date(contact.last_contact_date).toLocaleDateString()}
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Contacts Yet</h3>
          <p className="text-gray-500 mb-6">Add your first contact to start building your network.</p>
          <Link
            href="/dashboard/crm/contacts/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Link>
        </div>
      )}
    </div>
  )
}
