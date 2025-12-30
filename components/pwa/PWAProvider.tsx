// =============================================================================
// PWA PROVIDER
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 3:40 PM EST
// Wraps app with PWA components
// =============================================================================

'use client';

import { useEffect } from 'react';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import { OnlineStatusIndicator } from '@/components/pwa/OnlineStatusIndicator';
import { UpdateAvailableBanner } from '@/components/pwa/UpdateAvailableBanner';
import { syncService } from '@/lib/offline/sync';

interface PWAProviderProps {
  children: React.ReactNode;
}

export function PWAProvider({ children }: PWAProviderProps) {
  // Initialize sync service on mount
  useEffect(() => {
    syncService.init();
    return () => syncService.destroy();
  }, []);

  return (
    <>
      <OnlineStatusIndicator />
      {children}
      <InstallPrompt />
      <UpdateAvailableBanner />
    </>
  );
}

export default PWAProvider;
