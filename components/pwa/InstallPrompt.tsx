// =============================================================================
// INSTALL PROMPT COMPONENT
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 3:06 PM EST
// Phase 5: PWA + Offline Support
// =============================================================================

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Zap, WifiOff, Bell } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export function InstallPrompt() {
  const { isInstallable, isInstalled, promptInstall } = usePWA();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) {
      const dismissedAt = new Date(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedAt.getTime()) / (1000 * 60 * 60 * 24);
      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        setIsDismissed(true);
      }
    }
  }, []);

  useEffect(() => {
    // Show prompt after 30 seconds if installable
    if (isInstallable && !isInstalled && !isDismissed) {
      const timer = setTimeout(() => setIsVisible(true), 30000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled, isDismissed]);

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (installed) {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('pwa-prompt-dismissed', new Date().toISOString());
  };

  if (!isInstallable || isInstalled || isDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
        >
          <div className="bg-white rounded-2xl shadow-2xl border overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Download className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Install CR Realtor</h3>
                    <p className="text-sm text-indigo-100">Get the full app experience</p>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Benefits */}
            <div className="p-4">
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Smartphone className="h-5 w-5 text-indigo-500" />
                  <span className="text-sm">Works like a native app</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <WifiOff className="h-5 w-5 text-indigo-500" />
                  <span className="text-sm">Access leads offline</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Zap className="h-5 w-5 text-indigo-500" />
                  <span className="text-sm">Faster load times</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Bell className="h-5 w-5 text-indigo-500" />
                  <span className="text-sm">Push notifications for hot leads</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleDismiss}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50"
                >
                  Not Now
                </button>
                <button
                  onClick={handleInstall}
                  className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Install
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default InstallPrompt;
