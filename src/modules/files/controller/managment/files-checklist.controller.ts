import { Controller, Get, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';

import { DownloadRiskDataService } from '../../services/checklist/download-risk-data/download-risk-data.service';
import { UploadChecklistDataService } from '../../services/checklist/upload-risk-data/upload-risk-data.service';
import { UploadEpiDataService } from '../../services/checklist/upload-epi-data/upload-epi-data.service';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { PermissionEnum, RoleEnum } from '../../../../shared/constants/enum/authorization';
import { Roles } from '../../../../shared/decorators/roles.decorator';

@Controller('files/checklist')
export class FilesChecklistController {
  constructor(
    private readonly uploadEpiDataService: UploadEpiDataService,
    private readonly uploadRiskService: UploadChecklistDataService,
    private readonly downloadRiskService: DownloadRiskDataService,
  ) {}

  @Roles(RoleEnum.DATABASE)
  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Post('/upload/:companyId?')
  @UseInterceptors(FileInterceptor('file'))
  async uploadRiskFile(@UploadedFile() file: any, @User() userPayloadDto: UserPayloadDto, @Res() res) {
    const { workbook, filename } = await this.uploadRiskService.execute(file, userPayloadDto);

    res.attachment(filename);
    workbook.xlsx.write(res).then(function () {
      res.end();
    });
  }

  @Roles(RoleEnum.DATABASE)
  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
  })
  @Get('/download/:companyId?')
  async downloadRisks(@User() userPayloadDto: UserPayloadDto, @Res() res) {
    const { workbook, filename } = await this.downloadRiskService.execute(userPayloadDto);

    res.attachment(filename);
    workbook.xlsx.write(res).then(function () {
      res.end();
    });
  }

  @Roles(RoleEnum.DATABASE)
  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
  })
  @Post('epi/upload/:companyId?')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10_000_000_000 } }))
  async uploadEpiFile(@UploadedFile() file: any, @User() userPayloadDto: UserPayloadDto, @Res() res) {
    const { workbook, filename } = await this.uploadEpiDataService.execute(file, userPayloadDto);

    res.attachment(filename);
    workbook.xlsx.write(res).then(function () {
      res.end();
    });
  }
}
