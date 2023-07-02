import { getEmployeeFind2240Where } from './../../../../esocial/services/events/2240/find-events/find-events.service';
import { CatRepository } from './../../../repositories/implementations/CatRepository';
import { Injectable } from '@nestjs/common';

import { ESocialEventProvider } from '../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider';
import { IESocialPropsDto } from '../../../dto/company-report.dto';
import { CompanyEntity } from '../../../entities/company.entity';
import { CompanyReportRepository } from '../../../repositories/implementations/CompanyReportRepository';
import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';
import { EmployeeRepository } from '../../../repositories/implementations/EmployeeRepository';

@Injectable()
export class UpdateESocialReportService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly eSocialEventProvider: ESocialEventProvider,
    private readonly companyReportRepository: CompanyReportRepository,
    private readonly catRepository: CatRepository,
  ) { }

  async execute({ companyId }: { companyId: string }) {
    const company = await this.companyRepository.findFirstNude({
      select: {
        id: true,
        esocialStart: true,
        cnpj: true,
        group: {
          select: {
            esocialStart: true,
          },
        },
      },
      where: {
        status: 'ACTIVE',
        isClinic: false,
        id: companyId,
      },
    });

    const esocial = await this.addCompanyEsocial(company);
    const report = await this.companyReportRepository.updateESocialReport(companyId, {
      esocial: esocial,
    });

    return report;
  }

  async addCompanyEsocial(company: CompanyEntity): Promise<IESocialPropsDto> {
    const companyId = company.id;
    if (!company.esocialStart) return {};

    const { data: employees } = await this.employeeRepository.findEvent2220(
      {
        startDate: company.esocialStart,
        companyId,
      },
      { take: 100 },
    );

    const eventsStruct = this.eSocialEventProvider.convertToEvent2220Struct(company, employees);

    const esocial = await this.companyReportRepository.getESocialNewReport(companyId);

    esocial.S2220.pending = eventsStruct.length;

    const employees2240 = await this.employeeRepository.countNude({
      where: {
        ...getEmployeeFind2240Where(companyId)
      },
    });

    esocial.S2240.pending = employees2240;

    const employees2210 = await this.catRepository.countEvent2210({ companyId });

    esocial.S2210.pending = employees2210;

    return esocial;
  }
}
