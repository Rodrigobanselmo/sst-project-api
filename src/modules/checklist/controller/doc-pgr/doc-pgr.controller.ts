import { Controller, Get, Param, Query } from '@nestjs/common';

import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { FindByIdDocumentsService } from '../../services/pgr-doc/find-by-id-documents/find-by-id-documents.service';
import { FindDocumentsService } from '../../services/pgr-doc/find-documents/find-documents.service';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { FindDocPgrDto } from '../../dto/doc-pgr.dto';
@Controller('/risk-group-data/documents/:riskGroupId/pgr/:companyId')
export class DocumentPgrController {
  constructor(
    private readonly findDocumentsService: FindDocumentsService,
    private readonly findByIdDocumentsService: FindByIdDocumentsService,
  ) {}

  @Permissions({
    code: PermissionEnum.PGR,
    isMember: true,
    isContract: true,
  })
  @Get()
  find(
    @Param('riskGroupId') riskGroupId: string,
    @User() userPayloadDto: UserPayloadDto,
    @Query() query: FindDocPgrDto,
  ) {
    return this.findDocumentsService.execute(
      riskGroupId,
      query,
      userPayloadDto,
    );
  }

  @Permissions({
    code: PermissionEnum.PGR,
    isMember: true,
    isContract: true,
  })
  @Get('/:id')
  findById(@Param('id') id: string, @User() userPayloadDto: UserPayloadDto) {
    const companyId = userPayloadDto.targetCompanyId;
    return this.findByIdDocumentsService.execute(id, companyId);
  }
}
