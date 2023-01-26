import { Cache } from 'cache-manager';

export class CacheProvider {
  private ttlSeconds: number;
  private cacheManager: Cache;

  constructor(options: { ttlSeconds: number; cacheManager: Cache }) {
    this.ttlSeconds = options.ttlSeconds;
    this.cacheManager = options.cacheManager;
  }

  async funcResponse<T>(logger: () => T, key: string, ttlSeconds?: number) {
    const foundData = await this.cacheManager.get<T>(key);
    if (foundData) return foundData;

    const response = await logger();

    await this.cacheManager.set(key, response, ttlSeconds || this.ttlSeconds);
    return response;
  }

  async clean(key: string) {
    await this.cacheManager.del(key);
  }
}
