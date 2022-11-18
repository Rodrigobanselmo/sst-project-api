import { Injectable } from '@nestjs/common';

import { ESocialSendEnum } from '../../../../../../shared/constants/enum/esocial';
import { UserPayloadDto } from '../../../../../../shared/dto/user-payload.dto';
import { ESocialEventProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider';
import { ESocialMethodsProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialMethodsProvider';
import { CompanyRepository } from '../../../../../company/repositories/implementations/CompanyRepository';
import { EmployeeRepository } from '../../../../../company/repositories/implementations/EmployeeRepository';
import { FindEvents2220Dto } from './../../../../dto/event.dto';
import { mapInverseResAso, mapInverseTpExameOcup } from './../../../../interfaces/event-2220';

@Injectable()
export class FindEvents2220ESocialService {
  constructor(
    private readonly eSocialEventProvider: ESocialEventProvider,
    private readonly eSocialMethodsProvider: ESocialMethodsProvider,
    private readonly employeeRepository: EmployeeRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute({ skip, take, ...query }: FindEvents2220Dto, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;
    const { company } = await this.eSocialMethodsProvider.getCompany(companyId, { doctor: true });

    const startDate = company.esocialStart;
    const esocialSend = company.esocialSend;
    if (!startDate || esocialSend === null)
      return {
        data: [],
        count: 0,
        error: {
          message: 'Data de início do eSocial ou tipo de envio não informado para essa empresa',
        },
      };

    const { data: employees, count } = await this.employeeRepository.findEvent2220(
      {
        startDate,
        companyId,
        ...query,
      },
      { take: 1000 },
      { select: { name: true } },
    );

    const eventsStruct = this.eSocialEventProvider.convertToEvent2220Struct(company, employees);

    const eventsXml = eventsStruct.map((data) => {
      const eventErrors = this.eSocialEventProvider.errorsEvent2220(data.event);
      const xmlResult = this.eSocialEventProvider.generateXmlEvent2220(
        data.event,
        // { declarations: true },
      );

      const company = data.employee?.company;
      delete data.employee?.company;

      let type: ESocialSendEnum = ESocialSendEnum.SEND;
      if (data.aso?.events?.some((e) => ['DONE', 'TRANSMITTED'].includes(e.status))) {
        const isExclude = data.aso.status === 'CANCELED';
        if (isExclude) type = ESocialSendEnum.EXCLUDE;
        if (!isExclude) type = ESocialSendEnum.MODIFIED;
      }

      return {
        company,
        doneDate: data.event.exMedOcup.aso.dtAso,
        examType: mapInverseResAso[data.event.exMedOcup?.tpExameOcup],
        evaluationType: mapInverseTpExameOcup[data.event.exMedOcup.aso?.resAso],
        errors: eventErrors,
        employee: data.employee,
        type,
        xml: xmlResult,
      };
    });

    return { data: eventsXml, count };
  }
}
