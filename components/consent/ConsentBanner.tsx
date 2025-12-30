// =============================================================================
// CONSENT BANNER COMPONENT
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 12:57 PM EST
// Addresses: CRITICAL LEGAL RISK - Hidden Agent Attribution
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronDown, ChevronUp, X, Check, Info } from 'lucide-react';
import { ConsentScope, ConsentBannerConfig } from '@/types/attribution';

interface ConsentBannerProps {
  agentId: string;
  agentName: string;
  agencyName?: string;
  onConsent: (scopes: ConsentScope[]) => Promise<void>;
  onDecline: () => void;
  config?: Partial<ConsentBannerConfig>;
}

const DEFAULT_CONFIG: ConsentBannerConfig = {
  title: 'Your Privacy Matters',
  description: 'We use cookies and similar technologies to provide you with a better experience. Your real estate agent can track your property interests to serve you better, but only with your permission.',
  privacy_policy_url: '/privacy',
  terms_url: '/terms',
  scopes: [
    {
      scope: 'attribution',
      label: 'Agent Attribution',
      description: 'Allow your agent to see which properties you view and track your journey to better assist you.',
      required: false,
      default_checked: true,
    },
    {
      scope: 'marketing',
      label: 'Personalized Recommendations',
      description: 'Receive property recommendations based on your browsing history and preferences.',
      required: false,
      default_checked: true,
    },
    {
      scope: 'analytics',
      label: 'Usage Analytics',
      description: 'Help us improve our platform by sharing anonymous usage data.',
      required: false,
      default_checked: true,
    },
  ],
  buttons: {
    accept_all: 'Accept All',
    accept_selected: 'Accept Selected',
    decline_all: 'Decline All',
    manage_preferences: 'Manage Preferences',
  },
};

export function ConsentBanner({
  agentId,
  agentName,
  agencyName,
  onConsent,
  onDecline,
  config = {},
}: ConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedScopes, setSelectedScopes] = useState<Set<ConsentScope>>(new Set());
  
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  useEffect(() => {
    // Check if consent has already been given
    const existingConsent = localStorage.getItem(`consent_${agentId}`);
    if (!existingConsent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [agentId]);

  useEffect(() => {
    // Initialize selected scopes based on defaults
    const defaultScopes = new Set<ConsentScope>();
    mergedConfig.scopes.forEach((scope) => {
      if (scope.default_checked || scope.required) {
        defaultScopes.add(scope.scope);
      }
    });
    setSelectedScopes(defaultScopes);
  }, []);

  const handleScopeToggle = (scope: ConsentScope, required: boolean) => {
    if (required) return; // Can't toggle required scopes
    
    setSelectedScopes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(scope)) {
        newSet.delete(scope);
      } else {
        newSet.add(scope);
      }
      return newSet;
    });
  };

  const handleAcceptAll = async () => {
    setIsSubmitting(true);
    const allScopes = mergedConfig.scopes.map((s) => s.scope);
    try {
      await onConsent(allScopes);
      localStorage.setItem(`consent_${agentId}`, JSON.stringify({
        scopes: allScopes,
        timestamp: new Date().toISOString(),
      }));
      setIsVisible(false);
    } catch (error) {
      console.error('Consent error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptSelected = async () => {
    setIsSubmitting(true);
    const scopes = Array.from(selectedScopes);
    try {
      await onConsent(scopes);
      localStorage.setItem(`consent_${agentId}`, JSON.stringify({
        scopes,
        timestamp: new Date().toISOString(),
      }));
      setIsVisible(false);
    } catch (error) {
      console.error('Consent error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = () => {
    localStorage.setItem(`consent_${agentId}`, JSON.stringify({
      scopes: [],
      declined: true,
      timestamp: new Date().toISOString(),
    }));
    onDecline();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      >
        <div className="mx-auto max-w-4xl rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6" />
                <h2 className="text-lg font-semibold">{mergedConfig.title}</h2>
              </div>
              <button
                onClick={handleDecline}
                className="rounded-full p-1 hover:bg-white/20 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {/* Agent Info */}
            <div className="mb-4 flex items-center gap-3 rounded-lg bg-blue-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                {agentName.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{agentName}</p>
                {agencyName && (
                  <p className="text-sm text-gray-600">{agencyName}</p>
                )}
              </div>
              <div className="ml-auto">
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                  <Check className="h-3 w-3" /> Verified Agent
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {mergedConfig.description}
            </p>

            {/* Expandable Preferences */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors mb-4"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Hide Preferences
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  {mergedConfig.buttons.manage_preferences}
                </>
              )}
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3 mb-4 border-t border-gray-100 pt-4">
                    {mergedConfig.scopes.map((scopeConfig) => (
                      <label
                        key={scopeConfig.scope}
                        className={`flex items-start gap-3 rounded-lg border p-3 transition-colors cursor-pointer ${
                          selectedScopes.has(scopeConfig.scope)
                            ? 'border-blue-300 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${scopeConfig.required ? 'opacity-75' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedScopes.has(scopeConfig.scope)}
                          onChange={() => handleScopeToggle(scopeConfig.scope, scopeConfig.required)}
                          disabled={scopeConfig.required}
                          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{scopeConfig.label}</span>
                            {scopeConfig.required && (
                              <span className="text-xs text-gray-500">(Required)</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-0.5">{scopeConfig.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Legal Links */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
              <a
                href={mergedConfig.privacy_policy_url}
                className="hover:text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              <a
                href={mergedConfig.terms_url}
                className="hover:text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>
              <span className="flex items-center gap-1">
                <Info className="h-3 w-3" />
                You can change these settings anytime
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDecline}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                {mergedConfig.buttons.decline_all}
              </button>
              {isExpanded && (
                <button
                  onClick={handleAcceptSelected}
                  className="flex-1 rounded-lg border border-blue-300 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : mergedConfig.buttons.accept_selected}
                </button>
              )}
              <button
                onClick={handleAcceptAll}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : mergedConfig.buttons.accept_all}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ConsentBanner;
