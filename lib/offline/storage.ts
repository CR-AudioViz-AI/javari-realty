// =============================================================================
// OFFLINE STORAGE UTILITY
// CR AudioViz AI - Realtor Platform
// Created: Monday, December 30, 2025 | 3:14 PM EST
// Phase 5: PWA + Offline Support
// =============================================================================

const DB_NAME = 'cr-realtor-offline';
const DB_VERSION = 1;

interface OfflineStore {
  leads: 'leads';
  listings: 'listings';
  properties: 'properties';
  searches: 'searches';
  drafts: 'drafts';
}

const STORES: OfflineStore = {
  leads: 'leads',
  listings: 'listings',
  properties: 'properties',
  searches: 'searches',
  drafts: 'drafts',
};

class OfflineStorage {
  private db: IDBDatabase | null = null;
  private isInitialized = false;

  /**
   * Initialize IndexedDB
   */
  async init(): Promise<void> {
    if (this.isInitialized || typeof indexedDB === 'undefined') return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        console.log('[OfflineStorage] Initialized');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        Object.values(STORES).forEach((storeName) => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: 'id' });
            store.createIndex('updatedAt', 'updatedAt', { unique: false });
            store.createIndex('synced', 'synced', { unique: false });
          }
        });
      };
    });
  }

  /**
   * Get all items from a store
   */
  async getAll<T>(storeName: keyof OfflineStore): Promise<T[]> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * Get a single item by ID
   */
  async get<T>(storeName: keyof OfflineStore, id: string): Promise<T | undefined> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * Save an item (create or update)
   */
  async save<T extends { id: string }>(storeName: keyof OfflineStore, item: T): Promise<void> {
    await this.ensureInitialized();

    const itemWithMeta = {
      ...item,
      updatedAt: new Date().toISOString(),
      synced: false,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(itemWithMeta);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Delete an item
   */
  async delete(storeName: keyof OfflineStore, id: string): Promise<void> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Get unsynced items
   */
  async getUnsynced<T>(storeName: keyof OfflineStore): Promise<T[]> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index('synced');
      const request = index.getAll(IDBKeyRange.only(false));

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * Mark item as synced
   */
  async markSynced(storeName: keyof OfflineStore, id: string): Promise<void> {
    const item = await this.get(storeName, id);
    if (item) {
      await this.save(storeName, { ...(item as { id: string }), synced: true });
    }
  }

  /**
   * Clear a store
   */
  async clear(storeName: keyof OfflineStore): Promise<void> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Get storage usage
   */
  async getUsage(): Promise<{ usage: number; quota: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0,
      };
    }
    return { usage: 0, quota: 0 };
  }

  /**
   * Ensure database is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.init();
    }
  }
}

// Export singleton
export const offlineStorage = new OfflineStorage();

// Export store names
export { STORES };

// Convenience functions
export const saveLeadOffline = <T extends { id: string }>(lead: T) => 
  offlineStorage.save('leads', lead);

export const getOfflineLeads = <T>() => 
  offlineStorage.getAll<T>('leads');

export const saveListingOffline = <T extends { id: string }>(listing: T) => 
  offlineStorage.save('listings', listing);

export const getOfflineListings = <T>() => 
  offlineStorage.getAll<T>('listings');

export const saveDraftOffline = <T extends { id: string }>(draft: T) => 
  offlineStorage.save('drafts', draft);

export const getOfflineDrafts = <T>() => 
  offlineStorage.getAll<T>('drafts');

export default offlineStorage;
