import {
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';

import { DownloadRiskDataService } from '../../services/checklist/download-risk-data/download-risk-data.service';
import { UploadChecklistDataService } from '../../services/checklist/upload-checklist-data/upload-checklist-data.service';
import { UploadEpiDataService } from '../../services/checklist/upload-epi-data/upload-epi-data.service';

@Controller('files/checklist')
export class FilesChecklistController {
  constructor(
    private readonly uploadEpiDataService: UploadEpiDataService,
    private readonly uploadChecklistDataService: UploadChecklistDataService,
    private readonly downloadRiskDataService: DownloadRiskDataService,
  ) {}

  @Post('/upload/:companyId?')
  @UseInterceptors(FileInterceptor('file'))
  async uploadRiskFile(
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
  async downloadRisks(@User() userPayloadDto: UserPayloadDto, @Res() res) {
    const { workbook, filename } = await this.downloadRiskDataService.execute(
      userPayloadDto,
    );

    res.attachment(filename);
    workbook.xlsx.write(res).then(function () {
      res.end();
    });
  }

  @Post('epi/upload/:companyId?')
  @UseInterceptors(FileInterceptor('file'))
  async uploadEpiFile(
    @UploadedFile() file: Express.Multer.File,
    @User() userPayloadDto: UserPayloadDto,
    @Res() res,
  ) {
    const { workbook, filename } = await this.uploadEpiDataService.execute(
      file,
      userPayloadDto,
    );

    res.attachment(filename);
    workbook.xlsx.write(res).then(function () {
      res.end();
    });
  }
}
