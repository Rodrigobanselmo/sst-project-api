import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { RiskCatalogKind } from '@prisma/client';

import { FindGenerateSourceService } from './find-generate-source.service';

describe('FindGenerateSourceService', () => {
  const cacheManager = {
    get: jest.fn<() => Promise<unknown>>(),
    set: jest.fn<() => Promise<void>>(),
  };

  const generateSourceRepository = {
    find: jest.fn<() => Promise<{ data: unknown[]; count: number }>>(),
    findNude: jest.fn<() => Promise<{ data: unknown[]; count: number }>>(),
  };

  const riskCatalogEquivalenceService = {
    getActiveAliasIdsForRiskIds: jest.fn<() => Promise<string[]>>(),
    buildCanonicalCatalogMapForRiskIds: jest.fn<() => Promise<Map<string, string>>>(),
  };

  let service: FindGenerateSourceService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new FindGenerateSourceService(
      cacheManager as any,
      generateSourceRepository as any,
      riskCatalogEquivalenceService as any,
    );
  });

  it('oculta aliases ativos da listagem principal e representAll', async () => {
    const aliasMap = new Map([['alias-gs', 'canonical-gs']]);
    riskCatalogEquivalenceService.getActiveAliasIdsForRiskIds.mockResolvedValue([
      'alias-gs',
    ]);
    riskCatalogEquivalenceService.buildCanonicalCatalogMapForRiskIds.mockResolvedValue(
      aliasMap,
    );
    generateSourceRepository.find.mockResolvedValue({
      data: [
        { id: 'canonical-gs', name: 'Canônico' },
        { id: 'alias-gs', name: 'Alias' },
      ],
      count: 2,
    });
    cacheManager.get.mockResolvedValue({
      data: [{ id: 'alias-gs', name: 'Alias representAll', isAll: true }],
      count: 1,
    });

    const result = await service.execute(
      { riskIds: ['risk-1'], skip: 0, take: 300 },
      { targetCompanyId: 'company-1' } as any,
    );

    expect(generateSourceRepository.find).toHaveBeenCalledWith(
      expect.objectContaining({
        excludeAliasIds: ['alias-gs'],
        riskIds: ['risk-1'],
      }),
      expect.any(Object),
    );
    expect(result.data.map((row: { id: string }) => row.id)).toEqual([
      'canonical-gs',
    ]);
    expect(result.count).toBe(1);
  });

  it('não filtra quando não há equivalências ativas', async () => {
    riskCatalogEquivalenceService.getActiveAliasIdsForRiskIds.mockResolvedValue(
      [],
    );
    riskCatalogEquivalenceService.buildCanonicalCatalogMapForRiskIds.mockResolvedValue(
      new Map(),
    );
    generateSourceRepository.find.mockResolvedValue({
      data: [{ id: 'gs-1', name: 'Item' }],
      count: 1,
    });
    cacheManager.get.mockResolvedValue(undefined);
    generateSourceRepository.findNude.mockResolvedValue({
      data: [{ id: 'gs-all', name: 'RepresentAll' }],
      count: 1,
    });

    const result = await service.execute(
      { riskIds: ['risk-1'], skip: 0, take: 300 },
      { targetCompanyId: 'company-1' } as any,
    );

    expect(result.data).toHaveLength(2);
    expect(
      riskCatalogEquivalenceService.getActiveAliasIdsForRiskIds,
    ).toHaveBeenCalledWith(RiskCatalogKind.GENERATE_SOURCE, ['risk-1']);
  });
});
