import { Controller, Delete, Get, Param, Query } from '@nestjs/common';

import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { FindByIdDocumentsService } from '../../services/docVersion/find-by-id-documents/find-by-id-documents.service';
import { FindDocumentsService } from '../../services/docVersion/find-documents/find-documents.service';
import { DeleteDocumentVersionService } from '../../services/docVersion/delete-document-version/delete-document-version.service';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { FindDocVersionDto } from '../../dto/doc-version.dto';
@Controller('/document-version/:companyId')
export class DocumentPgrController {
  constructor(
    private readonly findDocumentsService: FindDocumentsService,
    private readonly findByIdDocumentsService: FindByIdDocumentsService,
    private readonly deleteDocumentVersionService: DeleteDocumentVersionService,
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
}
