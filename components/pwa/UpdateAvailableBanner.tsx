// =============================================================================
// UPDATE AVAILABLE BANNER
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 3:10 PM EST
// Phase 5: PWA + Offline Support
// =============================================================================

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Sparkles, X } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { useState } from 'react';

export function UpdateAvailableBanner() {
  const { isUpdateAvailable, updateApp } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    await updateApp();
    // Page will reload automatically
  };

  if (!isUpdateAvailable || isDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50"
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-4 text-white">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span className="font-semibold">Update Available</span>
            </div>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 hover:bg-white/20 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <p className="text-sm text-indigo-100 mb-3">
            A new version is ready. Update now to get the latest features and improvements.
          </p>

          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="w-full py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isUpdating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Update Now
              </>
            )}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default UpdateAvailableBanner;
