import { PrismaService } from '../../../../../../prisma/prisma.service';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { ESocialEventRepository } from '../../../../repositories/implementations/ESocialEventRepository';
import { ESocialEventProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider';
import { arrayChunks } from '../../../../../../shared/utils/arrayChunks';
import { removeDuplicate } from '../../../../../../shared/utils/removeDuplicate';
import { EmployeeExamsHistoryRepository } from '../../../../../company/repositories/implementations/EmployeeExamsHistoryRepository';
import { IEsocialFetchBatch } from '../../../../interfaces/esocial';
import { ESocialBatchRepository } from '../../../../repositories/implementations/ESocialBatchRepository';
import { CacheEnum } from '../../../../../../shared/constants/enum/cache';
import { ICacheEventBatchType } from '../../../../../../shared/interfaces/cache.types';
import { asyncEach } from '../../../../../../shared/utils/asyncEach';
import { UpdateESocialReportService } from '../../../../../company/services/report/update-esocial-report/update-esocial-report.service';

@Injectable()
export class FetchOneESocialBatchEventsService {
  constructor(private readonly eSocialEventProvider: ESocialEventProvider) {}

  async execute(protoId: string) {
    const batchResponse = await this.eSocialEventProvider.fetchEventToESocial({ protocolId: protoId } as any);

    return batchResponse;
  }
}
