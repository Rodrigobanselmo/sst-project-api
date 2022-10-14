import { asyncEach } from './../../../../shared/utils/asyncEach';
import { DocumentRepository } from './../../repositories/implementations/DocumentRepository';
import { FindExamByHierarchyService } from './../../../checklist/services/exam/find-by-hierarchy /find-exam-by-hierarchy.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmployeeRepository } from '../../repositories/implementations/EmployeeRepository';
import { DayJSProvider } from '../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { CompanyRepository } from '../../repositories/implementations/CompanyRepository';
import { CompanyEntity } from '../../entities/company.entity';
import { UpdateAllCompaniesService } from '../../services/report/update-all-companies/update-all-companies.service';

@Injectable()
export class EmployeeExamCronService {
  constructor(
    private readonly updateAllCompaniesService: UpdateAllCompaniesService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  // @Cron(CronExpression.EVERY_5_SECONDS)
  async handleCron() {
    this.updateAllCompaniesService.execute();
  }
}
