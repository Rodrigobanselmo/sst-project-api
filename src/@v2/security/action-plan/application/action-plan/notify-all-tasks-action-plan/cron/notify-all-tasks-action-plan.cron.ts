import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AllTasksActionPlanUseCase } from '../use-cases/notify-all-tasks-action-plan.usecase';

@Injectable()
export class AllTasksActionPlanCron {
  constructor(private readonly allTasksActionPlanUseCase: AllTasksActionPlanUseCase) {}
  private logger = new Logger(AllTasksActionPlanCron.name);

  // Monday at 10:00 AM
  @Cron('0 0 10 * * 1')
  async handleCron() {
    this.logger.log('Running notify all tasks action plan cron job');

    await this.allTasksActionPlanUseCase.execute({});
  }
}
