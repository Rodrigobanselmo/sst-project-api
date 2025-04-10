import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DeleteUnusedFilesUseCase } from '../use-cases/delete-unused-files.usecase';

@Injectable()
export class DeleteUnusedFilesCron {
  constructor(private readonly deleteUnusedFilesUseCase: DeleteUnusedFilesUseCase) {}
  private logger = new Logger(DeleteUnusedFilesCron.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.log('Running delete unused files cron job');

    await this.deleteUnusedFilesUseCase.execute();
  }
}
