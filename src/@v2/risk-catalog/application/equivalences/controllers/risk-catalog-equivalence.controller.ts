import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { RiskCatalogRoutes } from '@/@v2/risk-catalog/constants/routes';
import { RoleEnum } from '@/shared/constants/enum/authorization';
import { Roles } from '@/shared/decorators/roles.decorator';
import { User } from '@/shared/decorators/user.decorator';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import { RiskCatalogEquivalenceMasterService } from '../services/risk-catalog-equivalence-master.service';
import {
  BrowseRiskCatalogEquivalencesQuery,
  PreviewRiskCatalogEquivalenceImpactPayload,
  RegisterRiskCatalogEquivalencePayload,
  RevokeRiskCatalogEquivalencePath,
  RevokeRiskCatalogEquivalencePayload,
  SearchRiskCatalogItemsQuery,
} from './risk-catalog-equivalence.dto';

@Controller(RiskCatalogRoutes.EQUIVALENCES.BASE)
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.MASTER)
export class RiskCatalogEquivalenceController {
  constructor(
    private readonly masterService: RiskCatalogEquivalenceMasterService,
  ) {}

  @Get(RiskCatalogRoutes.EQUIVALENCES.SEARCH)
  search(
    @Query() query: SearchRiskCatalogItemsQuery,
    @User() user: UserPayloadDto,
  ) {
    const companyId = query.companyId?.trim() || undefined;
    return this.masterService.searchCatalogItems({
      kind: query.kind,
      companyId,
      riskId: query.riskId,
      search: query.search,
      includeSystem: query.includeSystem,
      includeDeleted: query.includeDeleted,
    });
  }

  @Get()
  browse(@Query() query: BrowseRiskCatalogEquivalencesQuery) {
    return this.masterService.browseEquivalences({
      kind: query.kind,
      riskId: query.riskId,
      canonicalId: query.canonicalId,
      aliasId: query.aliasId,
      includeRevoked: query.includeRevoked,
    });
  }

  @Post(RiskCatalogRoutes.EQUIVALENCES.IMPACT_PREVIEW)
  impactPreview(@Body() body: PreviewRiskCatalogEquivalenceImpactPayload) {
    return this.masterService.previewImpact({
      kind: body.kind,
      canonicalId: body.canonicalId,
      aliasId: body.aliasId,
      riskId: body.riskId,
    });
  }

  @Post()
  register(
    @Body() body: RegisterRiskCatalogEquivalencePayload,
    @User() user: UserPayloadDto,
  ) {
    return this.masterService.registerEquivalence({
      ...body,
      confirmedById: user.userId,
    });
  }

  @Patch(RiskCatalogRoutes.EQUIVALENCES.REVOKE)
  revoke(
    @Param() path: RevokeRiskCatalogEquivalencePath,
    @Body() body: RevokeRiskCatalogEquivalencePayload,
  ) {
    return this.masterService.revokeEquivalence(path.id, body.revokeReason);
  }
}
