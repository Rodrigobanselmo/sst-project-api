import { getCompanyName } from './../../../../../../shared/utils/companyName';
import { CreateESocialEvent } from './../../../../dto/esocial-batch.dto';
import { ESocialBatchRepository } from './../../../../repositories/implementations/ESocialBatchRepository';
import { BadRequestException, Injectable } from '@nestjs/common';
import JSZip from 'jszip';
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

@Injectable()
export class SendEvents2220ESocialService {
  constructor(
    private readonly eSocialEventProvider: ESocialEventProvider,
    private readonly eSocialMethodsProvider: ESocialMethodsProvider,
    private readonly employeeExamHistoryRepository: EmployeeExamsHistoryRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly companyReportRepository: CompanyReportRepository,
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
      body,
    );

    const eventsXml = eventsStruct
      .map(({ event, ...data }) => {
        const errors = this.eSocialEventProvider.errorsEvent2220(event);
        if (errors.length > 0) return;

        const xmlResult = this.eSocialEventProvider.generateXmlEvent2220(
          event,
          { declarations: !esocialSend },
        );

        const signedXml: string | null = esocialSend
          ? this.eSocialMethodsProvider.signEvent({
              xml: xmlResult,
              cert,
              path: 'evtMonit',
            })
          : null;

        return { signedXml, xml: xmlResult, ...data };
      })
      .filter((i) => i);

    const examsIds: number[] = [];
    const events: CreateESocialEvent[] = eventsXml.map(
      ({ examIds: ids, ...event }) => {
        examsIds.push(...ids);
        return {
          employeeId: event.employee.id,
          eventsDate: event.eventDate,
          eventXml: event.xml,
          examHistoryId: event.asoId,
        };
      },
    );

    await this.eSocialBatchRepository.create({
      companyId,
      environment: body.tpAmb || 1,
      status: esocialSend ? StatusEnum.PENDING : StatusEnum.TRANSMITTED,
      type: EmployeeESocialEventTypeEnum.EXAM_2220,
      userTransmissionId: user.userId,
      events,
      examsIds,
    });

    await this.companyReportRepository.updateESocial(companyId, events.length);

    const { zipFile, fileName } =
      await this.eSocialMethodsProvider.createZipFolder({
        company,
        eventsXml,
        type: '2220',
      });

    return { fileStream: Readable.from(zipFile) as any, fileName };
  }
}
