import {
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { workbooksConstant } from 'src/shared/constants/workbooks/workbooks.constant';
import { User } from 'src/shared/decorators/user.decorator';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';

import { DownloadRiskDataService } from '../services/download-risk-data/download-risk-data.service';
import { UploadChecklistDataService } from '../services/upload-checklist-data/upload-checklist-data.service';

@Controller('files')
export class FilesController {
  constructor(
    private readonly uploadChecklistDataService: UploadChecklistDataService,
    private readonly downloadRiskDataService: DownloadRiskDataService,
  ) {}

  @Post('/upload/:companyId?')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @User() userPayloadDto: UserPayloadDto,
    @Res() res,
  ) {
    const { workbook, filename } =
      await this.uploadChecklistDataService.execute(file, userPayloadDto);

    res.attachment(filename);
    workbook.xlsx.write(res).then(function () {
      res.end();
    });
  }

  @Get('/download/:companyId?')
  async download(@User() userPayloadDto: UserPayloadDto, @Res() res) {
    const { workbook, filename } = await this.downloadRiskDataService.execute(
      userPayloadDto,
    );

    res.attachment(filename);
    workbook.xlsx.write(res).then(function () {
      res.end();
    });
  }

  @Get('/database-tables')
  findAllTables() {
    return Object.values(workbooksConstant).map((item) => ({
      ...item,
    }));
  }
}
