import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { UpsertRiskGroupDataDto } from '../../dto/risk-group-data.dto';
import { FindAllByCompanyService } from '../../services/risk-group-data/find-by-company/find-by-company.service';
import { FindByIdService } from '../../services/risk-group-data/find-by-id/find-by-id.service';
import { FindDocumentsService } from '../../services/risk-group-data/find-documents/find-documents.service';
import { UpsertRiskGroupDataService } from '../../services/risk-group-data/upsert-risk-group-data/upsert-risk-group-data.service';

@Controller('risk-group-data')
export class RiskGroupDataController {
  constructor(
    private readonly upsertRiskGroupDataService: UpsertRiskGroupDataService,
    private readonly findAllByCompanyService: FindAllByCompanyService,
    private readonly findByIdService: FindByIdService,
    private readonly findDocumentsService: FindDocumentsService,
  ) {}

  @Post()
  upsert(@Body() upsertRiskGroupDataDto: UpsertRiskGroupDataDto) {
    return this.upsertRiskGroupDataService.execute(upsertRiskGroupDataDto);
  }

  @Get('/:companyId')
  findAllAvailable(@User() userPayloadDto: UserPayloadDto) {
    const companyId = userPayloadDto.targetCompanyId;
    return this.findAllByCompanyService.execute(companyId);
  }

  @Get('/:id/:companyId')
  findById(@Param('id') id: string, @User() userPayloadDto: UserPayloadDto) {
    const companyId = userPayloadDto.targetCompanyId;
    return this.findByIdService.execute(id, companyId);
  }

  @Get('documents/:riskGroupId/:companyId')
  findDocuments(
    @Param('riskGroupId') riskGroupId: string,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    const companyId = userPayloadDto.targetCompanyId;
    return this.findDocumentsService.execute(riskGroupId, companyId);
  }
}
