import { CacheEnum } from './../../../../../../shared/constants/enum/cache';
import { ICacheEventBatchType } from './../../../../../../shared/interfaces/cache.types';
import { UpdateESocialReportService } from './../../../../../company/services/report/update-esocial-report/update-esocial-report.service';
import { IEsocialSendBatchResponse } from './../../../../interfaces/esocial';
import {
  IESocialSendEventOptions,
  IESocialXmlStruck2220,
} from './../../../../../../shared/providers/ESocialProvider/models/IESocialMethodProvider';
import { getCompanyName } from './../../../../../../shared/utils/companyName';
import { CreateESocialEvent } from './../../../../dto/esocial-batch.dto';
import { ESocialBatchRepository } from './../../../../repositories/implementations/ESocialBatchRepository';
import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import JSZip from 'jszip';
import fs from 'fs';
import { Readable } from 'stream';
import format from 'xml-formatter';

import { UserPayloadDto } from '../../../../../../shared/dto/user-payload.dto';
import { ESocialEventProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider';
import { ESocialMethodsProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialMethodsProvider';
import { CompanyRepository } from '../../../../../company/repositories/implementations/CompanyRepository';
import { EmployeeExamsHistoryRepository } from '../../../../../company/repositories/implementations/EmployeeExamsHistoryRepository';
import { EmployeeRepository } from '../../../../../company/repositories/implementations/EmployeeRepository';
import { Event2220Dto } from './../../../../dto/event.dto';
import { EmployeeESocialEventTypeEnum, StatusEnum } from '@prisma/client';
import { DayJSProvider } from '../../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { CompanyReportRepository } from '../../../../../../modules/company/repositories/implementations/CompanyReportRepository';
import { Cache } from 'cache-manager';

@Injectable()
export class SendEvents2220ESocialService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly eSocialEventProvider: ESocialEventProvider,
    private readonly eSocialMethodsProvider: ESocialMethodsProvider,
    private readonly employeeExamHistoryRepository: EmployeeExamsHistoryRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly companyReportRepository: CompanyReportRepository,
    private readonly updateESocialReportService: UpdateESocialReportService,
    private readonly eSocialBatchRepository: ESocialBatchRepository,
    private readonly dayJSProvider: DayJSProvider,
  ) {}

  async execute(body: Event2220Dto, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;
    const { company, cert } = await this.eSocialMethodsProvider.getCompany(
      companyId,
      { cert: true, report: true },
    );

    const startDate = company.esocialStart;
    const esocialSend = company.esocialSend;

    if (!startDate || esocialSend == null)
      throw new BadRequestException(
        'Data de início do eSocial ou tipo de envio não informado para essa empresa',
      );

    const { data: employees } = await this.employeeRepository.findEvent2220(
      {
        startDate,
        companyId,
      },
      { take: 1000 },
    );

    const eventsStruct = this.eSocialEventProvider.convertToEvent2220Struct(
      company,
      employees,
      { ideEvento: body },
    );

    // prepare event to send to eSocial
    const eventsXml: IESocialXmlStruck2220[] = eventsStruct
      .map(({ event, ...data }) => {
        const errors = this.eSocialEventProvider.errorsEvent2220(event);
        if (errors.length > 0) return;

        const xmlResult = this.eSocialEventProvider.generateXmlEvent2220(
          event,
          // { declarations: !esocialSend },
        );

        const signedXml: string = esocialSend
          ? this.eSocialMethodsProvider.signEvent({
              xml: xmlResult,
              cert,
            })
          : '';

        // -> CHECK SIGNATURE
        // if (signedXml) {
        //   this.eSocialMethodsProvider.checkSignature({
        //     xml: signedXml,
        //     cert,
        //   });
        // }

        return { signedXml, xml: xmlResult, ...data };
      })
      .filter((i) => i);

    // fs.writeFileSync(
    //   'tmp/test-sign-no.xml',
    //   format(eventsXml[0].signedXml, {
    //     indentation: '  ',
    //     filter: (node) => node.type !== 'Comment',
    //     collapseContent: true,
    //     lineSeparator: '\n',
    //   }),
    // );

    // get response after sending to esocial
    const sendEventResponse = esocialSend
      ? await this.eSocialEventProvider.sendEvent2220ToESocial(eventsXml, {
          company,
          environment: body?.tpAmb,
        })
      : [
          {
            events: eventsXml,
            response: {
              status: { cdResposta: '201' },
            } as IEsocialSendBatchResponse,
          },
        ];

    // save on database
    await Promise.all(
      sendEventResponse.map(async (resp) => {
        const examsIds: number[] = [];
        const isOk = resp.response?.status?.cdResposta == '201';
        const events: CreateESocialEvent[] = isOk
          ? resp.events.map(({ examIds: ids, ...event }) => {
              examsIds.push(...ids);
              return {
                employeeId: event.employee.id,
                eventsDate: event.eventDate,
                eventXml: event.xml,
                examHistoryId: event.asoId,
                eventId: event.id,
              };
            })
          : [];

        await this.eSocialBatchRepository.create({
          companyId,
          environment: body?.tpAmb || 1,
          status: esocialSend
            ? isOk
              ? StatusEnum.DONE
              : StatusEnum.INVALID
            : StatusEnum.TRANSMITTED,
          type: EmployeeESocialEventTypeEnum.EXAM_2220,
          userTransmissionId: user.userId,
          events,
          examsIds,
          protocolId: resp.response?.dadosRecepcaoLote?.protocoloEnvio,
          response: resp.response,
        });
      }),
    );

    const cacheValue: ICacheEventBatchType = false;
    await this.cacheManager.set(CacheEnum.ESOCIAL_FETCH_EVENT, cacheValue, 360);

    await this.updateESocialReportService.execute({ companyId });

    if (esocialSend) return { fileStream: null, fileName: '' };

    const { zipFile, fileName } =
      await this.eSocialMethodsProvider.createZipFolder({
        company,
        eventsXml,
        type: '2220',
      });

    return { fileStream: Readable.from(zipFile) as any, fileName };
  }
}
