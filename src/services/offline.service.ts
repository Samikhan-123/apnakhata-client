import Dexie, { Table } from 'dexie';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import { handleApiError } from '@/lib/error-handler';

export interface PendingRequest {
  id?: number;
  url: string;
  method: string;
  data: any;
  headers: any;
  timestamp: number;
  retryCount: number;
}

export class OfflineDatabase extends Dexie {
  syncQueue!: Table<PendingRequest>;

  constructor() {
    super('ApnaKhataOfflineDB');
    this.version(2).stores({
      syncQueue: '++id, timestamp, retryCount'
    });
  }
}

export const db = new OfflineDatabase();

const MAX_RETRIES = 2; // User requested max 2 tries

export const offlineService = {
  async addToQueue(request: Omit<PendingRequest, 'timestamp' | 'retryCount'>) {
    try {
      await db.syncQueue.add({
        ...request,
        timestamp: Date.now(),
        retryCount: 0
      });
      logger.debug('Request queued for offline sync', request.url);
    } catch (error) {
      logger.error('Failed to add to offline queue', error);
    }
  },

  async processQueue(apiInstance: any) {
    const pendingRequests = await db.syncQueue.toArray();
    if (pendingRequests.length === 0) return;

    const syncToastId = 'sync-status';
    toast.loading(`Syncing ${pendingRequests.length} pending changes...`, { id: syncToastId });

    let successCount = 0;
    let failCount = 0;

    for (const request of pendingRequests) {
      try {
        await apiInstance({
          url: request.url,
          method: request.method,
          data: request.data,
          headers: request.headers,
          _isSyncRequest: true 
        });
        
        await db.syncQueue.delete(request.id!);
        successCount++;
      } catch (error: any) {
        const status = error.response?.status;
        const { message: errorMessage } = handleApiError(error, { silent: true });

        if (status >= 400 && status < 500) {
          // Permanent failure - notify user and drop from queue
          toast.error(`One item failed to sync: ${errorMessage}`, {
            description: `${request.method.toUpperCase()} ${request.url} was rejected by server.`,
            duration: 6000
          });
          await db.syncQueue.delete(request.id!);
          failCount++;
        } else {
          // Transient failure (5xx or Network)
          const newRetryCount = (request.retryCount || 0) + 1;
          
          if (newRetryCount >= MAX_RETRIES) {
            toast.error(`Sync abandoned for one item after ${MAX_RETRIES} attempts.`, {
              description: `The server is not responding. Please check your data manually.`,
            });
            await db.syncQueue.delete(request.id!);
            failCount++;
          } else {
            await db.syncQueue.update(request.id!, { retryCount: newRetryCount });
          }
        }
      }
    }

    // Final summary
    if (successCount > 0) {
      toast.success(`Sync complete! ${successCount} changes updated.`, { id: syncToastId });
    } else if (failCount > 0) {
      toast.error(`Sync finished with ${failCount} errors.`, { id: syncToastId });
    } else {
      toast.dismiss(syncToastId);
    }
  },

  async getQueueSize() {
    return await db.syncQueue.count();
  }
};
