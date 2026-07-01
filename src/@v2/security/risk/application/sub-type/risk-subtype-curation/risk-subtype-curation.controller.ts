import { Body, Controller, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { RoleEnum } from '@/shared/constants/enum/authorization';
import { Roles } from '@/shared/decorators/roles.decorator';

import { SubTypeRoutes } from '@/@v2/security/risk/constants/routes';
import {
  BulkAssignRiskSubtypeBody,
  BulkClearRiskSubtypeBody,
  BrowseRiskSubtypeCurationRisksQuery,
  SuggestRiskSubtypeCandidatesBody,
} from './risk-subtype-curation.dto';
import { RiskSubtypeCurationService } from './risk-subtype-curation.service';
import { RiskSubtypeCurationSuggestService } from './risk-subtype-curation-suggest.service';

@Controller(SubTypeRoutes.MASTER_CURATION.BASE)
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.MASTER)
export class RiskSubtypeCurationController {
  constructor(
    private readonly service: RiskSubtypeCurationService,
    private readonly suggestService: RiskSubtypeCurationSuggestService,
  ) {}

  @Get(SubTypeRoutes.MASTER_CURATION.RISKS)
  browseRisks(@Query() query: BrowseRiskSubtypeCurationRisksQuery) {
    return this.service.browseRisks(query);
  }

  @Patch(SubTypeRoutes.MASTER_CURATION.BULK_ASSIGN)
  bulkAssign(@Body() body: BulkAssignRiskSubtypeBody) {
    return this.service.bulkAssign(body);
  }

  @Patch(SubTypeRoutes.MASTER_CURATION.BULK_CLEAR)
  bulkClear(@Body() body: BulkClearRiskSubtypeBody) {
    return this.service.bulkClear(body);
  }

  @Post(SubTypeRoutes.MASTER_CURATION.SUGGEST_CANDIDATES)
  suggestCandidates(@Body() body: SuggestRiskSubtypeCandidatesBody) {
    return this.suggestService.suggestCandidates(body);
  }
}
