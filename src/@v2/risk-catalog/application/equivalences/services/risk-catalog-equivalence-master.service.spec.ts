import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  RiskCatalogEquivalenceType,
  RiskCatalogKind,
} from '@prisma/client';

import { RiskCatalogEquivalenceService } from '@/shared/risk-catalog-equivalence/risk-catalog-equivalence.service';

import { RiskCatalogEquivalenceMasterService } from './risk-catalog-equivalence-master.service';

describe('RiskCatalogEquivalenceMasterService', () => {
  const prisma = {
    riskCatalogEquivalence: {
      findMany: jest.fn<() => Promise<unknown>>(),
      findUnique: jest.fn<() => Promise<unknown>>(),
    },
    generateSource: {
      findMany: jest.fn<() => Promise<unknown>>(),
      findFirst: jest.fn<() => Promise<unknown>>(),
      findUnique: jest.fn<() => Promise<unknown>>(),
    },
    recMed: { findMany: jest.fn<() => Promise<unknown>>() },
    riskFactors: { findUnique: jest.fn<() => Promise<unknown>>() },
    riskFactorData: { count: jest.fn<() => Promise<number>>() },
    recMedOnRiskData: { count: jest.fn<() => Promise<number>>() },
    engsToRiskFactorData: { count: jest.fn<() => Promise<number>>() },
    riskFactorDataRec: { count: jest.fn<() => Promise<number>>() },
    riskFactorDataRecDerivedMeasure: { count: jest.fn<() => Promise<number>>() },
    characterizationPhotoRecommendation: {
      count: jest.fn<() => Promise<number>>(),
    },
  };

  const equivalenceService = {
    registerEquivalence: jest.fn<() => Promise<unknown>>(),
    revokeEquivalence: jest.fn<() => Promise<unknown>>(),
  };

  let service: RiskCatalogEquivalenceMasterService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new RiskCatalogEquivalenceMasterService(
      prisma as any,
      equivalenceService as unknown as RiskCatalogEquivalenceService,
    );
  });

  it('previewImpact para GenerateSource retorna contagens sem escrever dados', async () => {
    prisma.generateSource.findFirst
      .mockResolvedValueOnce({ id: 'canonical-1', riskId: 'risk-1' })
      .mockResolvedValueOnce({ id: 'alias-1', riskId: 'risk-1' });
    prisma.generateSource.findUnique.mockResolvedValue({
      _count: { riskFactorData: 3 },
    });
    prisma.riskFactorData.count
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(0);

    const result = await service.previewImpact({
      kind: RiskCatalogKind.GENERATE_SOURCE,
      canonicalId: 'canonical-1',
      aliasId: 'alias-1',
      riskId: 'risk-1',
    });

    expect('generateSource' in result && result.generateSource).toEqual({
      riskFactorDataWithAlias: 2,
      riskFactorDataWithCanonical: 1,
      riskFactorDataDuplicateIfMigrated: 0,
      m2mLinksWithAlias: 3,
    });
    expect(equivalenceService.registerEquivalence).not.toHaveBeenCalled();
  });

  it('registerEquivalence delega ao serviço com labels e confirmedById', async () => {
    prisma.generateSource.findFirst
      .mockResolvedValueOnce({ name: 'Canônico' })
      .mockResolvedValueOnce({ name: 'Alias' });
    equivalenceService.registerEquivalence.mockResolvedValue({ id: 'eq-1' });
    prisma.riskCatalogEquivalence.findUnique.mockResolvedValue({
      id: 'eq-1',
      kind: RiskCatalogKind.GENERATE_SOURCE,
    });

    await service.registerEquivalence({
      kind: RiskCatalogKind.GENERATE_SOURCE,
      equivalenceType: RiskCatalogEquivalenceType.SEMANTIC_ALIAS,
      riskId: 'risk-1',
      canonicalId: 'canonical-1',
      aliasId: 'alias-1',
      confirmedById: 42,
    });

    expect(equivalenceService.registerEquivalence).toHaveBeenCalledWith(
      expect.objectContaining({
        canonicalLabel: 'Canônico',
        aliasLabel: 'Alias',
        confirmedById: 42,
      }),
    );
  });

  it('previewImpact com IDs inválidos retorna NotFound', async () => {
    prisma.generateSource.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 'alias-1', riskId: 'risk-1' });

    await expect(
      service.previewImpact({
        kind: RiskCatalogKind.GENERATE_SOURCE,
        canonicalId: 'missing',
        aliasId: 'alias-1',
        riskId: 'risk-1',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('revokeEquivalence delega ao serviço compartilhado', async () => {
    equivalenceService.revokeEquivalence.mockResolvedValue({ id: 'eq-1' });
    prisma.riskCatalogEquivalence.findUnique.mockResolvedValue({
      id: 'eq-1',
      revokedAt: new Date(),
    });

    await service.revokeEquivalence('eq-1', 'duplicata incorreta');

    expect(equivalenceService.revokeEquivalence).toHaveBeenCalledWith(
      'eq-1',
      'duplicata incorreta',
    );
  });

  it('searchCatalogItems normaliza pontuação final no texto de busca', async () => {
    prisma.generateSource.findMany.mockResolvedValue([]);
    prisma.riskCatalogEquivalence.findMany.mockResolvedValue([]);

    await service.searchCatalogItems({
      kind: RiskCatalogKind.GENERATE_SOURCE,
      search: 'Comunicação interna ineficaz.',
    });

    expect(prisma.generateSource.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          AND: expect.arrayContaining([
            expect.objectContaining({
              name: expect.objectContaining({
                contains: 'Comunicação interna ineficaz',
              }),
            }),
          ]),
        }),
      }),
    );
  });

  it('searchCatalogItems global GenerateSource com termo longo e ponto final não lança erro', async () => {
    prisma.generateSource.findMany.mockResolvedValue([
      {
        id: 'gs-1',
        riskId: 'risk-1',
        name: 'Comunicação interna ineficaz, com omissão ou retenção de informações.',
        companyId: 'company-1',
        system: true,
        deleted_at: null,
        company: { name: 'Empresa A' },
        risk: { name: 'Risco A' },
      },
    ]);
    prisma.riskCatalogEquivalence.findMany.mockResolvedValue([]);

    const rows = await service.searchCatalogItems({
      kind: RiskCatalogKind.GENERATE_SOURCE,
      search:
        'Comunicação interna ineficaz, com omissão ou retenção de informações.',
      includeSystem: true,
    });

    expect(rows).toHaveLength(1);
    expect(rows[0].label).toContain('Comunicação interna ineficaz');
  });

  it('searchCatalogItems global RecMed sem companyId e riskId não lança erro', async () => {
    prisma.recMed.findMany.mockResolvedValue([
      {
        id: 'rm-1',
        riskId: 'risk-1',
        recName: 'Falta de cultura de trabalho em equipe',
        medName: null,
        recType: null,
        medType: null,
        companyId: 'company-1',
        system: false,
        deleted_at: null,
        company: { name: 'Empresa B' },
        risk: { name: 'Risco B' },
      },
    ]);
    prisma.riskCatalogEquivalence.findMany.mockResolvedValue([]);

    const rows = await service.searchCatalogItems({
      kind: RiskCatalogKind.REC_MED,
      search: 'Falta de cultura',
      includeSystem: true,
    });

    expect(rows).toHaveLength(1);
    expect(prisma.recMed.findMany).toHaveBeenCalled();
  });

  it('searchCatalogItems com companyId usa visibilidade por empresa', async () => {
    prisma.generateSource.findMany.mockResolvedValue([]);
    prisma.riskCatalogEquivalence.findMany.mockResolvedValue([]);

    await service.searchCatalogItems({
      kind: RiskCatalogKind.GENERATE_SOURCE,
      companyId: 'company-simplesst',
      search: 'Comunicação',
      includeSystem: true,
    });

    expect(prisma.generateSource.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          AND: expect.arrayContaining([
            expect.objectContaining({
              OR: expect.arrayContaining([
                expect.objectContaining({ companyId: 'company-simplesst' }),
              ]),
            }),
          ]),
        }),
      }),
    );
  });

  it('searchCatalogItems sem companyId busca global em GenerateSource', async () => {
    prisma.generateSource.findMany.mockResolvedValue([
      {
        id: 'gs-1',
        riskId: 'risk-1',
        name: 'Comunicação interna ineficaz',
        companyId: 'company-sindicato',
        system: false,
        deleted_at: null,
        company: { name: 'Sindicato' },
        risk: { name: 'Assédio' },
      },
    ]);
    prisma.riskCatalogEquivalence.findMany.mockResolvedValue([]);

    const rows = await service.searchCatalogItems({
      kind: RiskCatalogKind.GENERATE_SOURCE,
      search: 'Comunicação interna',
    });

    expect(rows).toHaveLength(1);
    expect(prisma.generateSource.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          AND: expect.arrayContaining([
            expect.objectContaining({
              name: expect.objectContaining({
                contains: 'Comunicação interna',
              }),
            }),
          ]),
        }),
      }),
    );
  });

  it('previewImpact rejeita alias igual ao canônico', async () => {
    await expect(
      service.previewImpact({
        kind: RiskCatalogKind.REC_MED,
        canonicalId: 'same',
        aliasId: 'same',
        riskId: 'risk-1',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
