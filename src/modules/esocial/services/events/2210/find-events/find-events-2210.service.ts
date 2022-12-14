import { Injectable } from '@nestjs/common';

import { ESocialSendEnum } from '../../../../../../shared/constants/enum/esocial';
import { UserPayloadDto } from '../../../../../../shared/dto/user-payload.dto';
import { ESocialEventProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider';
import { ESocialMethodsProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialMethodsProvider';
import { CompanyRepository } from '../../../../../company/repositories/implementations/CompanyRepository';
import { EmployeeRepository } from '../../../../../company/repositories/implementations/EmployeeRepository';
import { FindEvents2220Dto } from '../../../../dto/event.dto';
import { CatRepository } from './../../../../../company/repositories/implementations/CatRepository';

@Injectable()
export class FindEvents2210ESocialService {
  constructor(
    private readonly eSocialEventProvider: ESocialEventProvider,
    private readonly eSocialMethodsProvider: ESocialMethodsProvider,
    private readonly employeeRepository: EmployeeRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly catRepository: CatRepository,
  ) {}

  async execute({ skip, take, ...query }: FindEvents2220Dto, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;
    const { company } = await this.eSocialMethodsProvider.getCompany(companyId);

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

    const cats = await this.catRepository.findEvent2210();
    const eventsStruct = this.eSocialEventProvider.convertToEvent2210Struct(company, cats);

    const eventsXml = eventsStruct.map((data) => {
      const eventErrors = this.eSocialEventProvider.errorsEvent2210(data.event);
      const xmlResult = this.eSocialEventProvider.generateXmlEvent2210(data.event);

      let type: ESocialSendEnum = ESocialSendEnum.SEND;
      if (data.cat?.events?.some((e) => ['DONE', 'TRANSMITTED'].includes(e.status))) {
        const isExclude = data.cat.status === 'CANCELED';
        if (isExclude) type = ESocialSendEnum.EXCLUDE;
        if (!isExclude) type = ESocialSendEnum.MODIFIED;
      }

      return {
        company,
        doneDate: data.event.cat.dtAcid,
        errors: eventErrors,
        employee: data.employee,
        type,
        xml: xmlResult,
      };
    });

    return { data: eventsXml };
  }
}
