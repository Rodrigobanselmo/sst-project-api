import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { MedicineRoutes } from '@/@v2/medicine/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { RoleEnum } from '@/shared/constants/enum/authorization';
import { Roles } from '@/shared/decorators/roles.decorator';
import { User } from '@/shared/decorators/user.decorator';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import { AcgihRiskCorrelationConsolidateBody } from './acgih-risk-correlation-consolidate.dto';
import { AcgihRiskCorrelationConsolidateService } from './acgih-risk-correlation-consolidate.service';

/**
 * Fix — consolidação completa (MASTER-only) dos ACGIH/BEI da correlação como
 * indicadores oficiais. Único ponto de escrita: OccupationalBiologicalIndicator
 * (reusa o create da promoção 4P.2). confirmText validado no DTO (@Matches). O
 * servidor reexecuta o preview de correlação; nada do Client é confiado.
 */
@Controller(MedicineRoutes.BIOLOGICAL_INDICATORS.BASE)
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.MASTER)
export class AcgihRiskCorrelationConsolidateController {
  constructor(
    private readonly service: AcgihRiskCorrelationConsolidateService,
  ) {}

  @Post(MedicineRoutes.BIOLOGICAL_INDICATORS.ACGIH_RISK_CORRELATION_CONSOLIDATE)
  consolidate(
    @Body() _body: AcgihRiskCorrelationConsolidateBody,
    @User() user: UserPayloadDto,
  ) {
    return this.service.consolidate({ userId: user.userId });
  }
}
