import { UserPayloadDto } from './../../../../shared/dto/user-payload.dto';
import { Body, Controller, Post } from '@nestjs/common';

import { UpsertRiskDataRecDto } from '../../dto/risk-data-rec.dto';
import { UpsertRiskDataRecService } from '../../services/risk-data-rec/upsert-risk-data-rec/upsert-risk-data-rec.service';
import { User } from './../../../../shared/decorators/user.decorator';

@Controller('risk-data-rec')
export class RiskDataRecController {
  constructor(
    private readonly upsertRiskDataRecService: UpsertRiskDataRecService,
  ) {}

  @Post()
  upsert(
    @Body() upsertRiskDataDto: UpsertRiskDataRecDto,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.upsertRiskDataRecService.execute(
      upsertRiskDataDto,
      userPayloadDto,
    );
  }
}
