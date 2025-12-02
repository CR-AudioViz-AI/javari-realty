'use client';

import { useState } from 'react';
import { 
  Zap, Mail, MessageSquare, Clock, Play, Pause,
  Plus, Edit2, Copy, ChevronRight, Users, BarChart2,
  CheckCircle, Calendar, Sparkles
} from 'lucide-react';

interface AutomationSequence {
  id: string;
  name: string;
  description: string;
  trigger: string;
  status: 'active' | 'paused' | 'draft';
  steps: Array<{ id: string; type: string; delay_days: number; content: string; }>;
  stats: { enrolled: number; completed: number; replied: number; };
}

const DEMO_SEQUENCES: AutomationSequence[] = [
  { id: '1', name: 'New Lead Welcome Series', description: 'Automatically nurture new leads with a 7-day email sequence', trigger: 'new_lead', status: 'active',
    steps: [
      { id: 's1', type: 'email', delay_days: 0, content: 'Welcome email' },
      { id: 's2', type: 'wait', delay_days: 2, content: 'Wait 2 days' },
      { id: 's3', type: 'email', delay_days: 0, content: 'Follow-up email' },
      { id: 's4', type: 'task', delay_days: 5, content: 'Call lead' },
    ], stats: { enrolled: 156, completed: 89, replied: 34 } },
  { id: '2', name: 'Showing Follow-Up', description: 'Follow up after property showings', trigger: 'showing_request', status: 'active',
    steps: [
      { id: 's1', type: 'email', delay_days: 0, content: 'Thank you email' },
      { id: 's2', type: 'sms', delay_days: 1, content: 'Quick text' },
    ], stats: { enrolled: 78, completed: 65, replied: 42 } },
  { id: '3', name: 'Re-Engagement Campaign', description: 'Re-engage cold leads after 30 days', trigger: 'no_activity', status: 'paused',
    steps: [
      { id: 's1', type: 'email', delay_days: 30, content: 'Re-engagement email' },
      { id: 's2', type: 'wait', delay_days: 7, content: 'Wait 7 days' },
      { id: 's3', type: 'email', delay_days: 0, content: 'New listings email' },
    ], stats: { enrolled: 234, completed: 45, replied: 12 } },
];

export default function AutomationPage() {
  const [sequences, setSequences] = useState<AutomationSequence[]>(DEMO_SEQUENCES);
  const [activeTab, setActiveTab] = useState<'sequences' | 'templates' | 'analytics'>('sequences');

  const toggleSequenceStatus = (id: string) => {
    setSequences(prev => prev.map(seq => seq.id === id ? { ...seq, status: seq.status === 'active' ? 'paused' : 'active' } : seq));
  };

  const duplicateSequence = (sequence: AutomationSequence) => {
    setSequences(prev => [...prev, { ...sequence, id: Date.now().toString(), name: `${sequence.name} (Copy)`, status: 'draft', stats: { enrolled: 0, completed: 0, replied: 0 } }]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="w-7 h-7 text-yellow-500" />Marketing Automation
          </h1>
          <p className="text-gray-600">Automate your follow-ups and nurture leads while you sleep</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          <Plus className="w-5 h-5" />Create Sequence
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg"><Play className="w-6 h-6 text-green-600" /></div>
            <div><p className="text-2xl font-bold">{sequences.filter(s => s.status === 'active').length}</p><p className="text-sm text-gray-600">Active Sequences</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg"><Users className="w-6 h-6 text-blue-600" /></div>
            <div><p className="text-2xl font-bold">{sequences.reduce((sum, s) => sum + s.stats.enrolled, 0)}</p><p className="text-sm text-gray-600">Total Enrolled</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg"><Mail className="w-6 h-6 text-purple-600" /></div>
            <div><p className="text-2xl font-bold">{sequences.reduce((sum, s) => sum + s.stats.completed, 0)}</p><p className="text-sm text-gray-600">Completed</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg"><MessageSquare className="w-6 h-6 text-yellow-600" /></div>
            <div><p className="text-2xl font-bold">{sequences.reduce((sum, s) => sum + s.stats.replied, 0)}</p><p className="text-sm text-gray-600">Replies</p></div>
          </div>
        </div>
      </div>

      <div className="border-b mb-6">
        <div className="flex gap-6">
          {[{ id: 'sequences', label: 'Sequences', icon: Zap }, { id: 'templates', label: 'Templates', icon: Mail }, { id: 'analytics', label: 'Analytics', icon: BarChart2 }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>
              <tab.icon className="w-4 h-4" />{tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'sequences' && (
        <div className="space-y-4">
          {sequences.map(sequence => (
            <div key={sequence.id} className="bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${sequence.status === 'active' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                      <Zap className={`w-6 h-6 ${sequence.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg text-gray-900">{sequence.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sequence.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{sequence.status}</span>
                      </div>
                      <p className="text-gray-600 mt-1">{sequence.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span>{sequence.steps.length} steps</span><span>•</span><span>Trigger: {sequence.trigger.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleSequenceStatus(sequence.id)} className={`p-2 rounded-lg ${sequence.status === 'active' ? 'text-yellow-600 hover:bg-yellow-50' : 'text-green-600 hover:bg-green-50'}`}>
                      {sequence.status === 'active' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-5 h-5" /></button>
                    <button onClick={() => duplicateSequence(sequence)} className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg"><Copy className="w-5 h-5" /></button>
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-400" /><span className="text-sm"><strong>{sequence.stats.enrolled}</strong> enrolled</span></div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-gray-400" /><span className="text-sm"><strong>{sequence.stats.completed}</strong> completed</span></div>
                  <div className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-gray-400" /><span className="text-sm"><strong>{sequence.stats.replied}</strong> replied</span></div>
                  <div className="ml-auto text-sm text-gray-500">{Math.round((sequence.stats.replied / sequence.stats.enrolled) * 100) || 0}% reply rate</div>
                </div>
                <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
                  {sequence.steps.map((step, i) => (
                    <div key={step.id} className="flex items-center">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                        step.type === 'email' ? 'bg-blue-100 text-blue-700' : step.type === 'sms' ? 'bg-green-100 text-green-700' : step.type === 'task' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                        {step.type === 'email' && <Mail className="w-3 h-3" />}
                        {step.type === 'sms' && <MessageSquare className="w-3 h-3" />}
                        {step.type === 'task' && <CheckCircle className="w-3 h-3" />}
                        {step.type === 'wait' && <Clock className="w-3 h-3" />}
                        {step.type === 'wait' ? `Wait ${step.delay_days}d` : step.type.toUpperCase()}
                      </div>
                      {i < sequence.steps.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300 mx-1" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="bg-white rounded-xl border p-6 text-center py-12">
          <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Email Templates</h3>
          <p className="text-gray-600">Create reusable email templates for your sequences</p>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-white rounded-xl border p-6 text-center py-12">
          <BarChart2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
          <p className="text-gray-600">Detailed automation analytics coming soon</p>
        </div>
      )}

      <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm"><Sparkles className="w-5 h-5 text-purple-600" /></div>
          <div>
            <h4 className="font-medium text-gray-900">AI Suggestion</h4>
            <p className="text-sm text-gray-600 mt-1">Based on your data, leads who receive a follow-up within 5 minutes are <strong>21x more likely</strong> to convert. Consider adding instant SMS to your New Lead sequence.</p>
            <button className="text-sm text-purple-600 font-medium mt-2 hover:underline">Apply Suggestion →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
