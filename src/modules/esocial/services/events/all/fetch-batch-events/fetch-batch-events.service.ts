import { UpdateESocialReportService } from './../../../../../company/services/report/update-esocial-report/update-esocial-report.service';
import { asyncEach } from './../../../../../../shared/utils/asyncEach';
import { ICacheEventBatchType } from './../../../../../../shared/interfaces/cache.types';
import { CacheEnum } from 'src/shared/constants/enum/cache';
import {
  IEsocialFetchBatch,
  IEsocialSendBatchResponse,
} from '../../../../interfaces/esocial';
import {
  IESocialSendEventOptions,
  IESocialXmlStruck2220,
} from '../../../../../../shared/providers/ESocialProvider/models/IESocialMethodProvider';
import { getCompanyName } from '../../../../../../shared/utils/companyName';
import { CreateESocialEvent } from '../../../../dto/esocial-batch.dto';
import { ESocialBatchRepository } from '../../../../repositories/implementations/ESocialBatchRepository';
import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import JSZip from 'jszip';
import { Readable } from 'stream';
import format from 'xml-formatter';

import { UserPayloadDto } from '../../../../../../shared/dto/user-payload.dto';
import { ESocialEventProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider';
import { ESocialMethodsProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialMethodsProvider';
import { CompanyRepository } from '../../../../../company/repositories/implementations/CompanyRepository';
import { EmployeeExamsHistoryRepository } from '../../../../../company/repositories/implementations/EmployeeExamsHistoryRepository';
import { EmployeeRepository } from '../../../../../company/repositories/implementations/EmployeeRepository';
import { Event2220Dto } from '../../../../dto/event.dto';
import { EmployeeESocialEventTypeEnum, StatusEnum } from '@prisma/client';
import { DayJSProvider } from '../../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { CompanyReportRepository } from '../../../../../company/repositories/implementations/CompanyReportRepository';
import { Client } from 'nestjs-soap';
import { Cache } from 'cache-manager';
import { SoapClientEnum } from '../../../../../../shared/constants/enum/soapClient';
import { arrayChunks } from '../../../../../../shared/utils/arrayChunks';
import { ESocialEventRepository } from '../../../../../../modules/esocial/repositories/implementations/ESocialEventRepository';
import { removeDuplicate } from '../../../../../../shared/utils/removeDuplicate';

@Injectable()
export class FetchESocialBatchEventsService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly eSocialEventProvider: ESocialEventProvider,
    private readonly employeeExamHistoryRepository: EmployeeExamsHistoryRepository,
    private readonly eSocialBatchRepository: ESocialBatchRepository,
    private readonly eSocialEventRepository: ESocialEventRepository,
    private readonly updateESocialReportService: UpdateESocialReportService,
  ) {}

  async execute() {
    const shouldSkip: ICacheEventBatchType | null = await this.cacheManager.get(
      CacheEnum.ESOCIAL_FETCH_EVENT,
    );

    let isInProgress = false;

    if (!shouldSkip) {
      const batches = await this.eSocialBatchRepository.findNude({
        where: {
          events: { some: { status: 'PROCESSING' } },
          status: 'DONE',
          // protocolId: { not: null },
        },
        select: {
          id: true,
          protocolId: true,
          response: true,
          environment: true,
        },
        orderBy: { created_at: 'desc' },
      });

      await asyncEach(arrayChunks(batches, 20), async (batchChunk) => {
        await Promise.all(
          batchChunk.map(async (batch) => {
            let response: IEsocialFetchBatch.Response;
            try {
              const batchResponse =
                await this.eSocialEventProvider.fetchEventToESocial(batch);

              response = batchResponse.response;
              const status = batchResponse.response?.status;
              const inProgress = status?.cdResposta == '101';

              if (inProgress) {
                isInProgress = true;
                return;
              }

              const rejectedBatch = !['101', '201', '202'].includes(
                status?.cdResposta,
              );

              if (rejectedBatch) throw new Error('Erro ao consultar lote');
              response = undefined;

              const eventsResponse =
                batchResponse.response?.retornoEventos?.evento;

              const eventsResponseArray = Array.isArray(eventsResponse)
                ? eventsResponse
                : [eventsResponse];

              await Promise.all(
                eventsResponseArray.map(async (eventResponse) => {
                  try {
                    const id = eventResponse.attributes.Id;
                    const event =
                      eventResponse?.retornoEvento?.eSocial?.retornoEvento;

                    const process = event?.processamento;
                    const inProgress = process?.cdResposta == '101';

                    if (inProgress) {
                      isInProgress = true;
                      return;
                    }

                    const rejectedEvent = !['101', '201', '202'].includes(
                      status?.cdResposta,
                    );

                    if (rejectedEvent) {
                      await this.eSocialEventRepository.updateManyNude({
                        where: { eventId: id },
                        data: {
                          status: 'DONE',
                          response: eventResponse as any,
                        },
                      });
                    }
                  } catch (err) {
                    console.log('error on process event', err);
                  }
                }),
              );
            } catch (err) {
              await this.eSocialBatchRepository.updateNude({
                where: { id: batch.id },
                select: {},
                data: {
                  response: response as any,
                  status: 'INVALID',
                },
              });

              await this.eSocialEventRepository.updateManyNude({
                where: { batchId: { in: batchChunk.map((batch) => batch.id) } },
                data: {
                  status: 'ERROR',
                  response: response?.status || err?.message.slice(0, 500),
                  //! set null other events to 2240 // 2210 ...
                  eventId: null,
                },
              });

              await this.employeeExamHistoryRepository.updateManyNude({
                where: {
                  event: {
                    batchId: { in: batchChunk.map((batch) => batch.id) },
                  },
                },
                data: { sendEvent: true },
              });
              // reject batch, to be send again
            }
          }),
        );
      });

      // update companies esocial report
      await Promise.all(
        removeDuplicate(batches, { removeById: 'companyId' }).map(
          async (batch) => {
            const companyId = batch.companyId;
            await this.updateESocialReportService.execute({ companyId });
          },
        ),
      );

      return;

      if (!isInProgress) {
        const cacheValue: ICacheEventBatchType = true;
        await this.cacheManager.set(
          CacheEnum.ESOCIAL_FETCH_EVENT,
          cacheValue,
          360,
        );
      }
    }

    return;
  }
}
