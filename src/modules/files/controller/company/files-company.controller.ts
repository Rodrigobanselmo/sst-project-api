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
import { DownloadUniqueCompanyService } from '../../services/company/download-unique-company/download-unique-company.service';
import { UploadCompaniesService } from '../../services/company/upload-companies/upload-companies.service';
import { UploadUniqueCompanyService } from '../../services/company/upload-unique-company/upload-unique-company.service';

@Controller('files/company')
export class FilesCompanyController {
  constructor(
    private readonly downloadCompaniesService: DownloadCompaniesService,
    private readonly uploadCompaniesService: UploadCompaniesService,
    private readonly downloadUniqueCompanyService: DownloadUniqueCompanyService,
    private readonly uploadUniqueCompanyService: UploadUniqueCompanyService,
  ) {}

  @Post('/upload/unique')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCompanyFile(
    @UploadedFile() file: Express.Multer.File,
    @User() userPayloadDto: UserPayloadDto,
    @Res() res,
  ) {
    console.log(9999);
    const { workbook, filename } =
      await this.uploadUniqueCompanyService.execute(file, userPayloadDto);

    res.attachment(filename);
    workbook.xlsx.write(res).then(function () {
      res.end();
    });
  }

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

  @Get('/download/unique/:companyId')
  async downloadUnique(@User() userPayloadDto: UserPayloadDto, @Res() res) {
    const { workbook, filename } =
      await this.downloadUniqueCompanyService.execute(userPayloadDto);

    res.attachment(filename);
    workbook.xlsx.write(res).then(function () {
      res.end();
    });
  }
}
