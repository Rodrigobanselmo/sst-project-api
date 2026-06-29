import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { MedicineRoutes } from '@/@v2/medicine/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { RoleEnum } from '@/shared/constants/enum/authorization';
import { Roles } from '@/shared/decorators/roles.decorator';

import { AcgihRiskCorrelationPreviewQuery } from './acgih-risk-correlation.dto';
import { AcgihRiskCorrelationService } from './acgih-risk-correlation.service';

/**
 * Frente A.1 — preview MASTER-only (SOMENTE LEITURA) da correlação ACGIH/BEI →
 * Fatores de Risco. Não cria indicador, vínculo risco/exame, regra na Biblioteca
 * nem altera ACGIH/NR-7. Nenhuma escrita; nenhum apply/sync.
 */
@Controller(MedicineRoutes.BIOLOGICAL_INDICATORS.BASE)
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.MASTER)
export class AcgihRiskCorrelationController {
  constructor(private readonly service: AcgihRiskCorrelationService) {}

  @Get(MedicineRoutes.BIOLOGICAL_INDICATORS.ACGIH_RISK_CORRELATION_PREVIEW)
  preview(@Query() query: AcgihRiskCorrelationPreviewQuery) {
    return this.service.preview({ search: query.search });
  }
}
