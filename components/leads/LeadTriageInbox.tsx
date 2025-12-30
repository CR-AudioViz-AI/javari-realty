// =============================================================================
// LEAD TRIAGE INBOX COMPONENT
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 2:34 PM EST
// Hero Workflow #2: AI-powered lead prioritization inbox
// =============================================================================

'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Inbox,
  Search,
  Filter,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Sparkles,
  CheckCircle2,
  Home,
  DollarSign,
  MapPin,
  Flame,
  Snowflake,
  Sun,
  Sprout,
  RefreshCw,
  X,
} from 'lucide-react';
import {
  Lead,
  LeadPriority,
  LeadStatus,
  LeadTriageFilters,
  LeadTriageStats,
  PRIORITY_CONFIG,
  STATUS_CONFIG,
} from '@/types/lead-triage';

// Demo data for illustration
const DEMO_LEADS: Lead[] = [
  {
    id: 'lead_1',
    agent_id: 'agent_demo',
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.j@email.com',
    phone: '(555) 123-4567',
    preferred_contact: 'phone',
    source: 'zillow',
    source_detail: 'Viewed 5 properties',
    intent: 'buying',
    status: 'new',
    buying_preferences: {
      min_price: 400000,
      max_price: 550000,
      bedrooms_min: 3,
      locations: ['Downtown', 'West Side'],
    },
    ai_score: 92,
    ai_priority: 'hot',
    ai_insights: {
      summary: 'Highly engaged buyer, pre-approved, looking to move within 30 days.',
      key_signals: ['Pre-approved for $525K', 'Viewed 5 properties today', 'Relocating for job'],
      recommended_actions: [
        { id: '1', action: 'Call within 5 minutes', reason: 'Hot lead with high intent', priority: 'high', type: 'call', best_time: 'Now' },
        { id: '2', action: 'Send property matches', reason: 'Based on viewing history', priority: 'high', type: 'email' },
      ],
      conversation_starters: ['Congratulations on your pre-approval!'],
      objection_handlers: [],
      predicted_conversion_probability: 78,
      predicted_timeline_days: 21,
      sentiment: 'positive',
    },
    last_activity: new Date(Date.now() - 5 * 60000).toISOString(),
    total_interactions: 8,
    email_opens: 3,
    website_visits: 12,
    properties_viewed: ['prop_1', 'prop_2', 'prop_3'],
    timeframe: 'immediate',
    pre_approved: true,
    notes: [],
    activities: [],
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 'lead_2',
    agent_id: 'agent_demo',
    first_name: 'Michael',
    last_name: 'Chen',
    email: 'mchen@company.com',
    phone: '(555) 234-5678',
    preferred_contact: 'email',
    source: 'website',
    intent: 'selling',
    status: 'contacted',
    selling_property: {
      address: '456 Oak Avenue',
      estimated_value: 680000,
      timeline: 'Spring 2025',
    },
    ai_score: 75,
    ai_priority: 'warm',
    ai_insights: {
      summary: 'Seller interested in downsizing. Timeline is flexible but motivated.',
      key_signals: ['Owns property outright', 'Considering multiple agents'],
      recommended_actions: [
        { id: '1', action: 'Schedule CMA presentation', reason: 'Show market expertise', priority: 'high', type: 'schedule' },
      ],
      conversation_starters: ['The Oak Avenue area has seen strong appreciation'],
      objection_handlers: [],
      predicted_conversion_probability: 62,
      predicted_timeline_days: 45,
      sentiment: 'neutral',
    },
    last_activity: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    total_interactions: 4,
    email_opens: 2,
    website_visits: 5,
    properties_viewed: [],
    timeframe: '3_6_months',
    notes: [],
    activities: [],
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
  },
];

