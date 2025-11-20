import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Mail, Phone, Calendar, User } from 'lucide-react'

export default async function LeadsPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('assigned_to', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Lead Management</h1>

      {!leads || leads.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <h3 className="text-xl font-bold mb-2">No Leads Yet</h3>
          <p className="text-gray-600">Leads will appear here when people contact you about properties</p>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead: any) => (
            <div key={lead.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="font-semibold">{lead.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{lead.email}</span>
                    </div>
                    {lead.phone && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{lead.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  {lead.message && (
                    <p className="text-gray-700 mb-3">{lead.message}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                      {lead.status || 'new'}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <a href={`mailto:${lead.email}`} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold">
                    Reply
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}