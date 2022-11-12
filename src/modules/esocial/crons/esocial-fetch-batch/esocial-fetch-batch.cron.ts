import { CacheEnum } from './../../../../shared/constants/enum/cache';
import { ICacheEventBatchType } from './../../../../shared/interfaces/cache.types';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Cache } from 'cache-manager';

import { FetchESocialBatchEventsService } from '../../services/events/all/fetch-batch-events/fetch-batch-events.service';

@Injectable()
export class EsocialFetchBatchCron {
  private index = 0;
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly fetchESocialBatchEventsService: FetchESocialBatchEventsService,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleCron() {
    const shouldSkip: ICacheEventBatchType | null = await this.cacheManager.get(
      CacheEnum.ESOCIAL_FETCH_EVENT,
    );

    if (!shouldSkip) {
      console.log('FETCH NEXT');
      this.index++;
      if (this.index % 2 == 0) {
        console.log('FETCH ESOCIAL');

        const cacheValue: ICacheEventBatchType = true;
        await this.cacheManager.set(
          CacheEnum.ESOCIAL_FETCH_EVENT,
          cacheValue,
          360,
        );
        return;
        await this.fetchESocialBatchEventsService.execute();
      }
    }
  }
}
