import { BadRequestException, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { EmployeeESocialEventTypeEnum, StatusEnum } from '@prisma/client';
import { Cache } from 'cache-manager';
import { Readable } from 'stream';

import { EmployeePPPHistoryRepository } from '../../../../../../modules/company/repositories/implementations/EmployeePPPHistoryRepository';
import { CacheEnum } from '../../../../../../shared/constants/enum/cache';
import { UserPayloadDto } from '../../../../../../shared/dto/user-payload.dto';
import { ICacheEventBatchType } from '../../../../../../shared/interfaces/cache.types';
import { DayJSProvider } from '../../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { ESocialEventProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider';
import { ESocialMethodsProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialMethodsProvider';
import { IESocial2240, IESocial3000 } from '../../../../../../shared/providers/ESocialProvider/models/IESocialMethodProvider';
import { CompanyReportRepository } from '../../../../../company/repositories/implementations/CompanyReportRepository';
import { CompanyRepository } from '../../../../../company/repositories/implementations/CompanyRepository';
import { EmployeeRepository } from '../../../../../company/repositories/implementations/EmployeeRepository';
import { UpdateESocialReportService } from '../../../../../company/services/report/update-esocial-report/update-esocial-report.service';
import { Event2240Dto } from '../../../../dto/event.dto';
import { IEsocialSendBatchResponse } from '../../../../interfaces/esocial';
import { ESocialBatchRepository } from '../../../../repositories/implementations/ESocialBatchRepository';
import { FindEvents2240ESocialService } from '../find-events/find-events.service';

@Injectable()
export class SendEvents2240ESocialService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly eSocialEventProvider: ESocialEventProvider,
    private readonly eSocialMethodsProvider: ESocialMethodsProvider,
    private readonly employeePPPHistoryRepository: EmployeePPPHistoryRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly companyReportRepository: CompanyReportRepository,
    private readonly updateESocialReportService: UpdateESocialReportService,
    private readonly eSocialBatchRepository: ESocialBatchRepository,
    private readonly dayJSProvider: DayJSProvider,
    private readonly findEvents2240ESocialService: FindEvents2240ESocialService,
  ) {}

  async execute(body: Event2240Dto, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;
    const { company, cert } = await this.findEvents2240ESocialService.getCompany(companyId, { report: true, cert: true });

    const startDate = company.esocialStart;
    const esocialSend = company.esocialSend;

    if (!startDate || esocialSend == null) throw new BadRequestException('Data de início do eSocial ou tipo de envio não informado para essa empresa');

    const employees2240 = await this.findEvents2240ESocialService.findEmployee2240(company);

    const eventsStruct = this.eSocialEventProvider.convertToEvent2240Struct({ company, esocialStartDate: startDate, employees: employees2240 });

    // prepare event to exclude from eSocial
    const excludeEvents = eventsStruct.filter((e) => e.isExclude && e.receipt);

    const excludeEntry = excludeEvents.map<IESocial3000.Event>((event) => {
      const receipt = event.receipt;

      return {
        cpf: event.employee.cpf,
        eventType: EmployeeESocialEventTypeEnum.RISK_2240,
        receipt: receipt,
        employee: event.employee,
        ppp: event.ppp,
      };
    });

    // send exclusion event
    await this.eSocialEventProvider.sendExclusionToESocial({
      body,
      cert,
      company,
      events: excludeEntry,
      type: EmployeeESocialEventTypeEnum.RISK_2240,
      user,
      esocialSend,
    });

    const errorsEventsPPP = [] as IESocial2240.StructureReturn[];
    // prepare event to send to eSocial
    const eventsXml: IESocial2240.XmlReturn[] = eventsStruct
      .map(({ event, ...data }) => {
        if (data.isExclude) return;

        const errors = this.eSocialEventProvider.errorsEvent2240(event);
        if (errors.length > 0) {
          errorsEventsPPP.push({ event, ...data });
          return;
        }

        const xmlResult = this.eSocialEventProvider.generateXmlEvent2240(
          event,
          // { declarations: !esocialSend },
        );

        const signedXml: string = esocialSend
          ? this.eSocialMethodsProvider.signEvent({
              xml: xmlResult,
              cert,
            })
          : '';

        return { signedXml, xml: xmlResult, ...data };
      })
      .filter((i) => i);

    await this.employeePPPHistoryRepository.upsertManyNude(
      errorsEventsPPP.map((ev) => {
        return {
          create: {
            sendEvent: true,
            employeeId: ev.employee.id,
            doneDate: ev.eventDate,
            status: StatusEnum.INVALID,
          },
          update: {
            sendEvent: true,
            status: StatusEnum.INVALID,
          },
          where: {
            employeeId_doneDate: {
              employeeId: ev.employee.id,
              doneDate: ev.eventDate,
            },
          },
        };
      }),
    );

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
      type: EmployeeESocialEventTypeEnum.RISK_2240,
      sendEvents: sendEventResponse,
    });

    const cacheValue: ICacheEventBatchType = false;
    await this.cacheManager.set(CacheEnum.ESOCIAL_FETCH_EVENT, cacheValue, 360);

    await this.updateESocialReportService.execute({ companyId });

    if (esocialSend) return { fileStream: null, fileName: '' };

    const { zipFile, fileName } = await this.eSocialMethodsProvider.createZipFolder({
      company,
      eventsXml,
      type: '2240',
    });

    return { fileStream: Readable.from(zipFile) as any, fileName };
  }
}
