// =============================================================================
// NURTURE SEQUENCE GENERATOR PAGE
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 2:42 PM EST
// Hero Workflow #3: AI-powered email nurture campaigns
// =============================================================================

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Sparkles,
  Users,
  Home,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronRight,
  Play,
  Pause,
  Edit,
  Copy,
  Trash2,
  BarChart3,
  Eye,
  MousePointer,
  MessageSquare,
  Loader2,
  Zap,
  ArrowRight,
} from 'lucide-react';
import {
  SequenceType,
  EmailTone,
  NurtureSequence,
  SequenceEmail,
  SEQUENCE_TEMPLATES,
  GenerateSequenceRequest,
} from '@/types/nurture-sequence';

type ViewMode = 'templates' | 'create' | 'preview' | 'manage';

export default function NurtureSequencePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSequence, setGeneratedSequence] = useState<NurtureSequence | null>(null);
  const [formData, setFormData] = useState<Partial<GenerateSequenceRequest>>({
    type: 'buyer',
    tone: 'friendly',
    email_count: 7,
    duration_days: 30,
    agent_name: '',
    agent_phone: '',
    agent_email: '',
    include_market_updates: true,
    include_listings: true,
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation (would call real API)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate demo sequence
    const demoSequence: NurtureSequence = {
      id: `seq_${Date.now()}`,
      agent_id: 'agent_demo',
      name: `${formData.type?.replace('_', ' ')} Nurture Sequence`,
      description: `AI-generated ${formData.email_count}-email sequence for ${formData.type} leads`,
      type: formData.type as SequenceType,
      status: 'draft',
      tone: formData.tone as EmailTone,
      personalization_level: 'high',
      include_market_updates: formData.include_market_updates || false,
      include_listings: formData.include_listings || false,
      include_educational_content: true,
      emails: generateDemoEmails(formData.email_count || 7, formData.type as SequenceType),
      start_delay_days: 0,
      total_duration_days: formData.duration_days || 30,
      enrolled_leads: [],
      completed_leads: [],
      stats: {
        total_enrolled: 0,
        currently_active: 0,
        completed: 0,
        unsubscribed: 0,
        emails_sent: 0,
        emails_opened: 0,
        emails_clicked: 0,
        emails_replied: 0,
        open_rate: 0,
        click_rate: 0,
        reply_rate: 0,
        unsubscribe_rate: 0,
        conversions: 0,
        conversion_rate: 0,
        best_performing_email: '',
        worst_performing_email: '',
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'agent_demo',
    };
    
    setGeneratedSequence(demoSequence);
    setIsGenerating(false);
    setViewMode('preview');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl text-white">
              <Mail className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nurture Sequence Generator</h1>
              <p className="text-gray-600">AI-powered email campaigns that convert</p>
            </div>
          </div>

          {/* View Tabs */}
          <div className="flex gap-2 mt-6">
            {[
              { id: 'templates', label: 'Templates', icon: Zap },
              { id: 'create', label: 'Create New', icon: Sparkles },
              { id: 'manage', label: 'My Sequences', icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id as ViewMode)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  viewMode === tab.id
                    ? 'bg-purple-100 text-purple-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Templates View */}
          {viewMode === 'templates' && (
            <motion.div
              key="templates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SEQUENCE_TEMPLATES.map((template) => (
                  <div
                    key={template.id}
                    className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        type: template.type,
                        tone: template.tone,
                        email_count: template.email_count,
                        duration_days: template.duration_days,
                      });
                      setSelectedTemplate(template.id);
                      setViewMode('create');
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-2 rounded-lg ${getTypeColor(template.type)}`}>
                        {getTypeIcon(template.type)}
                      </div>
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        {template.success_rate}% success
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {template.email_count} emails
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {template.duration_days} days
                      </span>
                    </div>
                    
                    <button className="mt-4 w-full py-2 bg-purple-50 text-purple-700 rounded-lg font-medium hover:bg-purple-100 transition-colors flex items-center justify-center gap-2">
                      Use Template
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Create View */}
          {viewMode === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-lg border p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Configure Your Sequence
                </h2>

                <div className="space-y-6">
                  {/* Sequence Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sequence Type</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['buyer', 'seller', 'investor', 'sphere'] as SequenceType[]).map((type) => (
                        <button
                          key={type}
                          onClick={() => setFormData({ ...formData, type })}
                          className={`p-3 rounded-lg border text-center transition-colors ${
                            formData.type === type
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex justify-center mb-1">
                            {getTypeIcon(type)}
                          </div>
                          <span className="text-xs font-medium capitalize">{type}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                    <div className="flex flex-wrap gap-2">
                      {(['professional', 'friendly', 'casual', 'luxury', 'educational'] as EmailTone[]).map((tone) => (
                        <button
                          key={tone}
                          onClick={() => setFormData({ ...formData, tone })}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            formData.tone === tone
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {tone.charAt(0).toUpperCase() + tone.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Email Count & Duration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of Emails</label>
                      <select
                        value={formData.email_count}
                        onChange={(e) => setFormData({ ...formData, email_count: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        {[3, 5, 7, 10, 12].map((n) => (
                          <option key={n} value={n}>{n} emails</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                      <select
                        value={formData.duration_days}
                        onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        {[14, 21, 30, 45, 60, 90].map((d) => (
                          <option key={d} value={d}>{d} days</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Agent Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                      <input
                        type="text"
                        value={formData.agent_name}
                        onChange={(e) => setFormData({ ...formData, agent_name: e.target.value })}
                        placeholder="Jane Smith"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Phone</label>
                      <input
                        type="tel"
                        value={formData.agent_phone}
                        onChange={(e) => setFormData({ ...formData, agent_phone: e.target.value })}
                        placeholder="(555) 123-4567"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.include_market_updates}
                        onChange={(e) => setFormData({ ...formData, include_market_updates: e.target.checked })}
                        className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-700">Include market updates</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.include_listings}
                        onChange={(e) => setFormData({ ...formData, include_listings: e.target.checked })}
                        className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-700">Include relevant listings</span>
                    </label>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <button
                    onClick={() => setViewMode('templates')}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !formData.agent_name}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        Generate Sequence
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Preview View */}
          {viewMode === 'preview' && generatedSequence && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Success Banner */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white mb-8">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="h-12 w-12" />
                  <div>
                    <h2 className="text-2xl font-bold">Sequence Generated!</h2>
                    <p className="text-green-100">
                      {generatedSequence.emails.length} emails ready for review
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Timeline */}
              <div className="bg-white rounded-2xl shadow-lg border p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Email Timeline</h3>
                
                <div className="space-y-4">
                  {generatedSequence.emails.map((email, index) => (
                    <div
                      key={email.id}
                      className="flex items-start gap-4 p-4 border rounded-xl hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{email.subject}</h4>
                          <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                            Day {email.delay_days}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{email.preview_text}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg" title="Preview">
                          <Eye className="h-4 w-4 text-gray-500" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg" title="Edit">
                          <Edit className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setGeneratedSequence(null);
                    setViewMode('create');
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit className="h-5 w-5" />
                  Edit & Regenerate
                </button>
                <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Activate Sequence
                </button>
              </div>
            </motion.div>
          )}

          {/* Manage View */}
          {viewMode === 'manage' && (
            <motion.div
              key="manage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-2xl shadow-lg border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">My Sequences</h3>
                  <button
                    onClick={() => setViewMode('templates')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Create New
                  </button>
                </div>

                {/* Empty State */}
                <div className="text-center py-12">
                  <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No sequences yet</h4>
                  <p className="text-gray-600 mb-6">Create your first AI-powered nurture sequence</p>
                  <button
                    onClick={() => setViewMode('templates')}
                    className="px-6 py-3 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Helper functions
function getTypeIcon(type: SequenceType) {
  switch (type) {
    case 'buyer': return <Home className="h-5 w-5" />;
    case 'seller': return <TrendingUp className="h-5 w-5" />;
    case 'investor': return <BarChart3 className="h-5 w-5" />;
    case 'sphere': return <Users className="h-5 w-5" />;
    default: return <Mail className="h-5 w-5" />;
  }
}

function getTypeColor(type: SequenceType) {
  switch (type) {
    case 'buyer': return 'bg-blue-100 text-blue-600';
    case 'seller': return 'bg-green-100 text-green-600';
    case 'investor': return 'bg-purple-100 text-purple-600';
    case 'sphere': return 'bg-orange-100 text-orange-600';
    default: return 'bg-gray-100 text-gray-600';
  }
}

function generateDemoEmails(count: number, type: SequenceType): SequenceEmail[] {
  const buyerEmails = [
    { subject: 'Welcome! Let\'s Find Your Dream Home', preview: 'I\'m excited to help you on your home buying journey...' },
    { subject: 'What to Know Before You Start Looking', preview: 'Here are the top 5 things every buyer should know...' },
    { subject: 'Understanding the Home Buying Process', preview: 'Let me walk you through what to expect...' },
    { subject: 'Hot New Listings in Your Area', preview: 'I just came across some properties you might love...' },
    { subject: 'Market Update: What Buyers Need to Know', preview: 'Here\'s what\'s happening in the market right now...' },
    { subject: 'Ready to Start Touring Homes?', preview: 'When you\'re ready, I\'d love to show you some homes...' },
    { subject: 'Quick Check-In on Your Home Search', preview: 'Just wanted to see how your search is going...' },
  ];

  const sellerEmails = [
    { subject: 'Thank You for Considering Me', preview: 'I appreciate the opportunity to discuss selling your home...' },
    { subject: 'Your Home\'s Market Position', preview: 'I\'ve analyzed recent sales in your area...' },
    { subject: 'How I\'ll Market Your Home', preview: 'Here\'s my proven marketing strategy...' },
    { subject: 'Preparing Your Home for Sale', preview: 'Simple tips to maximize your home\'s value...' },
    { subject: 'What to Expect During Showings', preview: 'Let me walk you through the showing process...' },
  ];

  const emails = type === 'buyer' ? buyerEmails : sellerEmails;
  
  return emails.slice(0, count).map((email, index) => ({
    id: `email_${index + 1}`,
    sequence_id: 'seq_demo',
    position: index + 1,
    subject: email.subject,
    preview_text: email.preview,
    body_html: `<p>${email.preview}</p>`,
    body_text: email.preview,
    delay_days: index === 0 ? 0 : Math.ceil((index / count) * 30),
    send_time: '09:00',
    send_days: ['tue', 'thu'],
    merge_fields: [
      { tag: '{{first_name}}', field: 'lead.first_name', fallback: 'there' },
    ],
    conditional_blocks: [],
    status: 'draft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}
