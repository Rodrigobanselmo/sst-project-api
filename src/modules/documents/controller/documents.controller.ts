import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';

import { User } from '../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../shared/dto/user-payload.dto';
import { UpsertPgrDto } from '../dto/pgr.dto';
import { PgrDownloadAttachmentsService } from '../services/pgr/document/download-pgr-attachment-doc.service';
import { PgrDownloadService } from '../services/pgr/document/download-pgr-doc.service';
import { PgrUploadService } from '../services/pgr/document/upload-pgr-doc.service';
import { PgrUploadTableService } from '../services/pgr/tables/upload-pgr-table.service';

@Controller('documents/pgr')
export class DocumentsController {
  constructor(
    private readonly pgrDownloadAttachmentsService: PgrDownloadAttachmentsService,
    private readonly pgrUploadService: PgrUploadTableService,
    private readonly pgrDownloadDocService: PgrDownloadService,
    private readonly pgrUploadDocService: PgrUploadService,
  ) {}

  @Get('/:docId/attachment/:attachmentId/:companyId?')
  async downloadAttachment(
    @Res() res,
    @User() userPayloadDto: UserPayloadDto,
    @Param('docId') docId: string,
    @Param('attachmentId') attachmentId: string,
  ) {
    const { fileKey, fileStream } =
      await this.pgrDownloadAttachmentsService.execute(
        userPayloadDto,
        docId,
        attachmentId,
      );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${
        fileKey.split('/')[fileKey.split('/').length - 1]
      }`,
    );
    fileStream.on('error', function (e) {
      res.status(500).send(e);
    });

    fileStream.pipe(res);
  }

  @Get('/:docId/:companyId?')
  async downloadPGR(
    @Res() res,
    @User() userPayloadDto: UserPayloadDto,
    @Param('docId') docId: string,
  ) {
    const { fileKey, fileStream } = await this.pgrDownloadDocService.execute(
      userPayloadDto,
      docId,
    );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${
        fileKey.split('/')[fileKey.split('/').length - 1]
      }`,
    );
    fileStream.on('error', function (e) {
      res.status(500).send(e);
    });

    fileStream.pipe(res);
  }

  @Post()
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

// @Post('/pgr')
// async uploadPGR(
//   @Res() res,
//   @User() userPayloadDto: UserPayloadDto,
//   @Body() upsertPgrDto: UpsertPgrDto,
// ) {
//   // await this.pgrUploadService.execute(upsertPgrDto, userPayloadDto);
//   // res.send('ok');

//   const { buffer: file, fileName } = await this.pgrUploadService.execute(
//     upsertPgrDto,
//     userPayloadDto,
//   );
//   res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
//   res.send(file);
// }
