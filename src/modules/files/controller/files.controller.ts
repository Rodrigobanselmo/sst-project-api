import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/shared/decorators/public.decorator';
import { UploadChecklistDataService } from '../services/upload-checklist-data/upload-checklist-data.service';

@Controller('files')
export class FilesController {
  constructor(
    private readonly uploadChecklistDataService: UploadChecklistDataService,
  ) {}

  @Post('upload')
  @Public()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadChecklistDataService.execute(file);
  }
}
