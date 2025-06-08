import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AllTasksActionPlanUseCase } from '../use-cases/notify-all-tasks-action-plan.usecase';

@Injectable()
export class AllTasksActionPlanCron {
  constructor(private readonly allTasksActionPlanUseCase: AllTasksActionPlanUseCase) {}

  // This cron job runs every Monday at 11:00 AM
  @Cron('0 0 11 * * 1')
  async handleCron() {
    await this.allTasksActionPlanUseCase.execute({});
  }
}
