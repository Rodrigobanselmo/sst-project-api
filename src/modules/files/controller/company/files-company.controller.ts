import {
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/shared/decorators/user.decorator';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';

import { DownloadCompaniesService } from '../../services/company/download-companies/download-companies.service';
import { UploadCompaniesService } from '../../services/company/upload-companies/upload-companies.service';

@Controller('files/company')
export class FilesCompanyController {
  constructor(
    private readonly downloadCompaniesService: DownloadCompaniesService,
    private readonly uploadCompaniesService: UploadCompaniesService,
  ) {}

  @Post('/upload/:companyId?')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @User() userPayloadDto: UserPayloadDto,
    @Res() res,
  ) {
    const { workbook, filename } = await this.uploadCompaniesService.execute(
      file,
      userPayloadDto,
    );

    res.attachment(filename);
    workbook.xlsx.write(res).then(function () {
      res.end();
    });
  }

  @Get('/download/:companyId?')
  async download(@User() userPayloadDto: UserPayloadDto, @Res() res) {
    const { workbook, filename } = await this.downloadCompaniesService.execute(
      userPayloadDto,
    );

    res.attachment(filename);
    workbook.xlsx.write(res).then(function () {
      res.end();
    });
  }
}
