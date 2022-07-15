import { Controller, Get, Param } from '@nestjs/common';

import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { FindByIdDocumentsService } from '../../services/pgr-doc/find-by-id-documents/find-by-id-documents.service';
import { FindDocumentsService } from '../../services/pgr-doc/find-documents/find-documents.service';

@Controller('/risk-group-data/documents/:riskGroupId/pgr/:companyId')
export class DocumentPgrController {
  constructor(
    private readonly findDocumentsService: FindDocumentsService,
    private readonly findByIdDocumentsService: FindByIdDocumentsService,
  ) {}

  @Get()
  findDocuments(
    @Param('riskGroupId') riskGroupId: string,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    const companyId = userPayloadDto.targetCompanyId;
    return this.findDocumentsService.execute(riskGroupId, companyId);
  }

  @Get('/:id')
  findById(@Param('id') id: string, @User() userPayloadDto: UserPayloadDto) {
    const companyId = userPayloadDto.targetCompanyId;
    return this.findByIdDocumentsService.execute(id, companyId);
  }
}
