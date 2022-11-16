import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateDocumentDto, FindDocumentDto, UpdateDocumentDto } from '../../dto/document.dto';
import { CreateDocumentService } from '../../services/document/create-document/create-document.service';
import { DeleteDocumentService } from '../../services/document/delete-document/delete-document.service';
import { DownloadDocumentService } from '../../services/document/download-document/download-document.service';
import { FindByIdDocumentService } from '../../services/document/find-by-id-document/find-by-id-document.service';
import { FindDocumentService } from '../../services/document/find-document/find-document.service';
import { UpdateDocumentService } from '../../services/document/update-document/update-document.service';

@ApiTags('document')
@Controller('company/:companyId/document')
export class DocumentController {
  constructor(
    private readonly updateDocumentService: UpdateDocumentService,
    private readonly createDocumentService: CreateDocumentService,
    private readonly findDocumentService: FindDocumentService,
    private readonly findByIdDocumentService: FindByIdDocumentService,
    private readonly deleteDocumentService: DeleteDocumentService,
    private readonly downloadDocumentService: DownloadDocumentService,
  ) {}

  @Permissions({
    code: PermissionEnum.DOCUMENTS,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Get()
  find(@User() userPayloadDto: UserPayloadDto, @Query() query: FindDocumentDto) {
    return this.findDocumentService.execute(query, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.DOCUMENTS,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Get('/:id')
  findById(@User() userPayloadDto: UserPayloadDto, @Param('id', ParseIntPipe) id: number) {
    return this.findByIdDocumentService.execute(id, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.DOCUMENTS,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Get('/:id/download')
  async download(@Res() res, @User() userPayloadDto: UserPayloadDto, @Param('id', ParseIntPipe) id: number) {
    const { fileKey, fileStream } = await this.downloadDocumentService.execute(id, userPayloadDto);

    res.setHeader('Content-Disposition', `attachment; filename=${fileKey.split('/')[fileKey.split('/').length - 1]}`);

    fileStream.on('error', function (e) {
      res.status(500).send(e);
    });

    fileStream.pipe(res);
  }

  @Permissions({
    code: PermissionEnum.DOCUMENTS,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Post()
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 1000000000 } }))
  create(@UploadedFile() file: Express.Multer.File, @Body() createDto: CreateDocumentDto, @User() userPayloadDto: UserPayloadDto) {
    return this.createDocumentService.execute(createDto, userPayloadDto, file);
  }

  @Permissions({
    code: PermissionEnum.DOCUMENTS,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Patch('/:id')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 1000000000 } }))
  update(@UploadedFile() file: Express.Multer.File, @Body() update: UpdateDocumentDto, @User() userPayloadDto: UserPayloadDto, @Param('id', ParseIntPipe) id: number) {
    return this.updateDocumentService.execute({ ...update, id }, userPayloadDto, file);
  }

  @Permissions({
    code: PermissionEnum.DOCUMENTS,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Delete('/:id')
  delete(@User() userPayloadDto: UserPayloadDto, @Param('id', ParseIntPipe) id: number) {
    return this.deleteDocumentService.execute(id, userPayloadDto);
  }
}
