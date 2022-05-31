import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { User } from '../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../shared/dto/user-payload.dto';
import { UpsertPgrDto } from '../dto/pgr.dto';

import { PgrDownloadService } from '../services/pgr/download-pgr.service';
import { PgrUploadService } from '../services/pgr/upload-pgr.service';

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly pgrDownloadService: PgrDownloadService,
    private readonly pgrUploadService: PgrUploadService,
  ) {}

  @Get('/pgr/:docId/:companyId?')
  async downloadPGR(
    @Res() res,
    @User() userPayloadDto: UserPayloadDto,
    @Param('docId') docId: string,
  ) {
    const { fileKey, fileStream } = await this.pgrDownloadService.execute(
      userPayloadDto,
      docId,
    );

    res.setHeader('Content-Disposition', `attachment; filename=${fileKey}`);
    fileStream.pipe(res);
  }

  @Post('/pgr')
  async uploadPGR(
    @Res() res,
    @User() userPayloadDto: UserPayloadDto,
    @Body() upsertPgrDto: UpsertPgrDto,
  ) {
    const { buffer: file, fileName } = await this.pgrUploadService.execute(
      upsertPgrDto,
      userPayloadDto,
    );

    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(file);
  }
}
