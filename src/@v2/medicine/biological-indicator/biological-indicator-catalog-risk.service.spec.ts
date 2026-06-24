import { describe, expect, it } from '@jest/globals';

import { NR07_CATALOG_RISK_DEFINITIONS } from './biological-indicator-catalog-risk.constant';
import { BiologicalIndicatorCatalogRiskService } from './biological-indicator-catalog-risk.service';

describe('biological-indicator-catalog-risk.service', () => {
  it('reutiliza risco existente por CAS sem duplicar', async () => {
    const risks = [
      {
        id: 'risk-nmp',
        name: 'N-Metil-2-pirrolidona (NMP)',
        cas: '872-50-4',
        type: 'QUI' as const,
        system: true,
        companyId: 'company-1',
        synonymous: ['NMP'],
      },
    ];

    const prisma = {
      riskFactors: {
        findMany: async () => risks,
        create: async () => {
          throw new Error('should not create');
        },
      },
    } as any;

    const service = new BiologicalIndicatorCatalogRiskService(prisma);
    const definition = NR07_CATALOG_RISK_DEFINITIONS.find(
      (item) => item.key === 'n-methyl-2-pyrrolidone',
    )!;

    const result = await service.ensureDefinition(definition, [...risks]);

    expect(result.action).toBe('reused');
    expect(result.matchedBy).toBe('CAS');
    expect(result.risk.id).toBe('risk-nmp');
  });

  it('cria risco de grupo quando não existe no catálogo', async () => {
    const risks: any[] = [];
    const created = {
      id: 'risk-group',
      name: 'Indutores de metahemoglobina',
      cas: null,
      type: 'QUI' as const,
      system: true,
      companyId: 'company-1',
      synonymous: [],
    };

    const prisma = {
      riskFactors: {
        findMany: async () => risks,
        create: async () => created,
      },
    } as any;

    const service = new BiologicalIndicatorCatalogRiskService(prisma);
    const definition = NR07_CATALOG_RISK_DEFINITIONS.find(
      (item) => item.key === 'methemoglobin-inducers',
    )!;

    const result = await service.ensureDefinition(definition, risks);

    expect(result.action).toBe('created');
    expect(result.risk.name).toBe('Indutores de metahemoglobina');
    expect(result.risk.system).toBe(true);
    expect(result.risk.type).toBe('QUI');
  });
});
