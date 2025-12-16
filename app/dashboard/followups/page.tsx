'use client'

import { useState } from 'react'
import {
  Bell, Calendar, Clock, Mail, Phone, MessageSquare,
  CheckCircle, AlertCircle, Plus, Filter, Search,
  ChevronRight, Settings, Zap, RefreshCw, User,
  Home, Star, ArrowRight, Play, Pause
} from 'lucide-react'

interface FollowUp {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string
  type: 'lead' | 'showing' | 'offer' | 'closing' | 'anniversary' | 'birthday'
  action: 'email' | 'call' | 'text' | 'task'
  subject: string
  dueDate: string
  dueTime?: string
  status: 'pending' | 'completed' | 'overdue' | 'snoozed'
  priority: 'high' | 'medium' | 'low'
  automated: boolean
  template?: string
  notes?: string
}

interface Workflow {
  id: string
  name: string
  trigger: string
  actions: string[]
  active: boolean
  clientsEnrolled: number
}

const SAMPLE_FOLLOWUPS: FollowUp[] = [
  {
    id: '1',
    clientName: 'Sarah Johnson',
    clientEmail: 'sarah@email.com',
    clientPhone: '(239) 555-0101',
    type: 'showing',
    action: 'email',
    subject: 'Thank you for viewing 2850 Winkler Ave',
    dueDate: '2024-12-14',
    dueTime: '09:00',
    status: 'pending',
    priority: 'high',
    automated: true,
    template: 'post_showing_followup'
  },
  {
    id: '2',
    clientName: 'Mike Chen',
    clientEmail: 'mike@email.com',
    clientPhone: '(239) 555-0102',
    type: 'lead',
    action: 'call',
    subject: '48-hour lead follow-up call',
    dueDate: '2024-12-14',
    dueTime: '14:00',
    status: 'pending',
    priority: 'high',
    automated: false
  },
  {
    id: '3',
    clientName: 'The Rodriguez Family',
    clientEmail: 'rodriguez@email.com',
    clientPhone: '(239) 555-0103',
    type: 'offer',
    action: 'email',
    subject: 'Offer status update',
    dueDate: '2024-12-15',
    status: 'pending',
    priority: 'medium',
    automated: true,
    template: 'offer_status_update'
  },
  {
    id: '4',
    clientName: 'David Williams',
    clientEmail: 'david@email.com',
    clientPhone: '(239) 555-0104',
    type: 'closing',
    action: 'task',
    subject: 'Schedule final walkthrough',
    dueDate: '2024-12-18',
    status: 'pending',
    priority: 'high',
    automated: false
  },
  {
    id: '5',
    clientName: 'Jennifer Adams',
    clientEmail: 'jennifer@email.com',
    clientPhone: '(239) 555-0105',
    type: 'anniversary',
    action: 'email',
    subject: '1-year home anniversary card',
    dueDate: '2024-12-20',
    status: 'pending',
    priority: 'low',
    automated: true,
    template: 'home_anniversary'
  },
  {
    id: '6',
    clientName: 'Tom Wilson',
    clientEmail: 'tom@email.com',
    clientPhone: '(239) 555-0106',
    type: 'lead',
    action: 'email',
    subject: 'Initial inquiry response',
    dueDate: '2024-12-13',
    status: 'overdue',
    priority: 'high',
    automated: true,
    template: 'new_lead_response'
  }
]

const SAMPLE_WORKFLOWS: Workflow[] = [
  {
    id: '1',
    name: 'New Lead Nurture',
    trigger: 'New lead added',
    actions: ['Immediate welcome email', '24hr follow-up call reminder', '3-day check-in email', '7-day market update'],
    active: true,
    clientsEnrolled: 12
  },
  {
    id: '2',
    name: 'Post-Showing Sequence',
    trigger: 'Showing completed',
    actions: ['Same-day thank you email', '2-day feedback request', '5-day similar listings email'],
    active: true,
    clientsEnrolled: 8
  },
  {
    id: '3',
    name: 'Under Contract Updates',
    trigger: 'Offer accepted',
    actions: ['Milestone email at each step', 'Weekly status update', 'Closing countdown reminders'],
    active: true,
    clientsEnrolled: 3
  },
  {
    id: '4',
    name: 'Past Client Touch',
    trigger: 'Annual anniversary',
    actions: ['Home anniversary email', 'Market value update', 'Referral request'],
    active: true,
    clientsEnrolled: 45
  },
  {
    id: '5',
    name: 'Birthday Greetings',
    trigger: 'Client birthday',
    actions: ['Birthday email with personal note'],
    active: false,
    clientsEnrolled: 0
  }
]

