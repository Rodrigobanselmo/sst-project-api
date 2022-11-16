import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { UpdateAllCompaniesService } from '../../services/report/update-all-companies/update-all-companies.service';

@Injectable()
export class UpdateCompaniesReportCron {
  constructor(private readonly updateAllCompaniesService: UpdateAllCompaniesService) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM) //11pm on brazil
  // @Cron(CronExpression.EVERY_5_SECONDS)
  async handleCron() {
    this.updateAllCompaniesService.execute();
  }
}
