import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NewTasksActionPlanUseCase } from '../use-cases/notify-new-tasks-action-plan.usecase';

@Injectable()
export class NewTasksActionPlanCron {
  constructor(private readonly newTasksActionPlanUseCase: NewTasksActionPlanUseCase) {}

  @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_3PM)
  async handleCron() {
    await this.newTasksActionPlanUseCase.execute({});
  }
}