export default function FollowUpsPage() {
  const [followUps] = useState<FollowUp[]>(SAMPLE_FOLLOWUPS)
  const [workflows, setWorkflows] = useState<Workflow[]>(SAMPLE_WORKFLOWS)
  const [activeTab, setActiveTab] = useState<'tasks' | 'workflows'>('tasks')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')

  const filteredFollowUps = followUps.filter(f => {
    const matchesStatus = filterStatus === 'all' || f.status === filterStatus
    const matchesType = filterType === 'all' || f.type === filterType
    return matchesStatus && matchesType
  }).sort((a, b) => {
    // Sort by status (overdue first) then by date
    if (a.status === 'overdue' && b.status !== 'overdue') return -1
    if (b.status === 'overdue' && a.status !== 'overdue') return 1
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })

  const overdueCount = followUps.filter(f => f.status === 'overdue').length
  const todayCount = followUps.filter(f => f.dueDate === '2024-12-14' && f.status === 'pending').length
  const automatedCount = followUps.filter(f => f.automated).length

  const toggleWorkflow = (id: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === id ? { ...w, active: !w.active } : w
    ))
  }

  const getStatusBadge = (status: FollowUp['status']) => {
    const styles = {
      pending: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      snoozed: 'bg-gray-100 text-gray-800'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getPriorityDot = (priority: FollowUp['priority']) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-amber-500',
      low: 'bg-green-500'
    }
    return <span className={`w-2 h-2 rounded-full ${colors[priority]}`} />
  }

  const getActionIcon = (action: FollowUp['action']) => {
    const icons = {
      email: <Mail size={16} />,
      call: <Phone size={16} />,
      text: <MessageSquare size={16} />,
      task: <CheckCircle size={16} />
    }
    return icons[action]
  }

  const getTypeIcon = (type: FollowUp['type']) => {
    const icons = {
      lead: <User size={16} className="text-blue-500" />,
      showing: <Home size={16} className="text-purple-500" />,
      offer: <Star size={16} className="text-amber-500" />,
      closing: <CheckCircle size={16} className="text-green-500" />,
      anniversary: <Calendar size={16} className="text-pink-500" />,
      birthday: <Star size={16} className="text-red-500" />
    }
    return icons[type]
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bell className="text-blue-600" /> Follow-Up Center
          </h1>
          <p className="text-gray-600 mt-1">Never miss a follow-up with automated reminders</p>
        </div>
        
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus size={18} /> Add Follow-Up
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {overdueCount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="text-red-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-red-600">Overdue</p>
                <p className="text-2xl font-bold text-red-700">{overdueCount}</p>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="text-amber-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Due Today</p>
              <p className="text-2xl font-bold">{todayCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">This Week</p>
              <p className="text-2xl font-bold">{followUps.filter(f => f.status === 'pending').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Zap className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Automated</p>
              <p className="text-2xl font-bold">{automatedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'tasks' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white border hover:bg-gray-50'
          }`}
        >
          Follow-Up Tasks
        </button>
        <button
          onClick={() => setActiveTab('workflows')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'workflows' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white border hover:bg-gray-50'
          }`}
        >
          Automated Workflows
        </button>
      </div>

      {activeTab === 'tasks' ? (
        <>
          {/* Filters */}
          <div className="bg-white rounded-xl border p-4 mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="all">All Types</option>
                <option value="lead">Lead</option>
                <option value="showing">Showing</option>
                <option value="offer">Offer</option>
                <option value="closing">Closing</option>
                <option value="anniversary">Anniversary</option>
              </select>
            </div>
          </div>

          {/* Follow-Up List */}
          <div className="space-y-3">
            {filteredFollowUps.map(followUp => (
              <div 
                key={followUp.id} 
                className={`bg-white rounded-xl border p-4 hover:shadow-md transition-shadow ${
                  followUp.status === 'overdue' ? 'border-red-300 bg-red-50/50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Priority & Type */}
                  <div className="flex items-center gap-2">
                    {getPriorityDot(followUp.priority)}
                    {getTypeIcon(followUp.type)}
                  </div>

                  {/* Main Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{followUp.clientName}</span>
                      {followUp.automated && (
                        <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                          <Zap size={10} /> Auto
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{followUp.subject}</p>
                  </div>

                  {/* Action Type */}
                  <div className="flex items-center gap-2 text-gray-500">
                    {getActionIcon(followUp.action)}
                    <span className="text-sm capitalize">{followUp.action}</span>
                  </div>

                  {/* Due Date */}
                  <div className="text-right min-w-[100px]">
                    <p className={`text-sm font-medium ${followUp.status === 'overdue' ? 'text-red-600' : ''}`}>
                      {new Date(followUp.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    {followUp.dueTime && (
                      <p className="text-xs text-gray-500">{followUp.dueTime}</p>
                    )}
                  </div>

                  {/* Status */}
                  {getStatusBadge(followUp.status)}

                  {/* Actions */}
                  <div className="flex gap-1">
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-green-600" title="Mark Complete">
                      <CheckCircle size={18} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500" title="Snooze">
                      <Clock size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Workflows Tab */
        <div className="space-y-4">
          {workflows.map(workflow => (
            <div key={workflow.id} className="bg-white rounded-xl border p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg">{workflow.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      workflow.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {workflow.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Trigger: {workflow.trigger} • {workflow.clientsEnrolled} clients enrolled
                  </p>
                </div>
                <button
                  onClick={() => toggleWorkflow(workflow.id)}
                  className={`p-2 rounded-lg ${
                    workflow.active 
                      ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {workflow.active ? <Pause size={20} /> : <Play size={20} />}
                </button>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                {workflow.actions.map((action, idx) => (
                  <div key={idx} className="flex items-center">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm">
                      {action}
                    </span>
                    {idx < workflow.actions.length - 1 && (
                      <ArrowRight className="text-gray-300 mx-1" size={16} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button className="w-full bg-gray-50 border-2 border-dashed rounded-xl p-6 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors flex items-center justify-center gap-2">
            <Plus size={20} />
            Create New Workflow
          </button>
        </div>
      )}

      {/* Pro Tips */}
      <div className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <Zap /> Automation Tips
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-100">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="font-semibold text-white mb-1">Speed to Lead</p>
            <p>Respond to new leads within 5 minutes for 9x higher conversion</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="font-semibold text-white mb-1">Consistent Touch</p>
            <p>Contact past clients at least 4x per year to stay top of mind</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="font-semibold text-white mb-1">Multi-Channel</p>
            <p>Use email, calls, and texts together for 3x response rate</p>
          </div>
        </div>
      </div>
    </div>
  )
}
