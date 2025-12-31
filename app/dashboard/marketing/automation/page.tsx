'use client';

import React, { useState, useEffect } from 'react';
import { AutomationRule, MessageTemplate, HOLIDAYS, DEFAULT_TEMPLATES } from '@/types/marketing';

export default function MarketingAutomationPage() {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'rules' | 'templates' | 'history'>('rules');
  const [showAddRule, setShowAddRule] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [rulesRes, templatesRes] = await Promise.all([
        fetch('/api/marketing/automation/rules'),
        fetch('/api/marketing/automation/templates'),
      ]);
      
      if (rulesRes.ok) setRules((await rulesRes.json()).rules || []);
      if (templatesRes.ok) setTemplates((await templatesRes.json()).templates || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRule = async (ruleId: string, isActive: boolean) => {
    try {
      await fetch(`/api/marketing/automation/rules/${ruleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: isActive }),
      });
      setRules(rules.map(r => r.id === ruleId ? { ...r, is_active: isActive } : r));
    } catch (error) {
      console.error('Error toggling rule:', error);
    }
  };

  const setupDefaultRules = async () => {
    try {
      await fetch('/api/marketing/automation/setup-defaults', { method: 'POST' });
      await loadData();
    } catch (error) {
      console.error('Error setting up defaults:', error);
    }
  };

  const automationTypes = [
    { id: 'birthday', icon: '🎂', label: 'Birthday Messages', desc: 'Auto-send birthday wishes to clients' },
    { id: 'home_anniversary', icon: '🏠', label: 'Home Anniversary', desc: 'Celebrate purchase anniversaries' },
    { id: 'holiday', icon: '🎄', label: 'Holiday Greetings', desc: 'Seasonal holiday messages' },
    { id: 'market_update', icon: '📊', label: 'Market Updates', desc: 'Quarterly market reports' },
    { id: 'refinance_opportunity', icon: '📉', label: 'Refinance Alerts', desc: 'When rates drop significantly' },
    { id: 'home_value_update', icon: '📈', label: 'Home Value Updates', desc: 'Notify of value changes' },
    { id: 'check_in', icon: '👋', label: 'Check-In Messages', desc: 'Periodic relationship nurturing' },
    { id: 'referral_request', icon: '🤝', label: 'Referral Requests', desc: 'Ask for referrals after transactions' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📬 Marketing Automation</h1>
            <p className="text-gray-600">Set it and forget it - stay connected automatically</p>
          </div>
          {rules.length === 0 && (
            <button
              onClick={setupDefaultRules}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              + Setup Recommended Automations
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          {['rules', 'templates', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`pb-3 px-1 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'rules' ? '⚙️ Automation Rules' : tab === 'templates' ? '📝 Templates' : '📋 History'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : (
          <>
            {/* Automation Rules Tab */}
            {activeTab === 'rules' && (
              <div className="space-y-4">
                {automationTypes.map((type) => {
                  const rule = rules.find(r => r.type === type.id);
                  return (
                    <div key={type.id} className="bg-white rounded-xl shadow-sm p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{type.icon}</span>
                          <div>
                            <h3 className="font-semibold text-gray-900">{type.label}</h3>
                            <p className="text-sm text-gray-500">{type.desc}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {rule ? (
                            <>
                              <span className={`text-sm px-2 py-1 rounded ${
                                rule.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                              }`}>
                                {rule.is_active ? 'Active' : 'Paused'}
                              </span>
                              <button
                                onClick={() => toggleRule(rule.id, !rule.is_active)}
                                className={`w-12 h-6 rounded-full transition-colors ${
                                  rule.is_active ? 'bg-indigo-600' : 'bg-gray-300'
                                }`}
                              >
                                <span className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                                  rule.is_active ? 'translate-x-6' : 'translate-x-0.5'
                                }`} />
                              </button>
                              <button className="text-indigo-600 hover:text-indigo-800">
                                Edit
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setShowAddRule(true)}
                              className="px-3 py-1.5 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50"
                            >
                              + Setup
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {rule && rule.is_active && (
                        <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Send via:</span>
                            <span className="ml-2 font-medium">
                              {rule.send_via.map(s => s === 'email' ? '📧' : s === 'sms' ? '📱' : '🔔').join(' ')}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Trigger:</span>
                            <span className="ml-2 font-medium capitalize">{rule.trigger.replace('_', ' ')}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Template:</span>
                            <span className="ml-2 font-medium">
                              {templates.find(t => t.id === rule.template_id)?.name || 'Default'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Templates Tab */}
            {activeTab === 'templates' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div key={template.id} className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded capitalize">
                          {template.type.replace('_', ' ')}
                        </span>
                      </div>
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm">
                        Edit
                      </button>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm">
                      <p className="font-medium text-gray-700 mb-1">Subject: {template.subject}</p>
                      <p className="text-gray-600 line-clamp-3">{template.body}</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {template.variables.map(v => (
                        <span key={v} className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded">
                          {`{{${v}}}`}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                <button className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
                  <span className="text-3xl mb-2">➕</span>
                  <span className="font-medium text-gray-600">Create New Template</span>
                </button>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Recipient</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Subject</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        No messages sent yet. Enable automations to start sending!
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Info Box */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-semibold text-blue-900">How Marketing Automation Works</h3>
              <p className="text-sm text-blue-700 mt-1">
                Once you set up automations, messages are sent automatically based on your rules.
                Birthday wishes go out on birthdays, home anniversaries celebrate purchase dates,
                and holiday greetings arrive right on time. You stay top-of-mind without lifting a finger.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
