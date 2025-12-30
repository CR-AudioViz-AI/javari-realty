// =============================================================================
// USE CONSENT HOOK
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 1:02 PM EST
// React hook for managing user consent state
// =============================================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { ConsentScope, ConsentStatus } from '@/types/attribution';

interface ConsentState {
  hasConsent: boolean;
  status: ConsentStatus;
  scopes: ConsentScope[];
  consentId: string | null;
  grantedAt: string | null;
  expiresAt: string | null;
  isLoading: boolean;
  error: string | null;
}

interface UseConsentReturn extends ConsentState {
  grantConsent: (scopes: ConsentScope[]) => Promise<boolean>;
  withdrawConsent: (reason?: string) => Promise<boolean>;
  checkConsent: () => Promise<void>;
  hasScope: (scope: ConsentScope) => boolean;
}

export function useConsent(userId: string | null, agentId: string): UseConsentReturn {
  const [state, setState] = useState<ConsentState>({
    hasConsent: false,
    status: 'pending',
    scopes: [],
    consentId: null,
    grantedAt: null,
    expiresAt: null,
    isLoading: true,
    error: null,
  });

  // Check consent status on mount and when user/agent changes
  const checkConsent = useCallback(async () => {
    if (!userId || !agentId) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(
        `/api/consent?user_id=${userId}&agent_id=${agentId}`
      );
      const data = await response.json();

      if (data.success) {
        setState({
          hasConsent: data.has_consent,
          status: data.status,
          scopes: data.scopes || [],
          consentId: data.consent_id || null,
          grantedAt: data.granted_at || null,
          expiresAt: data.expires_at || null,
          isLoading: false,
          error: null,
        });
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: data.message,
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to check consent status',
      }));
    }
  }, [userId, agentId]);

  useEffect(() => {
    checkConsent();
  }, [checkConsent]);

  // Grant consent
  const grantConsent = useCallback(
    async (scopes: ConsentScope[]): Promise<boolean> => {
      if (!userId || !agentId) return false;

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await fetch('/api/consent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            agent_id: agentId,
            scopes,
            ip_address: 'client', // Will be captured server-side
            user_agent: navigator.userAgent,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setState({
            hasConsent: true,
            status: 'granted',
            scopes,
            consentId: data.consent_id,
            grantedAt: new Date().toISOString(),
            expiresAt: data.expires_at,
            isLoading: false,
            error: null,
          });
          return true;
        } else {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: data.message,
          }));
          return false;
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Failed to grant consent',
        }));
        return false;
      }
    },
    [userId, agentId]
  );

  // Withdraw consent
  const withdrawConsent = useCallback(
    async (reason?: string): Promise<boolean> => {
      if (!userId || !state.consentId) return false;

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await fetch('/api/consent', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            consent_id: state.consentId,
            user_id: userId,
            reason,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setState({
            hasConsent: false,
            status: 'withdrawn',
            scopes: [],
            consentId: null,
            grantedAt: null,
            expiresAt: null,
            isLoading: false,
            error: null,
          });
          return true;
        } else {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: data.message,
          }));
          return false;
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Failed to withdraw consent',
        }));
        return false;
      }
    },
    [userId, state.consentId]
  );

  // Check if user has consented to specific scope
  const hasScope = useCallback(
    (scope: ConsentScope): boolean => {
      return state.scopes.includes(scope) || state.scopes.includes('all');
    },
    [state.scopes]
  );

  return {
    ...state,
    grantConsent,
    withdrawConsent,
    checkConsent,
    hasScope,
  };
}

export default useConsent;
