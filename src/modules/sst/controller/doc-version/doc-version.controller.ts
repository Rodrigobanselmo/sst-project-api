import { Controller, Delete, Get, Param, Post, Query, Body } from '@nestjs/common';

import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { FindByIdDocumentsService } from '../../services/docVersion/find-by-id-documents/find-by-id-documents.service';
import { FindDocumentsService } from '../../services/docVersion/find-documents/find-documents.service';
import { DeleteDocumentVersionService } from '../../services/docVersion/delete-document-version/delete-document-version.service';
import { RegenerateDocumentVersionService } from '../../services/docVersion/regenerate-document-version/regenerate-document-version.service';
import { RegenerateDocumentVersionDto } from '../../dto/regenerate-document-version.dto';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { FindDocVersionDto } from '../../dto/doc-version.dto';
@Controller('/document-version/:companyId')
export class DocumentPgrController {
  constructor(
    private readonly findDocumentsService: FindDocumentsService,
    private readonly findByIdDocumentsService: FindByIdDocumentsService,
    private readonly deleteDocumentVersionService: DeleteDocumentVersionService,
    private readonly regenerateDocumentVersionService: RegenerateDocumentVersionService,
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
  @Get()
  find(@User() userPayloadDto: UserPayloadDto, @Query() query: FindDocVersionDto) {
    return this.findDocumentsService.execute(query, userPayloadDto);
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
  @Get('/:id')
  findById(@Param('id') id: string, @User() userPayloadDto: UserPayloadDto) {
    const companyId = userPayloadDto.targetCompanyId;
    return this.findByIdDocumentsService.execute(id, companyId);
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
  @Delete('/:id')
  delete(@Param('id') id: string, @User() userPayloadDto: UserPayloadDto) {
    return this.deleteDocumentVersionService.execute(id, userPayloadDto);
  }

  @Permissions(
    {
      code: PermissionEnum.PGR,
      isMember: true,
      isContract: true,
      crud: true,
    },
    {
      code: PermissionEnum.PCMSO,
      isMember: true,
      isContract: true,
      crud: true,
    },
  )
  @Post('/:id/regenerate')
  regenerate(
    @Param('id') id: string,
    @Body() body: RegenerateDocumentVersionDto,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.regenerateDocumentVersionService.execute(id, body, userPayloadDto);
  }
}
