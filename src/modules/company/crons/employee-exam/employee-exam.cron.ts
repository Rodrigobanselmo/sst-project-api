import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class EmployeeExamCronService {
  private readonly logger = new Logger(EmployeeExamCronService.name);

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  handleCron() {
    this.logger.debug('Called every 30 seconds');
  }
}
