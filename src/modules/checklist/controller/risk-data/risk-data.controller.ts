import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { FindAllByGroupAndRiskService } from '../../services/risk-data/find-by-group-risk/find-by-group-risk.service';
import { UpsertManyRiskDataService } from '../../services/risk-data/upsert-many-risk-data/upsert-many-risk-data.service';
import { UpsertRiskDataService } from '../../services/risk-data/upsert-risk-data/upsert-risk.service';
import {
  UpsertManyRiskDataDto,
  UpsertRiskDataDto,
} from './../../dto/risk-data.dto';

@Controller('risk-data')
export class RiskDataController {
  constructor(
    private readonly upsertRiskDataService: UpsertRiskDataService,
    private readonly upsertManyRiskDataService: UpsertManyRiskDataService,
    private readonly findAllByGroupAndRiskService: FindAllByGroupAndRiskService,
  ) {}

  @Post()
  upsert(@Body() upsertRiskDataDto: UpsertRiskDataDto) {
    return this.upsertRiskDataService.execute(upsertRiskDataDto);
  }

  @Post('many')
  upsertMany(@Body() upsertRiskDataDto: UpsertManyRiskDataDto) {
    return this.upsertManyRiskDataService.execute(upsertRiskDataDto);
  }

  @Get('/:companyId/:groupId/:riskId')
  findAllAvailable(
    @User() userPayloadDto: UserPayloadDto,
    @Param('riskId') riskId: string,
    @Param('groupId') groupId: string,
  ) {
    const companyId = userPayloadDto.targetCompanyId;

    return this.findAllByGroupAndRiskService.execute(
      riskId,
      groupId,
      companyId,
    );
  }
}
