// =============================================================================
// OFFLINE PAGE
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 3:02 PM EST
// Phase 5: PWA + Offline Support
// =============================================================================

import { WifiOff, RefreshCw, Home, Database, Clock } from 'lucide-react';

export const metadata = {
  title: 'Offline | CR Realtor Platform',
  description: 'You are currently offline',
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Offline Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <WifiOff className="h-12 w-12 text-gray-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">You're Offline</h1>
          <p className="text-gray-600">
            It looks like you've lost your internet connection. Don't worry - some features are still available!
          </p>
        </div>

        {/* Available Offline Features */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Available Offline</h2>
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3 text-gray-600">
              <Database className="h-5 w-5 text-green-500" />
              <span>Saved leads and contacts</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Home className="h-5 w-5 text-green-500" />
              <span>Cached property listings</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Clock className="h-5 w-5 text-green-500" />
              <span>Draft listings and notes</span>
            </div>
          </div>
        </div>

        {/* Retry Button */}
        <button
          onClick={() => window.location.reload()}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 flex items-center justify-center gap-2"
        >
          <RefreshCw className="h-5 w-5" />
          Try Again
        </button>

        {/* Tips */}
        <div className="mt-6 text-sm text-gray-500">
          <p>Your changes will sync automatically when you're back online.</p>
        </div>
      </div>
    </div>
  );
}
