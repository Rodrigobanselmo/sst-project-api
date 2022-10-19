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
import { DownloadCidService } from '../../services/cid/download-cid/download-cid.service';
import { UploadCidDataService } from '../../services/cid/upload-cid/upload-cid.service';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import {
  PermissionEnum,
  RoleEnum,
} from '../../../../shared/constants/enum/authorization';
import { Roles } from '../../../../shared/decorators/roles.decorator';

@Controller('files/cid')
export class FilesCidController {
  constructor(
    private readonly downloadCidService: DownloadCidService,
    private readonly uploadCidService: UploadCidDataService,
  ) {}

  @Roles(RoleEnum.MASTER)
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCidFile(
    @UploadedFile() file: Express.Multer.File,
    @User() userPayloadDto: UserPayloadDto,
    @Res() res,
  ) {
    const { workbook, filename } = await this.uploadCidService.execute(
      file,
      userPayloadDto,
    );

    res.attachment(filename);
    workbook.xlsx.write(res).then(function () {
      res.end();
    });
  }

  @Roles(RoleEnum.MASTER)
  @Get('/download')
  async download(@User() userPayloadDto: UserPayloadDto, @Res() res) {
    const { workbook, filename } = await this.downloadCidService.execute(
      userPayloadDto,
    );

    res.attachment(filename);
    workbook.xlsx.write(res).then(function () {
      res.end();
    });
  }
}
