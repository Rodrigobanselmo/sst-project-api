import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FindAlertsByTimeService } from '../../services/alert/find-alerts-by-time/find-alerts-by-time.service';

@Injectable()
export class AlertReportCron {
  constructor(private readonly findAlertsByTimeService: FindAlertsByTimeService) {}

  @Cron('0 6-20/2 * * 1-5') //“At minute 0, every 2 hours from 6:00 through 20:00 on Monday through Friday.”
  async handleCron() {
    await this.findAlertsByTimeService.execute();
  }
}
