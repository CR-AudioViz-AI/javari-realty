// =============================================================================
// ONLINE STATUS INDICATOR
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 3:08 PM EST
// Phase 5: PWA + Offline Support
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export function OnlineStatusIndicator() {
  const { isOnline } = usePWA();
  const [showBanner, setShowBanner] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowBanner(true);
      setWasOffline(true);
    } else if (wasOffline) {
      // Show "back online" briefly
      setShowBanner(true);
      const timer = setTimeout(() => {
        setShowBanner(false);
        setWasOffline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className={`fixed top-0 left-0 right-0 z-50 py-2 px-4 text-center text-sm font-medium ${
            isOnline
              ? 'bg-green-500 text-white'
              : 'bg-amber-500 text-white'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {isOnline ? (
              <>
                <Wifi className="h-4 w-4" />
                <span>You're back online! Syncing changes...</span>
                <RefreshCw className="h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4" />
                <span>You're offline. Some features may be limited.</span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default OnlineStatusIndicator;
