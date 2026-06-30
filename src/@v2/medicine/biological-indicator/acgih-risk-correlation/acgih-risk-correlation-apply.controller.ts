import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { MedicineRoutes } from '@/@v2/medicine/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { RoleEnum } from '@/shared/constants/enum/authorization';
import { Roles } from '@/shared/decorators/roles.decorator';
import { User } from '@/shared/decorators/user.decorator';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import { AcgihRiskCorrelationApplyBody } from './acgih-risk-correlation-apply.dto';
import { AcgihRiskCorrelationApplyService } from './acgih-risk-correlation-apply.service';

/**
 * Frente A.3 — apply real (MASTER-only) da correlação ACGIH/BEI × Fatores de
 * Risco. Único ponto de escrita: BiologicalIndicatorToRisk. confirmText é
 * validado no DTO (@Matches). O servidor reexecuta o preview A.1; nenhuma
 * correlação enviada pelo Client é confiada.
 */
@Controller(MedicineRoutes.BIOLOGICAL_INDICATORS.BASE)
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.MASTER)
export class AcgihRiskCorrelationApplyController {
  constructor(private readonly service: AcgihRiskCorrelationApplyService) {}

  @Post(MedicineRoutes.BIOLOGICAL_INDICATORS.ACGIH_RISK_CORRELATION_APPLY)
  apply(
    @Body() body: AcgihRiskCorrelationApplyBody,
    @User() user: UserPayloadDto,
  ) {
    return this.service.apply({
      acgihBeiIndicatorIds: body.acgihBeiIndicatorIds,
      dryRun: body.dryRun,
      userId: user.userId,
    });
  }
}
