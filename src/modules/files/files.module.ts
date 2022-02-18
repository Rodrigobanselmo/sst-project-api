import { Module } from '@nestjs/common';
import { ExcelProvider } from 'src/shared/providers/ExcelProvider/implementations/ExcelProvider';
import { FilesController } from './controller/files.controller';
import { UploadChecklistDataService } from './services/upload-checklist-data/upload-checklist-data.service';

@Module({
  controllers: [FilesController],
  providers: [UploadChecklistDataService, ExcelProvider],
})
export class FilesModule {}
