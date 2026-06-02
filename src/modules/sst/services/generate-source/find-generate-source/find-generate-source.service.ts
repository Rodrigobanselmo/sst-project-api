import { FindGenerateSourceDto } from './../../../dto/generate-source.dto';
import { GenerateSourceEntity } from '../../../entities/generateSource.entity';
import { CacheEnum } from '../../../../../shared/constants/enum/cache';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { Inject, Injectable } from '@nestjs/common';
import { RiskCatalogKind } from '@prisma/client';
import { Cache } from 'cache-manager';

import { GenerateSourceRepository } from '../../../repositories/implementations/GenerateSourceRepository';
import { RiskCatalogEquivalenceService } from '@/shared/risk-catalog-equivalence/risk-catalog-equivalence.service';
import { excludeActiveAliasCatalogRows } from '@/shared/risk-catalog-equivalence/risk-catalog-equivalence.util';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

type CatalogListResult = {
  data: GenerateSourceEntity[];
  count: number;
};

@Injectable()
export class FindGenerateSourceService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly generateSourceRepository: GenerateSourceRepository,
    private readonly riskCatalogEquivalenceService: RiskCatalogEquivalenceService,
  ) {}

  async execute(
    { skip, take, riskType, ...query }: FindGenerateSourceDto,
    user: UserPayloadDto,
  ) {
    const riskIds = query.riskIds ?? [];
    const excludeAliasIds =
      await this.riskCatalogEquivalenceService.getActiveAliasIdsForRiskIds(
        RiskCatalogKind.GENERATE_SOURCE,
        riskIds,
      );

    const GenerateSource = await this.generateSourceRepository.find(
      {
        companyId: user.targetCompanyId,
        ...query,
        ...(excludeAliasIds.length ? { excludeAliasIds } : {}),
      },
      { skip, take },
    );

    const aliasMap =
      await this.riskCatalogEquivalenceService.buildCanonicalCatalogMapForRiskIds(
        RiskCatalogKind.GENERATE_SOURCE,
        riskIds,
      );

    const cacheKey = CacheEnum.GS_REPRESENT_ALL;

    let GenerateSourceAll: CatalogListResult | undefined =
      await this.cacheManager.get(cacheKey);

    if (!GenerateSourceAll) {
      GenerateSourceAll = await this.generateSourceRepository.findNude({
        where: {
          deleted_at: null,
          risk: { representAll: true, ...(riskType && { type: riskType }) },
        },
        distinct: ['name'],
      });

      GenerateSourceAll.data = GenerateSourceAll.data.map((x) => ({
        ...x,
        isAll: true,
      }));
      await this.cacheManager.set(cacheKey, GenerateSourceAll, 360);
    }

    const filteredMain = this.applyAliasExclusion(GenerateSource, aliasMap);

    if (GenerateSourceAll?.data) {
      const filteredRepresentAll = excludeActiveAliasCatalogRows(
        GenerateSourceAll.data,
        aliasMap,
      );
      filteredMain.data.unshift(...filteredRepresentAll);
    }

    return filteredMain;
  }

  private applyAliasExclusion(
    result: CatalogListResult,
    aliasMap: ReadonlyMap<string, string>,
  ): CatalogListResult {
    if (!aliasMap.size) return result;

    const data = excludeActiveAliasCatalogRows(result.data, aliasMap);
    const removed = result.data.length - data.length;

    return {
      data,
      count: Math.max(0, result.count - removed),
    };
  }
}
