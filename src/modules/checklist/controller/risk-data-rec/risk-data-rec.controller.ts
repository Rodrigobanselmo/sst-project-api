import { UserPayloadDto } from './../../../../shared/dto/user-payload.dto';
import { Body, Controller, Post } from '@nestjs/common';

import { UpsertRiskDataRecDto } from '../../dto/risk-data-rec.dto';
import { UpsertRiskDataRecService } from '../../services/risk-data-rec/upsert-risk-data-rec/upsert-risk-data-rec.service';
import { User } from './../../../../shared/decorators/user.decorator';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
@Controller('risk-data-rec')
export class RiskDataRecController {
  constructor(
    private readonly upsertRiskDataRecService: UpsertRiskDataRecService,
  ) {}

  @Permissions(
    {
      code: PermissionEnum.RISK_DATA,
      crud: true,
      isContract: true,
      isMember: true,
    },
    {
      code: PermissionEnum.ACTION_PLAN,
      crud: 'cu',
      isContract: true,
      isMember: true,
    },
  )
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
