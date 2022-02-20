import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { workbooksConstant } from 'src/shared/constants/workbooks/workbooks.constant';
import { User } from 'src/shared/decorators/user.decorator';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';
import { ExcelProvider } from 'src/shared/providers/ExcelProvider/implementations/ExcelProvider';

import { DownloadRiskDataService } from '../services/download-risk-data/download-risk-data.service';
import { UploadChecklistDataService } from '../services/upload-checklist-data/upload-checklist-data.service';

@Controller('files')
export class FilesController {
  constructor(
    private readonly uploadChecklistDataService: UploadChecklistDataService,
    private readonly downloadRiskDataService: DownloadRiskDataService,
    private readonly excelProvider: ExcelProvider,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.uploadChecklistDataService.execute(file, userPayloadDto);
  }

  @Get('/download')
  download(@User() userPayloadDto: UserPayloadDto) {
    return this.downloadRiskDataService.execute(userPayloadDto);
  }

  @Get('/database-tables')
  findAllTables() {
    return Object.values(workbooksConstant).map((item) => ({
      ...item,
    }));
  }
}
