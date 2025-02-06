import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DeleteUnusedFilesUseCase } from '../use-cases/delete-unused-files.usecase';

@Injectable()
export class DeleteUnusedFilesCron {
  constructor(private readonly deleteUnusedFilesUseCase: DeleteUnusedFilesUseCase) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    await this.deleteUnusedFilesUseCase.execute();
  }
}