export function LeadTriageInbox() {
  const [leads] = useState<Lead[]>(DEMO_LEADS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filters, setFilters] = useState<LeadTriageFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const stats: LeadTriageStats = useMemo(() => ({
    total: leads.length,
    by_priority: {
      hot: leads.filter(l => l.ai_priority === 'hot').length,
      warm: leads.filter(l => l.ai_priority === 'warm').length,
      cold: leads.filter(l => l.ai_priority === 'cold').length,
      nurture: leads.filter(l => l.ai_priority === 'nurture').length,
    },
    by_status: {
      new: leads.filter(l => l.status === 'new').length,
      contacted: leads.filter(l => l.status === 'contacted').length,
      qualified: leads.filter(l => l.status === 'qualified').length,
      showing: leads.filter(l => l.status === 'showing').length,
      offer: leads.filter(l => l.status === 'offer').length,
      closed: leads.filter(l => l.status === 'closed').length,
      lost: leads.filter(l => l.status === 'lost').length,
    },
    new_today: 0,
    needs_follow_up: leads.filter(l => l.ai_priority === 'hot').length,
    avg_response_time_hours: 2.5,
    conversion_rate: 0.18,
  }), [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      if (searchQuery) {
        const search = searchQuery.toLowerCase();
        const matchesSearch = 
          lead.first_name.toLowerCase().includes(search) ||
          lead.last_name.toLowerCase().includes(search) ||
          lead.email.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }
      if (filters.priority?.length && !filters.priority.includes(lead.ai_priority)) return false;
      if (filters.status?.length && !filters.status.includes(lead.status)) return false;
      return true;
    }).sort((a, b) => b.ai_score - a.ai_score);
  }, [leads, filters, searchQuery]);

  const formatTimeAgo = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffMs / 86400000)}d ago`;
  };

  const getPriorityIcon = (priority: LeadPriority) => {
    switch (priority) {
      case 'hot': return <Flame className="h-4 w-4 text-red-500" />;
      case 'warm': return <Sun className="h-4 w-4 text-orange-500" />;
      case 'cold': return <Snowflake className="h-4 w-4 text-blue-500" />;
      case 'nurture': return <Sprout className="h-4 w-4 text-purple-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Inbox className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Lead Triage Inbox</h1>
                <p className="text-sm text-gray-600">AI-powered lead prioritization</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <StatPill icon="🔥" label="Hot" value={stats.by_priority.hot} color="red" />
              <StatPill icon="☀️" label="Warm" value={stats.by_priority.warm} color="orange" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border p-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search leads..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 border rounded-lg flex items-center gap-2 ${showFilters ? 'bg-blue-50 border-blue-300' : 'border-gray-300'}`}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <RefreshCw className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 pt-4 border-t overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-2">
                      {(['hot', 'warm', 'cold', 'nurture'] as LeadPriority[]).map(p => (
                        <button
                          key={p}
                          onClick={() => {
                            const current = filters.priority || [];
                            setFilters({
                              ...filters,
                              priority: current.includes(p) ? current.filter(x => x !== p) : [...current, p]
                            });
                          }}
                          className={`px-3 py-1 rounded-full text-sm ${
                            filters.priority?.includes(p)
                              ? `${PRIORITY_CONFIG[p].bgColor} ${PRIORITY_CONFIG[p].color}`
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {PRIORITY_CONFIG[p].icon} {PRIORITY_CONFIG[p].label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-3">
              {filteredLeads.map((lead) => (
                <motion.div
                  key={lead.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedLead(lead)}
                  className={`bg-white rounded-xl shadow-sm border p-4 cursor-pointer hover:shadow-md ${
                    selectedLead?.id === lead.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-1 h-full min-h-[80px] rounded-full ${
                      lead.ai_priority === 'hot' ? 'bg-red-500' :
                      lead.ai_priority === 'warm' ? 'bg-orange-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{lead.first_name} {lead.last_name}</h3>
                            {getPriorityIcon(lead.ai_priority)}
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITY_CONFIG[lead.ai_priority].bgColor} ${PRIORITY_CONFIG[lead.ai_priority].color}`}>
                              {lead.ai_score}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{lead.email}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-medium ${STATUS_CONFIG[lead.status].color}`}>
                            {STATUS_CONFIG[lead.status].label}
                          </span>
                          <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(lead.last_activity)}</p>
                        </div>
                      </div>

                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Sparkles className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-blue-900">{lead.ai_insights.summary}</p>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {lead.ai_insights.key_signals.slice(0, 3).map((signal, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">{signal}</span>
                        ))}
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <button className="p-2 hover:bg-green-100 rounded-lg"><Phone className="h-4 w-4 text-green-600" /></button>
                        <button className="p-2 hover:bg-blue-100 rounded-lg"><Mail className="h-4 w-4 text-blue-600" /></button>
                        <button className="p-2 hover:bg-purple-100 rounded-lg"><MessageSquare className="h-4 w-4 text-purple-600" /></button>
                        <button className="p-2 hover:bg-orange-100 rounded-lg"><Calendar className="h-4 w-4 text-orange-600" /></button>
                        <span className="text-xs text-gray-400 ml-auto">
                          {lead.intent === 'buying' ? '🏠 Buyer' : '📋 Seller'}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {selectedLead && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-96 bg-white rounded-xl shadow-lg border overflow-hidden flex-shrink-0"
              >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(selectedLead.ai_priority)}
                      <span className="font-medium">{PRIORITY_CONFIG[selectedLead.ai_priority].label} Lead</span>
                    </div>
                    <button onClick={() => setSelectedLead(null)} className="p-1 hover:bg-white/20 rounded">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <h2 className="text-xl font-bold">{selectedLead.first_name} {selectedLead.last_name}</h2>
                  <p className="text-blue-100 text-sm">{selectedLead.email}</p>
                  {selectedLead.phone && <p className="text-blue-100 text-sm">{selectedLead.phone}</p>}
                </div>

                <div className="p-4 border-b">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">AI Score</span>
                    <span className="text-2xl font-bold text-gray-900">{selectedLead.ai_score}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${selectedLead.ai_score >= 80 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${selectedLead.ai_score}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{selectedLead.ai_insights.predicted_conversion_probability}% conversion • ~{selectedLead.ai_insights.predicted_timeline_days} days</p>
                </div>

                <div className="p-4 border-b">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    Recommended Actions
                  </h3>
                  <div className="space-y-2">
                    {selectedLead.ai_insights.recommended_actions.map((action) => (
                      <button
                        key={action.id}
                        className={`w-full text-left p-3 rounded-lg border ${action.priority === 'high' ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{action.action}</span>
                          {action.type === 'call' && <Phone className="h-4 w-4 text-green-600" />}
                          {action.type === 'email' && <Mail className="h-4 w-4 text-blue-600" />}
                          {action.type === 'schedule' && <Calendar className="h-4 w-4 text-orange-600" />}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{action.reason}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 border-b">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">🎯 Key Signals</h3>
                  <div className="space-y-1">
                    {selectedLead.ai_insights.key_signals.map((signal, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-gray-600">{signal}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedLead.buying_preferences && (
                  <div className="p-4 border-b">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">🏠 Preferences</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span>${selectedLead.buying_preferences.min_price?.toLocaleString()} - ${selectedLead.buying_preferences.max_price?.toLocaleString()}</span>
                      </div>
                      {selectedLead.buying_preferences.bedrooms_min && (
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-gray-400" />
                          <span>{selectedLead.buying_preferences.bedrooms_min}+ beds</span>
                        </div>
                      )}
                      {selectedLead.buying_preferences.locations && (
                        <div className="flex items-center gap-2 col-span-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{selectedLead.buying_preferences.locations.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">📊 Engagement</h3>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-gray-50 rounded">
                      <p className="text-lg font-bold text-gray-900">{selectedLead.total_interactions}</p>
                      <p className="text-xs text-gray-500">Interactions</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <p className="text-lg font-bold text-gray-900">{selectedLead.email_opens}</p>
                      <p className="text-xs text-gray-500">Opens</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <p className="text-lg font-bold text-gray-900">{selectedLead.properties_viewed.length}</p>
                      <p className="text-xs text-gray-500">Properties</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function StatPill({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    red: 'bg-red-100 text-red-700',
    orange: 'bg-orange-100 text-orange-700',
  };
  return (
    <div className={`px-3 py-1.5 rounded-full flex items-center gap-2 ${colors[color]}`}>
      <span>{icon}</span>
      <span className="font-medium">{value}</span>
      <span className="text-sm opacity-75">{label}</span>
    </div>
  );
}

export default LeadTriageInbox;
