import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { UpsertRiskGroupDataDto } from '../../dto/risk-group-data.dto';
import { FindAllByCompanyService } from '../../services/risk-group-data/find-by-company/find-by-company.service';
import { FindByIdService } from '../../services/risk-group-data/find-by-id/find-by-id.service';
import { FindDocumentsService } from '../../services/pgr-doc/find-documents/find-documents.service';
import { UpsertRiskGroupDataService } from '../../services/risk-group-data/upsert-risk-group-data/upsert-risk-group-data.service';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
@Controller('risk-group-data')
export class RiskGroupDataController {
  constructor(
    private readonly upsertRiskGroupDataService: UpsertRiskGroupDataService,
    private readonly findAllByCompanyService: FindAllByCompanyService,
    private readonly findByIdService: FindByIdService,
  ) {}

  @Permissions({
    code: PermissionEnum.MANAGEMENT,
    isContract: true,
    isMember: true,
    crud: 'cu',
  })
  @Post()
  upsert(@Body() upsertRiskGroupDataDto: UpsertRiskGroupDataDto) {
    return this.upsertRiskGroupDataService.execute(upsertRiskGroupDataDto);
  }

  @Permissions({
    code: PermissionEnum.MANAGEMENT,
    isContract: true,
    isMember: true,
  })
  @Get('/:companyId')
  findAllAvailable(@User() userPayloadDto: UserPayloadDto) {
    const companyId = userPayloadDto.targetCompanyId;
    return this.findAllByCompanyService.execute(companyId);
  }

  @Permissions({
    code: PermissionEnum.MANAGEMENT,
    isContract: true,
    isMember: true,
  })
  @Get('/:id/:companyId')
  findById(@Param('id') id: string, @User() userPayloadDto: UserPayloadDto) {
    const companyId = userPayloadDto.targetCompanyId;
    return this.findByIdService.execute(id, companyId);
  }
}
