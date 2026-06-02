import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { RiskCatalogKind } from '@prisma/client';

import { FindRecMedService } from './find-rec-med.service';

describe('FindRecMedService', () => {
  const cacheManager = {
    get: jest.fn<() => Promise<unknown>>(),
    set: jest.fn<() => Promise<void>>(),
  };

  const recMedRepository = {
    find: jest.fn<() => Promise<{ data: unknown[]; count: number }>>(),
    findNude: jest.fn<() => Promise<{ data: unknown[]; count: number }>>(),
  };

  const riskCatalogEquivalenceService = {
    getActiveAliasIdsForRiskIds: jest.fn<() => Promise<string[]>>(),
    buildCanonicalCatalogMapForRiskIds: jest.fn<() => Promise<Map<string, string>>>(),
  };

  let service: FindRecMedService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new FindRecMedService(
      cacheManager as any,
      recMedRepository as any,
      riskCatalogEquivalenceService as any,
    );
  });

  it('oculta aliases ativos respeitando onlyRec', async () => {
    const aliasMap = new Map([['alias-rec', 'canonical-rec']]);
    riskCatalogEquivalenceService.getActiveAliasIdsForRiskIds.mockResolvedValue([
      'alias-rec',
    ]);
    riskCatalogEquivalenceService.buildCanonicalCatalogMapForRiskIds.mockResolvedValue(
      aliasMap,
    );
    recMedRepository.find.mockResolvedValue({
      data: [
        { id: 'canonical-rec', recName: 'Canônico', medName: null },
        { id: 'alias-rec', recName: 'Alias', medName: null },
      ],
      count: 2,
    });
    cacheManager.get.mockResolvedValue(undefined);
    recMedRepository.findNude.mockResolvedValue({ data: [], count: 0 });

    const result = await service.execute(
      { riskIds: ['risk-1'], onlyRec: true, skip: 0, take: 300 },
      { targetCompanyId: 'company-1' } as any,
    );

    expect(recMedRepository.find).toHaveBeenCalledWith(
      expect.objectContaining({
        excludeAliasIds: ['alias-rec'],
        onlyRec: true,
      }),
      expect.any(Object),
    );
    expect(result.data.map((row: { id: string }) => row.id)).toEqual([
      'canonical-rec',
    ]);
    expect(
      riskCatalogEquivalenceService.getActiveAliasIdsForRiskIds,
    ).toHaveBeenCalledWith(RiskCatalogKind.REC_MED, ['risk-1']);
  });
});
