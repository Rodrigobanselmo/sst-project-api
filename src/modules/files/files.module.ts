import { Module } from '@nestjs/common';
import { ExcelProvider } from 'src/shared/providers/ExcelProvider/implementations/ExcelProvider';
import { ChecklistModule } from '../checklist/checklist.module';
import { FilesController } from './controller/files.controller';
import { DatabaseTableRepository } from './repositories/implementations/DatabaseTableRepository';
import { UploadChecklistDataService } from './services/upload-checklist-data/upload-checklist-data.service';
import { DownloadRiskDataService } from './services/download-risk-data/download-risk-data.service';

@Module({
  controllers: [FilesController],
  imports: [ChecklistModule],
  providers: [
    UploadChecklistDataService,
    ExcelProvider,
    DatabaseTableRepository,
    DownloadRiskDataService,
  ],
})
export class FilesModule {}
