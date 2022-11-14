import { sortData } from './../../../../../../shared/utils/sorts/data.sort';
import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { EmployeeESocialEventTypeEnum } from '@prisma/client';
import { Cache } from 'cache-manager';
import { Readable } from 'stream';

import { CompanyReportRepository } from '../../../../../../modules/company/repositories/implementations/CompanyReportRepository';
import { UserPayloadDto } from '../../../../../../shared/dto/user-payload.dto';
import { DayJSProvider } from '../../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { ESocialEventProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider';
import { ESocialMethodsProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialMethodsProvider';
import { CompanyRepository } from '../../../../../company/repositories/implementations/CompanyRepository';
import { EmployeeExamsHistoryRepository } from '../../../../../company/repositories/implementations/EmployeeExamsHistoryRepository';
import { EmployeeRepository } from '../../../../../company/repositories/implementations/EmployeeRepository';
import { CacheEnum } from './../../../../../../shared/constants/enum/cache';
import { ICacheEventBatchType } from './../../../../../../shared/interfaces/cache.types';
import {
  IESocial2220,
  IESocial3000,
} from './../../../../../../shared/providers/ESocialProvider/models/IESocialMethodProvider';
import { UpdateESocialReportService } from './../../../../../company/services/report/update-esocial-report/update-esocial-report.service';
import { Event2220Dto } from './../../../../dto/event.dto';
import { IEsocialSendBatchResponse } from './../../../../interfaces/esocial';
import { ESocialBatchRepository } from './../../../../repositories/implementations/ESocialBatchRepository';

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

    // prepare event to exclude from eSocial
    const excludeEvents = eventsStruct.filter((event) => {
      return (
        event.aso?.status === 'CANCELED' &&
        event.aso?.events?.find((e) => e.receipt)
      );
    });

    const excludeEntry = excludeEvents.map<IESocial3000.Event>((event) => {
      const eventAso = event.aso?.events
        ?.sort((b, a) => sortData(a, b))
        ?.find((e) => e.receipt);

      return {
        cpf: event.employee.cpf,
        eventType: EmployeeESocialEventTypeEnum.EXAM_2220,
        receipt: eventAso?.receipt,
        employee: event.employee,
        aso: event.aso,
      };
    });

    console.log(excludeEntry);

    // send exclusion event
    await this.eSocialEventProvider.sendExclusionToESocial({
      body,
      cert,
      company,
      events: excludeEntry,
      type: EmployeeESocialEventTypeEnum.EXAM_2220,
      user,
      esocialSend,
    });

    // prepare event to send to eSocial
    const eventsXml: IESocial2220.XmlReturn[] = eventsStruct
      .map(({ event, ...data }) => {
        // eslint-disable-next-line prettier/prettier
        const canceled = data.aso?.status == 'CANCELED';
        if (canceled) return;

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

    // get response after sending to esocial
    const sendEventResponse = esocialSend
      ? await this.eSocialEventProvider.sendEventToESocial(eventsXml, {
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
    await this.eSocialEventProvider.saveDatabaseBatchEvent({
      body,
      user,
      company,
      esocialSend,
      type: EmployeeESocialEventTypeEnum.EXAM_2220,
      sendEvents: sendEventResponse,
    });

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
