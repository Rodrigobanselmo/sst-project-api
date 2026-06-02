import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BadRequestException } from '@nestjs/common';
import { RiskCatalogEquivalenceType, RiskCatalogKind } from '@prisma/client';

import { RiskCatalogEquivalenceService } from './risk-catalog-equivalence.service';

describe('RiskCatalogEquivalenceService', () => {
  const prisma = {
    riskCatalogEquivalence: {
      findFirst: jest.fn<() => Promise<unknown>>(),
      findMany: jest.fn<() => Promise<unknown>>(),
      create: jest.fn<() => Promise<unknown>>(),
      findUnique: jest.fn<() => Promise<unknown>>(),
      update: jest.fn<() => Promise<unknown>>(),
    },
    generateSource: { findFirst: jest.fn<() => Promise<unknown>>() },
    recMed: { findFirst: jest.fn<() => Promise<unknown>>() },
  };

  let service: RiskCatalogEquivalenceService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new RiskCatalogEquivalenceService(prisma as any);
  });

  it('resolveCanonicalCatalogId retorna o próprio id sem equivalência', async () => {
    prisma.riskCatalogEquivalence.findFirst.mockResolvedValue(null);

    await expect(
      service.resolveCanonicalCatalogId(RiskCatalogKind.REC_MED, 'item-1'),
    ).resolves.toBe('item-1');
  });

  it('resolveCanonicalCatalogId retorna canonicalId para alias ativo', async () => {
    prisma.riskCatalogEquivalence.findFirst.mockResolvedValue({
      aliasId: 'alias-1',
      canonicalId: 'canonical-1',
    });

    await expect(
      service.resolveCanonicalCatalogId(RiskCatalogKind.REC_MED, 'alias-1'),
    ).resolves.toBe('canonical-1');
  });

  it('registerEquivalence rejeita aliasId igual a canonicalId', async () => {
    await expect(
      service.registerEquivalence({
        kind: RiskCatalogKind.GENERATE_SOURCE,
        equivalenceType: RiskCatalogEquivalenceType.TECHNICAL_DUPLICATE,
        riskId: 'risk-1',
        canonicalId: 'same',
        aliasId: 'same',
        canonicalLabel: 'A',
        aliasLabel: 'A',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('registerEquivalence rejeita alias já ativo', async () => {
    prisma.riskCatalogEquivalence.findFirst.mockResolvedValue({ id: 'eq-1' });

    await expect(
      service.registerEquivalence({
        kind: RiskCatalogKind.GENERATE_SOURCE,
        equivalenceType: RiskCatalogEquivalenceType.TECHNICAL_DUPLICATE,
        riskId: 'risk-1',
        canonicalId: 'canonical-1',
        aliasId: 'alias-1',
        canonicalLabel: 'A',
        aliasLabel: 'A',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('registerEquivalence rejeita cross-scope entre empresas', async () => {
    prisma.riskCatalogEquivalence.findFirst.mockResolvedValue(null);
    prisma.generateSource.findFirst
      .mockResolvedValueOnce({
        id: 'canonical-1',
        riskId: 'risk-1',
        companyId: 'company-a',
        system: false,
        name: 'Canônico',
      })
      .mockResolvedValueOnce({
        id: 'alias-1',
        riskId: 'risk-1',
        companyId: 'company-b',
        system: false,
        name: 'Alias',
      });

    await expect(
      service.registerEquivalence({
        kind: RiskCatalogKind.GENERATE_SOURCE,
        equivalenceType: RiskCatalogEquivalenceType.TECHNICAL_DUPLICATE,
        riskId: 'risk-1',
        canonicalId: 'canonical-1',
        aliasId: 'alias-1',
        canonicalLabel: 'Canônico',
        aliasLabel: 'Alias',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('registerEquivalence permite canônico system + alias empresa mesmo riskId', async () => {
    prisma.riskCatalogEquivalence.findFirst.mockResolvedValue(null);
    prisma.generateSource.findFirst
      .mockResolvedValueOnce({
        id: 'canonical-sys',
        riskId: 'risk-1',
        companyId: 'company-simplesst',
        system: true,
        name: 'Canônico system',
      })
      .mockResolvedValueOnce({
        id: 'alias-empresa',
        riskId: 'risk-1',
        companyId: 'company-sindicato',
        system: false,
        name: 'Alias empresa',
      });
    prisma.riskCatalogEquivalence.create.mockResolvedValue({ id: 'eq-new' });

    await expect(
      service.registerEquivalence({
        kind: RiskCatalogKind.GENERATE_SOURCE,
        equivalenceType: RiskCatalogEquivalenceType.SEMANTIC_ALIAS,
        riskId: 'risk-1',
        canonicalId: 'canonical-sys',
        aliasId: 'alias-empresa',
        canonicalLabel: 'Canônico system',
        aliasLabel: 'Alias empresa',
      }),
    ).resolves.toEqual({ id: 'eq-new' });
  });

  it('registerEquivalence rejeita canônico empresa + alias system', async () => {
    prisma.riskCatalogEquivalence.findFirst.mockResolvedValue(null);
    prisma.generateSource.findFirst
      .mockResolvedValueOnce({
        id: 'canonical-empresa',
        riskId: 'risk-1',
        companyId: 'company-sindicato',
        system: false,
        name: 'Canônico empresa',
      })
      .mockResolvedValueOnce({
        id: 'alias-system',
        riskId: 'risk-1',
        companyId: 'company-simplesst',
        system: true,
        name: 'Alias system',
      });

    await expect(
      service.registerEquivalence({
        kind: RiskCatalogKind.GENERATE_SOURCE,
        equivalenceType: RiskCatalogEquivalenceType.SEMANTIC_ALIAS,
        riskId: 'risk-1',
        canonicalId: 'canonical-empresa',
        aliasId: 'alias-system',
        canonicalLabel: 'Canônico empresa',
        aliasLabel: 'Alias system',
      }),
    ).rejects.toThrow(
      'Item de sistema deve ser usado como canônico. Inverta a seleção.',
    );
  });

  it('registerEquivalence rejeita riskId diferente do par', async () => {
    prisma.riskCatalogEquivalence.findFirst.mockResolvedValue(null);
    prisma.recMed.findFirst
      .mockResolvedValueOnce({
        id: 'canonical-1',
        riskId: 'risk-1',
        companyId: 'company-a',
        system: false,
        recName: 'A',
        medName: null,
        risk: { representAll: false, type: 'PSYCHOSOCIAL' },
      })
      .mockResolvedValueOnce({
        id: 'alias-1',
        riskId: 'risk-2',
        companyId: 'company-a',
        system: false,
        recName: 'B',
        medName: null,
        risk: { representAll: false, type: 'PSYCHOSOCIAL' },
      });

    await expect(
      service.registerEquivalence({
        kind: RiskCatalogKind.REC_MED,
        equivalenceType: RiskCatalogEquivalenceType.SEMANTIC_ALIAS,
        riskId: 'risk-1',
        canonicalId: 'canonical-1',
        aliasId: 'alias-1',
        canonicalLabel: 'A',
        aliasLabel: 'B',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('revokeEquivalence atualiza revokedAt sem apagar registro', async () => {
    prisma.riskCatalogEquivalence.findUnique.mockResolvedValue({
      id: 'eq-1',
      revokedAt: null,
    });
    prisma.riskCatalogEquivalence.update.mockResolvedValue({
      id: 'eq-1',
      revokedAt: new Date('2026-01-01'),
    });

    const row = await service.revokeEquivalence('eq-1', 'motivo');

    expect(prisma.riskCatalogEquivalence.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'eq-1' },
        data: expect.objectContaining({
          revokedAt: expect.any(Date),
          revokeReason: 'motivo',
        }),
      }),
    );
    expect((row as { revokedAt?: Date }).revokedAt).toBeTruthy();
  });

  it('revoked equivalence não é retornada em getActiveEquivalenceByAlias', async () => {
    prisma.riskCatalogEquivalence.findFirst.mockResolvedValue(null);

    const row = await service.getActiveEquivalenceByAlias(
      RiskCatalogKind.REC_MED,
      'alias-1',
    );
    expect(row).toBeNull();
    expect(prisma.riskCatalogEquivalence.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ revokedAt: null }),
      }),
    );
  });
});
