import { Injectable } from '@nestjs/common';
import format from 'xml-formatter';

import { UserPayloadDto } from '../../../../../../shared/dto/user-payload.dto';
import { ESocialEventProvider } from '../../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider';
import { CompanyRepository } from '../../../../../company/repositories/implementations/CompanyRepository';
import { EmployeeRepository } from '../../../../../company/repositories/implementations/EmployeeRepository';
import { FindEvents2220Dto } from './../../../../dto/event.dto';

@Injectable()
export class FindEvents2220ESocialService {
  constructor(
    private readonly eSocialEventProvider: ESocialEventProvider,
    private readonly employeeRepository: EmployeeRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(
    { skip, take, ...query }: FindEvents2220Dto,
    user: UserPayloadDto,
  ) {
    const companyId = user.targetCompanyId;
    const company = await this.companyRepository.findFirstNude({
      where: { id: companyId },
      select: {
        id: true,
        esocialStart: true,
        cnpj: true,
        doctorResponsible: {
          include: { professional: { select: { name: true } } },
        },
        group: {
          select: {
            doctorResponsible: {
              include: { professional: { select: { name: true } } },
            },
            esocialStart: true,
            company: { select: { cert: true } },
          },
        },
      },
    });

    const startDate = company.esocialStart;
    if (!startDate)
      return {
        data: [],
        count: 0,
        error: {
          message: 'Data de início do eSocial não informado para essa empresa',
        },
      };

    const { data: employees, count } =
      await this.employeeRepository.findEvent2220(
        {
          startDate,
          companyId,
          ...query,
        },
        { take: 100 },
      );

    const eventsStruct = this.eSocialEventProvider.convertToEventStruct(
      company,
      employees,
    );

    const eventsXml = eventsStruct.map((data) => {
      const xmlResult = this.eSocialEventProvider.generateXmlEvent2220(
        data.event,
      );

      return {
        employee: data.employee,
        xml: format(xmlResult, {
          indentation: '  ',
          filter: (node) => node.type !== 'Comment',
          collapseContent: true,
          lineSeparator: '\n',
        }),
      };
    });

    return { data: eventsXml, count };
  }
}
