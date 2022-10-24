import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { Body, Controller, Post } from '@nestjs/common';

import { User } from '../../../../shared/decorators/user.decorator';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { UpsertRiskDocInfoService } from '../../services/risk-doc-info/upsert-risk-doc-info/upsert-risk-doc-info.service';
import { UpsertRiskDocInfoDto } from '../../dto/risk-doc-info.dto';

@Controller('risk-doc-info')
export class RiskDocInfoController {
  constructor(
    private readonly upsertRiskDocInfoService: UpsertRiskDocInfoService,
  ) {}

  @Permissions({
    code: PermissionEnum.RISK_DOC_INFO,
    isContract: true,
    isMember: true,
  })
  @Post()
  upsert(
    @Body() upsertRiskDataDto: UpsertRiskDocInfoDto,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.upsertRiskDocInfoService.execute(
      upsertRiskDataDto,
      userPayloadDto,
    );
  }
}
