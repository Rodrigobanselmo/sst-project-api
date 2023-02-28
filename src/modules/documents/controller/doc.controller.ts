import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { DocumentTypeEnum } from '@prisma/client';
import { Readable } from 'stream';

import { PermissionEnum } from '../../../shared/constants/enum/authorization';
import { Permissions } from '../../../shared/decorators/permissions.decorator';
import { User } from '../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../shared/dto/user-payload.dto';
import { IGetDocumentModel, UploadDocumentDto } from '../dto/document.dto';
import { AddQueueDocumentService } from '../services/document/document/add-queue-doc.service';
import { DownloadAttachmentsService } from '../services/document/document/download-attachment-doc.service';
import { DownloadDocumentService } from '../services/document/document/download-doc.service';
import { GetDocVariablesService } from '../services/document/document/get-doc-variables.service';
import { Response } from 'express';

@Controller('documents/base')
export class DocumentsBaseController {
  constructor(
    private readonly pgrDownloadAttachmentsService: DownloadAttachmentsService,
    private readonly downloadDocService: DownloadDocumentService,
    private readonly addQueueDocumentService: AddQueueDocumentService,
    private readonly getDocVariablesService: GetDocVariablesService,
  ) {}

  @Permissions(
    {
      code: PermissionEnum.PGR,
      isMember: true,
      isContract: true,
    },
    {
      code: PermissionEnum.PCMSO,
      isMember: true,
      isContract: true,
    },
  )
  @Get('/:docId/attachment/:attachmentId/:companyId?')
  async downloadAttachment(@Res() res, @User() userPayloadDto: UserPayloadDto, @Param('docId') docId: string, @Param('attachmentId') attachmentId: string) {
    const { fileKey, fileStream } = await this.pgrDownloadAttachmentsService.execute(userPayloadDto, docId, attachmentId);

    res.setHeader('Content-Disposition', `attachment; filename=${fileKey.split('/')[fileKey.split('/').length - 1]}`);
    fileStream.on('error', function (e) {
      res.status(500).send(e);
    });

    fileStream.pipe(res);
  }

  @Permissions(
    {
      code: PermissionEnum.PGR,
      isMember: true,
      isContract: true,
    },
    {
      code: PermissionEnum.PCMSO,
      isMember: true,
      isContract: true,
    },
  )
  @Get('/:docId/:companyId?')
  async download(@Res() res, @User() userPayloadDto: UserPayloadDto, @Param('docId') docId: string) {
    const { fileKey, fileStream } = await this.downloadDocService.execute(userPayloadDto, docId);

    res.setHeader('Content-Disposition', `attachment; filename=${fileKey.split('/')[fileKey.split('/').length - 1]}`);
    fileStream.on('error', function (e) {
      res.status(500).send(e);
    });

    fileStream.pipe(res);
  }

  @Permissions({
    code: PermissionEnum.PGR,
    isMember: true,
    isContract: true,
    crud: true,
  })
  @Post('/add-queue/pgr')
  async addQueueDoc(@User() userPayloadDto: UserPayloadDto, @Body() upsertPgrDto: UploadDocumentDto) {
    upsertPgrDto.type = DocumentTypeEnum.PGR;
    return this.addQueueDocumentService.execute(upsertPgrDto, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.PCMSO,
    isMember: true,
    isContract: true,
    crud: true,
  })
  @Post('/add-queue/pcmso')
  async addPCMSOQueueDoc(@User() userPayloadDto: UserPayloadDto, @Body() upsertPgrDto: UploadDocumentDto) {
    upsertPgrDto.type = DocumentTypeEnum.PCSMO;
    return this.addQueueDocumentService.execute(upsertPgrDto, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.PGR,
    isMember: true,
    isContract: true,
    crud: true,
  })
  @Post('/model/pgr')
  async getPGRDocumentModel(@Res() response: Response, @Body() body: IGetDocumentModel) {
    body.type = DocumentTypeEnum.PGR;
    const json = await this.getDocVariablesService.execute(body);
    const jsonStream = new Readable({
      read() {
        this.push(JSON.stringify(json));
        this.push(null);
      },
    });

    response.setHeader('Content-Type', 'application/json');
    jsonStream.pipe(response);
  }
}
