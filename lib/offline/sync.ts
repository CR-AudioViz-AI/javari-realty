// =============================================================================
// OFFLINE SYNC SERVICE
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 3:16 PM EST
// Phase 5: PWA + Offline Support
// =============================================================================

import { offlineStorage, STORES } from './storage';

type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

interface SyncResult {
  store: string;
  synced: number;
  failed: number;
  errors: string[];
}

class OfflineSyncService {
  private status: SyncStatus = 'idle';
  private listeners: Set<(status: SyncStatus) => void> = new Set();

  /**
   * Get current sync status
   */
  getStatus(): SyncStatus {
    return this.status;
  }

  /**
   * Subscribe to sync status changes
   */
  subscribe(listener: (status: SyncStatus) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of status change
   */
  private setStatus(status: SyncStatus) {
    this.status = status;
    this.listeners.forEach((listener) => listener(status));
  }

  /**
   * Sync all unsynced data when back online
   */
  async syncAll(): Promise<SyncResult[]> {
    if (this.status === 'syncing') return [];
    
    this.setStatus('syncing');
    const results: SyncResult[] = [];

    try {
      // Sync leads
      results.push(await this.syncStore('leads', '/api/leads'));
      
      // Sync listings
      results.push(await this.syncStore('listings', '/api/listings'));
      
      // Sync drafts (save to server)
      results.push(await this.syncStore('drafts', '/api/drafts'));

      this.setStatus('success');
      
      // Reset to idle after 3 seconds
      setTimeout(() => this.setStatus('idle'), 3000);
    } catch (error) {
      console.error('[Sync] Failed:', error);
      this.setStatus('error');
    }

    return results;
  }

  /**
   * Sync a specific store
   */
  private async syncStore(storeName: keyof typeof STORES, endpoint: string): Promise<SyncResult> {
    const result: SyncResult = {
      store: storeName,
      synced: 0,
      failed: 0,
      errors: [],
    };

    try {
      const unsynced = await offlineStorage.getUnsynced(storeName);
      
      for (const item of unsynced) {
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
          });

          if (response.ok) {
            await offlineStorage.markSynced(storeName, (item as { id: string }).id);
            result.synced++;
          } else {
            result.failed++;
            result.errors.push(`Failed to sync ${(item as { id: string }).id}: ${response.statusText}`);
          }
        } catch (error) {
          result.failed++;
          result.errors.push(`Error syncing ${(item as { id: string }).id}: ${String(error)}`);
        }
      }
    } catch (error) {
      result.errors.push(`Error reading store ${storeName}: ${String(error)}`);
    }

    return result;
  }

  /**
   * Register background sync (if supported)
   */
  async registerBackgroundSync(tag: string): Promise<boolean> {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await (registration as ServiceWorkerRegistration & { sync: { register: (tag: string) => Promise<void> } }).sync.register(tag);
        console.log('[Sync] Background sync registered:', tag);
        return true;
      } catch (error) {
        console.error('[Sync] Background sync registration failed:', error);
        return false;
      }
    }
    return false;
  }

  /**
   * Handle online event - trigger sync
   */
  handleOnline = async () => {
    console.log('[Sync] Back online, syncing...');
    await this.syncAll();
  };

  /**
   * Initialize sync service
   */
  init() {
    if (typeof window === 'undefined') return;

    // Listen for online events
    window.addEventListener('online', this.handleOnline);

    // Initial sync if online
    if (navigator.onLine) {
      this.syncAll();
    }
  }

  /**
   * Cleanup
   */
  destroy() {
    if (typeof window === 'undefined') return;
    window.removeEventListener('online', this.handleOnline);
  }
}

// Export singleton
export const syncService = new OfflineSyncService();

export default syncService;
