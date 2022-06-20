import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';

import { User } from '../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../shared/dto/user-payload.dto';
import { UpsertPgrDto } from '../dto/pgr.dto';
import { PgrDownloadService } from '../services/pgr/document/download-pgr-doc.service';
import { PgrUploadService } from '../services/pgr/document/upload-pgr-doc.service';
import { PgrDownloadTableService } from '../services/pgr/tables/download-pgr-table.service';
import { PgrUploadTableService } from '../services/pgr/tables/upload-pgr-table.service';

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly pgrDownloadService: PgrDownloadTableService,
    private readonly pgrUploadService: PgrUploadTableService,
    private readonly pgrDownloadDocService: PgrDownloadService,
    private readonly pgrUploadDocService: PgrUploadService,
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
    fileStream.on('error', function (e) {
      res.status(500).send(e);
    });

    fileStream.pipe(res);
  }

  @Post('/pgr')
  async uploadPGR(
    @Res() res,
    @User() userPayloadDto: UserPayloadDto,
    @Body() upsertPgrDto: UpsertPgrDto,
  ) {
    // await this.pgrUploadService.execute(upsertPgrDto, userPayloadDto);
    // res.send('ok');

    const { buffer: file, fileName } = await this.pgrUploadService.execute(
      upsertPgrDto,
      userPayloadDto,
    );
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(file);
  }

  @Post('/pgr/doc')
  async uploadPGRDoc(
    @Res() res,
    @User() userPayloadDto: UserPayloadDto,
    @Body() upsertPgrDto: UpsertPgrDto,
  ) {
    // await this.pgrUploadService.execute(upsertPgrDto, userPayloadDto);
    // res.send('ok');

    const { buffer: file, fileName } = await this.pgrUploadDocService.execute(
      upsertPgrDto,
      userPayloadDto,
    );
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(file);
  }
}
