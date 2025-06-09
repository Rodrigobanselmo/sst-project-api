import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NewTasksActionPlanUseCase } from '../use-cases/notify-new-tasks-action-plan.usecase';

@Injectable()
export class NewTasksActionPlanCron {
  constructor(private readonly newTasksActionPlanUseCase: NewTasksActionPlanUseCase) {}
  private logger = new Logger(NewTasksActionPlanCron.name);

  @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_7PM)
  async handleCron() {
    this.logger.log('Running notify new tasks action plan cron job');

    await this.newTasksActionPlanUseCase.execute({});
  }
}
