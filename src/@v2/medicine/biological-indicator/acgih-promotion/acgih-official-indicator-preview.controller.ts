import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { MedicineRoutes } from '@/@v2/medicine/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { RoleEnum } from '@/shared/constants/enum/authorization';
import { Roles } from '@/shared/decorators/roles.decorator';

import { AcgihPromotionPreviewQuery } from './acgih-official-indicator-preview.dto';
import { AcgihOfficialIndicatorPreviewService } from './acgih-official-indicator-preview.service';

/**
 * 4P.1B — preview/dry-run MASTER-only de promoção ACGIH/BEI → indicador oficial.
 * SOMENTE LEITURA: não cria indicador, regra, vínculo risco/exame nem altera
 * comparação/NR-7/ACGIH-BEI/fonte complementar. Nenhuma escrita.
 */
@Controller(MedicineRoutes.BIOLOGICAL_INDICATORS.BASE)
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.MASTER)
export class AcgihOfficialIndicatorPreviewController {
  constructor(
    private readonly service: AcgihOfficialIndicatorPreviewService,
  ) {}

  @Get(MedicineRoutes.BIOLOGICAL_INDICATORS.ACGIH_PROMOTION_PREVIEW)
  preview(@Query() query: AcgihPromotionPreviewQuery) {
    return this.service.preview({
      includeDivergenceDerived: query.includeDivergenceDerived === 'true',
      search: query.search,
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    });
  }
}
