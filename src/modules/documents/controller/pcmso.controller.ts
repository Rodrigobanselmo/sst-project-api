import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';

import { PermissionEnum } from '../../../shared/constants/enum/authorization';
import { Permissions } from '../../../shared/decorators/permissions.decorator';
import { User } from '../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../shared/dto/user-payload.dto';
import { UpsertDocumentDto, UpsertPcmsoDocumentDto } from '../dto/pgr.dto';
import { AddQueueDocumentService } from '../services/pgr/document/add-queue-doc.service';
import { DownloadAttachmentsService } from '../services/pgr/document/download-attachment-doc.service';
import { DownloadDocumentService } from '../services/pgr/document/download-doc.service';
import { PcmsoUploadService } from '../services/pgr/document/upload-pcmso-doc.service';

@Controller('documents/pcmso')
export class DocumentsPcmsoController {
  constructor(
    private readonly pcmsoDownloadAttachmentsService: DownloadAttachmentsService,
    private readonly pcmsoDownloadDocService: DownloadDocumentService,
    private readonly pcmsoUploadDocService: PcmsoUploadService,
    private readonly addQueuePCMSODocumentService: AddQueueDocumentService,
  ) {}

  @Permissions({
    code: PermissionEnum.PCMSO,
    isMember: true,
    isContract: true,
  })
  @Get('/:docId/attachment/:attachmentId/:companyId?')
  async downloadAttachment(
    @Res() res,
    @User() userPayloadDto: UserPayloadDto,
    @Param('docId') docId: string,
    @Param('attachmentId') attachmentId: string,
  ) {
    const { fileKey, fileStream } =
      await this.pcmsoDownloadAttachmentsService.execute(
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

  @Permissions({
    code: PermissionEnum.PCMSO,
    isMember: true,
    isContract: true,
  })
  @Get('/:docId/:companyId?')
  async downloadPCMSO(
    @Res() res,
    @User() userPayloadDto: UserPayloadDto,
    @Param('docId') docId: string,
  ) {
    const { fileKey, fileStream } = await this.pcmsoDownloadDocService.execute(
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

  @Permissions({
    code: PermissionEnum.PCMSO,
    isMember: true,
    isContract: true,
    crud: true,
  })
  @Post()
  async uploadPCMSODoc(
    @Res() res,
    @User() userPayloadDto: UserPayloadDto,
    @Body() upsertPcmsoDto: UpsertPcmsoDocumentDto,
  ) {
    const { buffer: file, fileName } = await this.pcmsoUploadDocService.execute(
      {
        ...upsertPcmsoDto,
        companyId: userPayloadDto.targetCompanyId,
      },
    );
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(file);
  }

  @Permissions({
    code: PermissionEnum.PCMSO,
    isMember: true,
    isContract: true,
    crud: true,
  })
  @Post('/add-queue')
  async addQueuePCMSODoc(
    @User() user: UserPayloadDto,
    @Body() dto: UpsertDocumentDto,
  ) {
    dto.isPCMSO = true;
    return this.addQueuePCMSODocumentService.execute(dto, user);
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
