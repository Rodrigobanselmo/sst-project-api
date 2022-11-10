import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { FetchESocialBatchEventsService } from '../../services/events/all/fetch-batch-events/fetch-batch-events.service';

@Injectable()
export class EsocialFetchBatchCron {
  constructor(
    private readonly fetchESocialBatchEventsService: FetchESocialBatchEventsService,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleCron() {
    this.fetchESocialBatchEventsService.execute();
  }
}
