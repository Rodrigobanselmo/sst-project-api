import { Controller, Get, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { DownloadCnaeService } from '../../services/cnae/download-cnae/download-cnae.service';
import { UploadCnaeDataService } from '../../services/cnae/upload-cnae/upload-cnae.service';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { PermissionEnum, RoleEnum } from '../../../../shared/constants/enum/authorization';
import { Roles } from '../../../../shared/decorators/roles.decorator';

@Controller('files/cnae')
export class FilesCnaeController {
  constructor(
    private readonly downloadCnaeService: DownloadCnaeService,
    private readonly uploadCnaeService: UploadCnaeDataService,
  ) {}

  @Roles(RoleEnum.MASTER)
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCnaeFile(@UploadedFile() file: Express.Multer.File, @User() userPayloadDto: UserPayloadDto, @Res() res) {
    const { workbook, filename } = await this.uploadCnaeService.execute(file, userPayloadDto);

    res.attachment(filename);
    workbook.xlsx.write(res).then(function () {
      res.end();
    });
  }

  @Roles(RoleEnum.MASTER)
  @Get('/download')
  async download(@User() userPayloadDto: UserPayloadDto, @Res() res) {
    const { workbook, filename } = await this.downloadCnaeService.execute(userPayloadDto);

    res.attachment(filename);
    workbook.xlsx.write(res).then(function () {
      res.end();
    });
  }
}
