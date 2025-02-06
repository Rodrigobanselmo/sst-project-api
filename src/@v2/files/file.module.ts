import { Module } from '@nestjs/common';
import { SharedModule } from '@/@v2/shared/shared.module';
import { FileRepository } from './database/repositories/file/file.repository';
import { AddFileService } from './services/add-file/add-file.service';
import { DeleteUnusedFileService } from './services/delete-unused-file/delete-unused-document.service';
import { ReadFileService } from './services/read-file/read-file.service';
import { DeleteUnusedFilesUseCase } from './application/delete-unused-files/use-cases/delete-unused-files.usecase';
import { DeleteUnusedFilesCron } from './application/delete-unused-files/cron/delete-unused-files.cron';

@Module({
  imports: [SharedModule],
  controllers: [],
  providers: [
    // Cron
    DeleteUnusedFilesCron,

    // Database
    FileRepository,

    // Services
    AddFileService,
    DeleteUnusedFileService,
    ReadFileService,

    // Use Cases
    DeleteUnusedFilesUseCase,
  ],
  exports: [],
})
export class FileModule {}
