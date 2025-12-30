// =============================================================================
// PRIVACY SETTINGS PAGE
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 1:04 PM EST
// User-facing page to view and manage consent preferences
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  Eye, 
  Target, 
  BarChart3, 
  AlertTriangle,
  Check,
  X,
  ExternalLink,
  Clock,
  Download,
  Trash2
} from 'lucide-react';
import { ConsentScope } from '@/types/attribution';

interface ConsentRecord {
  id: string;
  agent_id: string;
  agent_name?: string;
  agency_name?: string;
  scope: ConsentScope[];
  status: string;
  granted_at: string | null;
  expires_at: string | null;
}

export default function PrivacySettingsPage() {
  const router = useRouter();
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConsent, setSelectedConsent] = useState<string | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState('');

  useEffect(() => {
    fetchConsents();
  }, []);

  const fetchConsents = async () => {
    try {
      const response = await fetch('/api/user/consents');
      const data = await response.json();
      if (data.success) {
        setConsents(data.consents);
      }
    } catch (error) {
      console.error('Failed to fetch consents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!selectedConsent) return;

    try {
      const response = await fetch('/api/consent', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consent_id: selectedConsent,
          reason: withdrawReason,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setConsents(consents.map(c => 
          c.id === selectedConsent ? { ...c, status: 'withdrawn' } : c
        ));
        setShowWithdrawModal(false);
        setSelectedConsent(null);
        setWithdrawReason('');
      }
    } catch (error) {
      console.error('Failed to withdraw consent:', error);
    }
  };

  const handleExportData = async () => {
    try {
      const response = await fetch('/api/user/data-export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my-data-export.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  const handleDeleteAllData = async () => {
    if (!confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      return;
    }

    try {
      await fetch('/api/user/data-deletion', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Failed to delete data:', error);
    }
  };

  const scopeIcons: Record<ConsentScope, React.ReactNode> = {
    attribution: <Eye className="h-5 w-5" />,
    marketing: <Target className="h-5 w-5" />,
    analytics: <BarChart3 className="h-5 w-5" />,
    all: <Shield className="h-5 w-5" />,
  };

  const scopeLabels: Record<ConsentScope, string> = {
    attribution: 'Agent Attribution',
    marketing: 'Marketing & Recommendations',
    analytics: 'Usage Analytics',
    all: 'All Permissions',
  };

  const scopeDescriptions: Record<ConsentScope, string> = {
    attribution: 'Your agent can see which properties you view and track your home search journey.',
    marketing: 'Receive personalized property recommendations based on your preferences.',
    analytics: 'Help us improve the platform with anonymous usage data.',
    all: 'All of the above permissions.',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Privacy Settings</h1>
              <p className="text-gray-600">Manage your data and consent preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Your Rights Section */}
        <section className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Privacy Rights</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <Check className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Access Your Data</p>
                <p className="text-sm text-gray-600">View all data we have about you</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <Check className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Data Portability</p>
                <p className="text-sm text-gray-600">Export your data anytime</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <Check className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Withdraw Consent</p>
                <p className="text-sm text-gray-600">Change your mind at any time</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <Check className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Right to Deletion</p>
                <p className="text-sm text-gray-600">Request complete data removal</p>
              </div>
            </div>
          </div>
        </section>

        {/* Active Consents */}
        <section className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Agent Consents</h2>
          
          {consents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>You haven't granted consent to any agents yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {consents.map((consent) => (
                <div
                  key={consent.id}
                  className={`border rounded-lg p-4 ${
                    consent.status === 'granted' ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        consent.status === 'granted' ? 'bg-green-100' : 'bg-gray-200'
                      }`}>
                        <Shield className={`h-5 w-5 ${
                          consent.status === 'granted' ? 'text-green-600' : 'text-gray-500'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {consent.agent_name || 'Real Estate Agent'}
                        </p>
                        {consent.agency_name && (
                          <p className="text-sm text-gray-600">{consent.agency_name}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        consent.status === 'granted' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {consent.status.charAt(0).toUpperCase() + consent.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Granted Scopes */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {consent.scope.map((scope) => (
                      <span
                        key={scope}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-md text-sm text-gray-700 border"
                      >
                        {scopeIcons[scope]}
                        {scopeLabels[scope]}
                      </span>
                    ))}
                  </div>

                  {/* Dates and Actions */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {consent.granted_at && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Granted: {new Date(consent.granted_at).toLocaleDateString()}
                        </span>
                      )}
                      {consent.expires_at && (
                        <span>
                          Expires: {new Date(consent.expires_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    
                    {consent.status === 'granted' && (
                      <button
                        onClick={() => {
                          setSelectedConsent(consent.id);
                          setShowWithdrawModal(true);
                        }}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Withdraw Consent
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Data Actions */}
        <section className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={handleExportData}
              className="flex items-center gap-3 p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-left"
            >
              <Download className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Export My Data</p>
                <p className="text-sm text-gray-600">Download all your data as JSON</p>
              </div>
            </button>
            
            <button
              onClick={handleDeleteAllData}
              className="flex items-center gap-3 p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-left"
            >
              <Trash2 className="h-6 w-6 text-red-600" />
              <div>
                <p className="font-medium text-gray-900">Delete All Data</p>
                <p className="text-sm text-gray-600">Permanently remove your data</p>
              </div>
            </button>
          </div>
        </section>

        {/* Privacy Policy Link */}
        <section className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Legal Documents</h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="/privacy"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <ExternalLink className="h-4 w-4" />
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <ExternalLink className="h-4 w-4" />
              Terms of Service
            </a>
            <a
              href="/ccpa"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <ExternalLink className="h-4 w-4" />
              CCPA Notice
            </a>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-gray-100 rounded-xl p-6 text-center">
          <p className="text-gray-600">
            Questions about your privacy?{' '}
            <a href="mailto:privacy@craudiovizai.com" className="text-blue-600 hover:underline">
              privacy@craudiovizai.com
            </a>
          </p>
        </section>
      </div>

      {/* Withdraw Consent Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 text-amber-600 mb-4">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-lg font-semibold">Withdraw Consent</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Are you sure you want to withdraw your consent? Your agent will no longer 
              be able to see your property viewing activity.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason (optional)
              </label>
              <textarea
                value={withdrawReason}
                onChange={(e) => setWithdrawReason(e.target.value)}
                placeholder="Let us know why you're withdrawing consent..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowWithdrawModal(false);
                  setSelectedConsent(null);
                  setWithdrawReason('');
                }}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Withdraw Consent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
