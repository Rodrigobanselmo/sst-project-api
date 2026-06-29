import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { MedicineRoutes } from '@/@v2/medicine/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { RoleEnum } from '@/shared/constants/enum/authorization';
import { Roles } from '@/shared/decorators/roles.decorator';
import { User } from '@/shared/decorators/user.decorator';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import { AcgihPromotionApplyBody } from './acgih-official-indicator-apply.dto';
import { AcgihOfficialIndicatorApplyService } from './acgih-official-indicator-apply.service';

/**
 * 4P.2A — promoção real (MASTER-only) de candidatos ACGIH/BEI elegíveis para
 * OccupationalBiologicalIndicator DRAFT. Único ponto de escrita do módulo de
 * promoção. Não cria regra Biblioteca, não vincula risco/exame, não ativa
 * indicador, não altera NR-7/ACGIH origem/comparação/fonte complementar/sync.
 */
@Controller(MedicineRoutes.BIOLOGICAL_INDICATORS.BASE)
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.MASTER)
export class AcgihOfficialIndicatorApplyController {
  constructor(private readonly service: AcgihOfficialIndicatorApplyService) {}

  @Post(MedicineRoutes.BIOLOGICAL_INDICATORS.ACGIH_PROMOTION_APPLY)
  apply(
    @Body() body: AcgihPromotionApplyBody,
    @User() user: UserPayloadDto,
  ) {
    return this.service.apply({
      acgihBeiIndicatorIds: body.acgihBeiIndicatorIds,
      includeDivergenceDerived: body.includeDivergenceDerived,
      userId: user.userId,
    });
  }
}
