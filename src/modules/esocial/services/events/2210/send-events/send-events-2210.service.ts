import { BadRequestException, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { EmployeeESocialEventTypeEnum } from '@prisma/client';
import { Cache } from 'cache-manager';
import { Readable } from 'stream';

import { CacheEnum } from '../../../../../../shared/constants/enum/cache';
import { UserPayloadDto } from '../../../../../../shared/dto/user-payload.dto';
import { ICacheEventBatchType } from '../../../../../../shared/interfaces/cache.types';
import { DayJSProvider } from '../../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { ESocialEventProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider';
import { ESocialMethodsProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialMethodsProvider';
import { IESocial2210, IESocial3000 } from '../../../../../../shared/providers/ESocialProvider/models/IESocialMethodProvider';
import { sortData } from '../../../../../../shared/utils/sorts/data.sort';
import { CompanyReportRepository } from '../../../../../company/repositories/implementations/CompanyReportRepository';
import { CompanyRepository } from '../../../../../company/repositories/implementations/CompanyRepository';
import { EmployeeRepository } from '../../../../../company/repositories/implementations/EmployeeRepository';
import { UpdateESocialReportService } from '../../../../../company/services/report/update-esocial-report/update-esocial-report.service';
import { Event2210Dto } from '../../../../dto/event.dto';
import { IEsocialSendBatchResponse } from '../../../../interfaces/esocial';
import { ESocialBatchRepository } from '../../../../repositories/implementations/ESocialBatchRepository';
import { CatRepository } from './../../../../../company/repositories/implementations/CatRepository';

@Injectable()
export class SendEvents2210ESocialService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly eSocialEventProvider: ESocialEventProvider,
    private readonly eSocialMethodsProvider: ESocialMethodsProvider,
    private readonly catRepository: CatRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly companyReportRepository: CompanyReportRepository,
    private readonly updateESocialReportService: UpdateESocialReportService,
    private readonly eSocialBatchRepository: ESocialBatchRepository,
    private readonly dayJSProvider: DayJSProvider,
  ) {}

  async execute(body: Event2210Dto, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;
    const { company, cert } = await this.eSocialMethodsProvider.getCompany(companyId, { cert: true, report: true });

    const startDate = company.esocialStart;
    const esocialSend = company.esocialSend;

    if (!startDate || esocialSend == null) throw new BadRequestException('Data de início do eSocial ou tipo de envio não informado para essa empresa');

    const cats = await this.catRepository.findEvent2210(companyId);

    const eventsStruct = this.eSocialEventProvider.convertToEvent2210Struct(company, cats, { ideEvento: body });

    // prepare event to exclude from eSocial
    const excludeEvents = eventsStruct.filter((event) => {
      return event.cat?.status === 'CANCELED' && event.cat?.events?.find((e) => e.receipt);
    });

    const excludeEntry = excludeEvents.map<IESocial3000.Event>((event) => {
      const eventCat = event.cat?.events?.sort((b, a) => sortData(a, b))?.find((e) => e.receipt);

      return {
        cpf: event.employee.cpf,
        eventType: EmployeeESocialEventTypeEnum.CAT_2210,
        receipt: eventCat?.receipt,
        employee: event.employee,
        cat: event.cat,
      };
    });

    // send exclusion event
    await this.eSocialEventProvider.sendExclusionToESocial({
      body,
      cert,
      company,
      events: excludeEntry,
      type: EmployeeESocialEventTypeEnum.CAT_2210,
      user,
      esocialSend,
    });

    // prepare event to send to eSocial
    const eventsXml: IESocial2210.XmlReturn[] = eventsStruct
      .map(({ event, ...data }) => {
        const canceled = data.cat?.status == 'CANCELED';
        if (canceled) return;

        const errors = this.eSocialEventProvider.errorsEvent2210(event);
        if (errors.length > 0) return;

        const xmlResult = this.eSocialEventProvider.generateXmlEvent2210(event);

        const signedXml: string = esocialSend
          ? this.eSocialMethodsProvider.signEvent({
              xml: xmlResult,
              cert,
            })
          : '';

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
      type: EmployeeESocialEventTypeEnum.CAT_2210,
      sendEvents: sendEventResponse,
    });

    const cacheValue: ICacheEventBatchType = false;
    await this.cacheManager.set(CacheEnum.ESOCIAL_FETCH_EVENT, cacheValue, 360);

    await this.updateESocialReportService.execute({ companyId });

    if (esocialSend) return { fileStream: null, fileName: '' };

    const { zipFile, fileName } = await this.eSocialMethodsProvider.createZipFolder({
      company,
      eventsXml,
      type: '2210',
    });

    return { fileStream: Readable.from(zipFile) as any, fileName };
  }
}
