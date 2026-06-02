import { RecMedEntity } from './../../../entities/recMed.entity';
import { CacheEnum } from './../../../../../shared/constants/enum/cache';
import { FindRecMedDto } from './../../../dto/rec-med.dto';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { Inject, Injectable } from '@nestjs/common';
import { RiskCatalogKind } from '@prisma/client';
import { Cache } from 'cache-manager';

import { RecMedRepository } from '../../../../../modules/sst/repositories/implementations/RecMedRepository';
import { RiskCatalogEquivalenceService } from '@/shared/risk-catalog-equivalence/risk-catalog-equivalence.service';
import { excludeActiveAliasCatalogRows } from '@/shared/risk-catalog-equivalence/risk-catalog-equivalence.util';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

type CatalogListResult = {
  data: RecMedEntity[];
  count: number;
};

@Injectable()
export class FindRecMedService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly recMedRepository: RecMedRepository,
    private readonly riskCatalogEquivalenceService: RiskCatalogEquivalenceService,
  ) {}

  async execute(
    { skip, take, riskType, ...query }: FindRecMedDto,
    user: UserPayloadDto,
  ) {
    const riskIds = query.riskIds ?? [];
    const excludeAliasIds =
      await this.riskCatalogEquivalenceService.getActiveAliasIdsForRiskIds(
        RiskCatalogKind.REC_MED,
        riskIds,
      );

    const RecMed = await this.recMedRepository.find(
      {
        companyId: user.targetCompanyId,
        ...query,
        ...(excludeAliasIds.length ? { excludeAliasIds } : {}),
      },
      { skip, take },
    );

    const aliasMap =
      await this.riskCatalogEquivalenceService.buildCanonicalCatalogMapForRiskIds(
        RiskCatalogKind.REC_MED,
        riskIds,
      );

    const extCacheString = JSON.stringify({
      onlyRec: query.onlyRec,
      onlyMed: query.onlyMed,
      riskType,
      recType: query.recType,
      medType: query.medType,
    });
    const cacheKey = CacheEnum.REC_MED_REPRESENT_ALL + extCacheString;

    let RecMedAll: CatalogListResult | undefined =
      await this.cacheManager.get(cacheKey);

    if (!RecMedAll) {
      RecMedAll = await this.recMedRepository.findNude({
        where: {
          ...(query.onlyRec && {
            AND: [{ recName: { not: null } }, { recName: { not: '' } }],
          }),
          ...(query.onlyMed && {
            AND: [{ medName: { not: null } }, { medName: { not: '' } }],
          }),
          risk: { representAll: true, ...(riskType && { type: riskType }) },
          id: { notIn: RecMed.data.map((i) => i.id) },
          deleted_at: null,

          ...(query.recType && { recType: { in: query.recType } }),
          ...(query.medType && { medType: { in: query.medType } }),
        },
        distinct: ['medName', 'recName'],
      });

      RecMedAll.data = RecMedAll.data.map((x) => ({ ...x, isAll: true }));

      await this.cacheManager.set(cacheKey, RecMedAll, 360);
    }

    const filteredMain = this.applyAliasExclusion(RecMed, aliasMap);

    if (RecMedAll?.data) {
      const filteredRepresentAll = excludeActiveAliasCatalogRows(
        RecMedAll.data,
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
