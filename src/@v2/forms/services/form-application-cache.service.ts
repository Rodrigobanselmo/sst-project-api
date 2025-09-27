import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheEnum } from '@/shared/constants/enum/cache';

@Injectable()
export class FormApplicationCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  /**
   * Invalidate cache for a specific form application
   * This should be called whenever a form application is created, updated, or deleted
   */
  async invalidateFormApplicationCache(applicationId: string): Promise<void> {
    // Get all cache keys that match the pattern for this application
    const cacheKeyPattern = `${CacheEnum.PUBLIC_FORM_APPLICATION}_${applicationId}`;

    // Since cache-manager doesn't have a built-in pattern deletion,
    // we'll delete the most common cache keys
    const keysToDelete = [
      `${cacheKeyPattern}`,
      // Add more specific patterns if needed
    ];

    // Delete all matching cache entries
    await Promise.all(keysToDelete.map((key) => this.cacheManager.del(key)));
  }
}
