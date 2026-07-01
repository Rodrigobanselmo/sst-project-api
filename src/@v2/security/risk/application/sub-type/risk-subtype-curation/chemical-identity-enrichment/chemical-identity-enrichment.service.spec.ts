import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { buildNormalizedHints } from './chemical-identity-enrichment-hints';
import { ChemicalIdentityEnrichmentService } from './chemical-identity-enrichment.service';
import { PubChemPugRestClient } from './pubchem-pug-rest.client';

describe('ChemicalIdentityEnrichmentService', () => {
  let pubChemClient: { lookup: ReturnType<typeof jest.fn>; normalizeCas: PubChemPugRestClient['normalizeCas'] };
  let service: ChemicalIdentityEnrichmentService;

  beforeEach(() => {
    pubChemClient = {
      lookup: jest.fn(),
      normalizeCas: new PubChemPugRestClient().normalizeCas.bind(
        new PubChemPugRestClient(),
      ),
    };
    service = new ChemicalIdentityEnrichmentService(
      pubChemClient as unknown as PubChemPugRestClient,
    );
  });

  it('1. enrichment por CAS mockado retorna PubChem match', async () => {
    pubChemClient.lookup.mockImplementation(() =>
      Promise.resolve({
        cid: 123,
        matchedBy: 'CAS',
        confidence: 'high',
        title: 'o-Xylene',
        molecularFormula: 'C8H10',
        canonicalSmiles: 'Cc1ccccc1C',
        synonyms: ['108-38-3', 'o-xylene', '1,2-dimethylbenzene'],
        url: 'https://pubchem.ncbi.nlm.nih.gov/compound/123',
        warnings: [],
      }),
    );

    const result = await service.enrichOne(
      {
        riskFactorId: 'risk-1',
        name: 'o-Xileno',
        cas: '108-38-3',
      },
      new Map(),
    );

    expect(result.sourceResults[0].found).toBe(true);
    expect(result.sourceResults[0].source).toBe('PUBCHEM');
    expect(result.normalizedHints.hasBenzeneRingHint).toBe(true);
    expect(service.toCandidateChemicalIdentity(result)?.sources).toEqual(['PUBCHEM']);
  });

  it('2. CAS não encontrado não quebra sugestão', async () => {
    pubChemClient.lookup.mockImplementation(() => Promise.resolve(null));

    const result = await service.enrichOne(
      {
        riskFactorId: 'risk-1',
        name: 'Composto desconhecido',
        cas: '000-00-0',
      },
      new Map(),
    );

    expect(result.sourceResults[0].found).toBe(false);
    expect(service.toCandidateChemicalIdentity(result)).toBeUndefined();
  });

  it('3. timeout/erro PubChem não quebra enrichment', async () => {
    pubChemClient.lookup.mockImplementation(() =>
      Promise.reject(new Error('timeout')),
    );

    const result = await service.enrichOne(
      { riskFactorId: 'risk-1', name: 'Tolueno', cas: '108-88-3' },
      new Map(),
    );

    expect(result.sourceResults[0].found).toBe(false);
  });

  it('4. cache por CAS evita chamadas repetidas no mesmo request', async () => {
    pubChemClient.lookup.mockImplementation(() =>
      Promise.resolve({
        cid: 1,
        matchedBy: 'CAS',
        confidence: 'high',
        title: 'Toluene',
        molecularFormula: 'C7H8',
        canonicalSmiles: 'Cc1ccccc1',
        synonyms: ['toluene'],
        url: 'https://pubchem.ncbi.nlm.nih.gov/compound/1',
        warnings: [],
      }),
    );

    const cache = new Map();
    await service.enrichOne(
      { riskFactorId: 'a', name: 'Tolueno', cas: '108-88-3' },
      cache,
    );
    await service.enrichOne(
      { riskFactorId: 'b', name: 'Tolueno', cas: '108-88-3' },
      cache,
    );

    expect(pubChemClient.lookup).toHaveBeenCalledTimes(1);
  });

  it('5. xileno com sinônimos PubChem gera hint aromático', () => {
    const hints = buildNormalizedHints({
      title: 'o-Xylene',
      synonyms: ['1,2-dimethylbenzene', 'o-xylene'],
    });
    expect(hints.hasBenzeneRingHint).toBe(true);
    expect(hints.classHints).toContain('benzene derivative');
  });

  it('6. acetaldeído gera hint de grupo funcional não aromático', () => {
    const hints = buildNormalizedHints({
      title: 'Acetaldehyde',
      synonyms: ['ethanal', 'acetaldeído'],
    });
    expect(hints.classHints).toContain('non-aromatic functional group');
  });

  it('7. isocianato gera hint específico', () => {
    const hints = buildNormalizedHints({
      title: '2,4-Toluene diisocyanate',
      synonyms: ['TDI', 'diisocyanate'],
    });
    expect(hints.isIsocyanateHint).toBe(true);
  });

  it('10. payload IA não inclui dados de empresa — apenas identidade química', () => {
    const enrichment = {
      sourceResults: [
        {
          source: 'PUBCHEM' as const,
          found: true,
          matchedBy: 'CAS' as const,
          confidence: 'high' as const,
          title: 'Naphthalene',
          molecularFormula: 'C10H8',
          synonyms: ['naphthalene'],
        },
      ],
      normalizedHints: buildNormalizedHints({
        title: 'Naphthalene',
        synonyms: ['naphthalene'],
      }),
      warnings: [],
    };

    const summary = service.toAiChemicalIdentitySummary(enrichment);
    expect(summary).toMatchObject({
      sources: ['PUBCHEM'],
      title: 'Naphthalene',
    });
    expect(JSON.stringify(summary)).not.toMatch(/company|pgr|inventor/i);
  });
});
