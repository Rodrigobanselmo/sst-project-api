import {
  DailyCompanyReportDto,
  UpsertCompanyReportDto,
} from '../../../dto/company-report.dto';
import { EmployeeEntity } from 'src/modules/company/entities/employee.entity';
import { CompanyEntity } from '../../../entities/company.entity';
import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';
import { asyncEach } from '../../../../../shared/utils/asyncEach';
import { DocumentRepository } from '../../../repositories/implementations/DocumentRepository';
import { IExamOriginData } from '../../../../sst/entities/exam.entity';
import { FindExamByHierarchyService } from '../../../../sst/services/exam/find-by-hierarchy /find-exam-by-hierarchy.service';
import { FindCompanyDashDto } from '../../../dto/dashboard.dto';
import { EmployeeRepository } from '../../../repositories/implementations/EmployeeRepository';
import { Injectable } from '@nestjs/common';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CreateContactDto } from '../../../dto/contact.dto';
import { ContactRepository } from '../../../repositories/implementations/ContactRepository';
import { TelegramService } from 'nestjs-telegram';
import { CompanyReportRepository } from '../../../repositories/implementations/CompanyReportRepository';
import { arrayChunks } from '../../../../../shared/utils/arrayChunks';
import { asyncBatch } from '../../../../../shared/utils/asyncBatch';
import { ESocialEventProvider } from '../../../../../shared/providers/ESocialProvider/implementations/ESocialEventProvider';

@Injectable()
export class UpdateESocialReportService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly eSocialEventProvider: ESocialEventProvider,
    private readonly companyReportRepository: CompanyReportRepository,
  ) {}

  async execute({ companyId }: { companyId: string }) {
    const company = await this.companyRepository.findFirstNude({
      select: {
        id: true,
        esocialStart: true,
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
      where: {
        status: 'ACTIVE',
        isClinic: false,
        ...(companyId && {
          OR: [
            { id: companyId },
            {
              receivingServiceContracts: {
                some: { applyingServiceCompanyId: companyId },
              },
            },
          ],
        }),
      },
    });

    const esocial = await this.addCompanyEsocial(company);
    const report = await this.companyReportRepository.updateESocialReport(
      companyId,
      {
        esocial: esocial,
      },
    );

    return report;
  }

  async addCompanyEsocial(
    company: CompanyEntity,
  ): Promise<DailyCompanyReportDto['esocial']> {
    const companyId = company.id;
    if (!company.esocialStart) return {};

    const { data: employees } = await this.employeeRepository.findEvent2220(
      {
        startDate: company.esocialStart,
        companyId,
      },
      { take: 100 },
    );

    const eventsStruct = this.eSocialEventProvider.convertToEvent2220Struct(
      company,
      employees,
    );

    const esocial = await this.companyReportRepository.getESocialNewReport(
      companyId,
    );

    return {
      pending: eventsStruct.length,
      ...esocial,
    };
  }
}
