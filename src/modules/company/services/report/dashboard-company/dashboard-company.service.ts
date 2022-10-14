import { CompanyReportRepository } from './../../../repositories/implementations/CompanyReportRepository';
import { DocumentRepository } from '../../../repositories/implementations/DocumentRepository';
import { IExamOriginData } from '../../../../checklist/entities/exam.entity';
import { FindExamByHierarchyService } from '../../../../checklist/services/exam/find-by-hierarchy /find-exam-by-hierarchy.service';
import { FindCompanyDashDto } from '../../../dto/dashboard.dto';
import { EmployeeRepository } from '../../../repositories/implementations/EmployeeRepository';
import { Injectable } from '@nestjs/common';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CreateContactDto } from '../../../dto/contact.dto';
import { ContactRepository } from '../../../repositories/implementations/ContactRepository';

@Injectable()
export class DashboardCompanyService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly findExamByHierarchyService: FindExamByHierarchyService,
    private readonly documentRepository: DocumentRepository,
    private readonly companyReportRepository: CompanyReportRepository,
    private readonly dayjs: DayJSProvider,
  ) {}

  async execute(findDto: FindCompanyDashDto, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;
    const report = await this.companyReportRepository.findFirstNude({
      where: { companyId },
    });

    return report;
  }
}
