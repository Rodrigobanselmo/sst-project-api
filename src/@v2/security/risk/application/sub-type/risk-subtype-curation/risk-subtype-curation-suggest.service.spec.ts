import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
  BadRequestException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { RiskFactorsEnum, StatusEnum } from '@prisma/client';

import { RiskSubtypeCurationSuggestService } from './risk-subtype-curation-suggest.service';
import { ChemicalIdentityEnrichmentService } from './chemical-identity-enrichment/chemical-identity-enrichment.service';

describe('RiskSubtypeCurationSuggestService', () => {
  let service: RiskSubtypeCurationSuggestService;
  let repository: {
    findSubTypeById: ReturnType<typeof jest.fn>;
    findEligibleRisksForSuggestion: ReturnType<typeof jest.fn>;
    replaceRiskSubTypes: ReturnType<typeof jest.fn>;
    clearRiskSubTypes: ReturnType<typeof jest.fn>;
  };
  let aiAdapter: { analyze: ReturnType<typeof jest.fn> };
  let enrichmentService: {
    enrichBatch: ReturnType<typeof jest.fn>;
    toCandidateChemicalIdentity: ReturnType<typeof jest.fn>;
    toAiChemicalIdentitySummary: ReturnType<typeof jest.fn>;
  };
  let aiPromptService: {
    buildPrompt: ReturnType<typeof jest.fn>;
    resolveModel: ReturnType<typeof jest.fn>;
  };

  const emptyEnrichment = {
    sourceResults: [{ source: 'PUBCHEM', found: false, confidence: 'low' }],
    normalizedHints: { classHints: [] },
    warnings: [],
  };

  const activeSubType = {
    id: 10,
    name: 'Hidrocarbonetos aromáticos',
    description: 'Compostos aromáticos',
    type: RiskFactorsEnum.QUI,
    status: StatusEnum.ACTIVE,
  };

  const eligibleRisk = {
    id: 'risk-1',
    name: 'Tolueno',
    cas: '108-88-3',
    synonymous: ['Metilbenzeno'],
    esocialCode: '01.03.001',
    risk: 'Possibilidade de irritação',
    symptoms: 'Cefaleia',
    coments: null,
    method: null,
    nr15lt: null,
    twa: null,
    stel: null,
    ipvs: null,
    subTypes: [],
  };

  beforeEach(() => {
    process.env.OPENAI_API_KEY = 'test-key';
    repository = {
      findSubTypeById: jest.fn(),
      findEligibleRisksForSuggestion: jest.fn(),
      replaceRiskSubTypes: jest.fn(),
      clearRiskSubTypes: jest.fn(),
    };
    aiAdapter = {
      analyze: jest.fn(),
    };
    enrichmentService = {
      enrichBatch: jest.fn(),
      toCandidateChemicalIdentity: jest.fn(),
      toAiChemicalIdentitySummary: jest.fn(),
    };
    enrichmentService.enrichBatch.mockImplementation((inputs: { riskFactorId: string }[]) =>
      Promise.resolve(
        new Map(inputs.map((input) => [input.riskFactorId, emptyEnrichment])),
      ),
    );
    enrichmentService.toCandidateChemicalIdentity.mockImplementation(() => undefined);
    enrichmentService.toAiChemicalIdentitySummary.mockImplementation(() => null);
    aiPromptService = {
      buildPrompt: jest.fn(),
      resolveModel: jest.fn(),
    };
    aiPromptService.buildPrompt.mockImplementation(
      async ({ subType }: { subType: { name: string } }) => ({
        assembledPrompt: `Prompt para ${subType.name}`,
        sections: [],
        useSystemDefault: true,
        preferredModel: null,
        selectedModel: 'gpt-4o-mini',
        sources: {
          globalPrompt: 'fallback',
          instruction: 'default',
          sessionCustom: false,
        },
      }),
    );
    aiPromptService.resolveModel.mockImplementation(
      ({
        sessionModel,
        preferredModel,
      }: {
        sessionModel?: string;
        preferredModel?: string | null;
      }) => sessionModel || preferredModel || 'gpt-4o-mini',
    );
    service = new RiskSubtypeCurationSuggestService(
      repository as never,
      aiAdapter as never,
      enrichmentService as never,
      aiPromptService as never,
    );
  });

  it('1. rejeita tipo diferente de QUI', async () => {
    await expect(
      service.suggestCandidates({
        type: RiskFactorsEnum.FIS,
        subTypeId: 10,
      } as never),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('2. rejeita subtipo inexistente', async () => {
    repository.findSubTypeById.mockImplementation(() => Promise.resolve(null));

    await expect(
      service.suggestCandidates({
        type: RiskFactorsEnum.QUI,
        subTypeId: 999,
      } as never),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('2b. rejeita subtipo inativo', async () => {
    repository.findSubTypeById.mockImplementation(() =>
      Promise.resolve({
        ...activeSubType,
        status: StatusEnum.INACTIVE,
      }),
    );

    await expect(
      service.suggestCandidates({
        type: RiskFactorsEnum.QUI,
        subTypeId: 10,
      } as never),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('2c. rejeita subtipo de tipo diferente', async () => {
    repository.findSubTypeById.mockImplementation(() =>
      Promise.resolve({
        ...activeSubType,
        type: RiskFactorsEnum.FIS,
      }),
    );

    await expect(
      service.suggestCandidates({
        type: RiskFactorsEnum.QUI,
        subTypeId: 10,
      } as never),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('3. busca só riscos QUI sem subtipo com paginação', async () => {
    repository.findSubTypeById.mockImplementation(() =>
      Promise.resolve(activeSubType),
    );
    repository.findEligibleRisksForSuggestion.mockImplementation(() =>
      Promise.resolve({ rows: [], total: 0 }),
    );

    await service.suggestCandidates({
      type: RiskFactorsEnum.QUI,
      subTypeId: 10,
      page: 1,
      limit: 100,
    } as never);

    expect(repository.findEligibleRisksForSuggestion).toHaveBeenCalledWith(
      expect.objectContaining({
        type: RiskFactorsEnum.QUI,
        page: 1,
        limit: 100,
      }),
    );
  });

  it('3b. página 2 usa skip correto e retorna metadados de lote', async () => {
    repository.findSubTypeById.mockImplementation(() =>
      Promise.resolve(activeSubType),
    );
    repository.findEligibleRisksForSuggestion.mockImplementation(() =>
      Promise.resolve({
        rows: [{ ...eligibleRisk, id: 'risk-101', name: 'Xileno' }],
        total: 841,
      }),
    );
    aiAdapter.analyze.mockImplementation(() =>
      Promise.resolve({
        analysis: JSON.stringify({
          items: [
            {
              riskFactorId: 'risk-101',
              suggestedInclude: false,
              confidence: 'high',
              rationale: 'Não é fenol',
              warnings: [],
            },
          ],
        }),
      }),
    );

    const result = await service.suggestCandidates({
      type: RiskFactorsEnum.QUI,
      subTypeId: 10,
      page: 2,
      limit: 100,
    } as never);

    expect(repository.findEligibleRisksForSuggestion).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2, limit: 100 }),
    );
    expect(result.scope.page).toBe(2);
    expect(result.scope.rangeStart).toBe(101);
    expect(result.scope.rangeEnd).toBe(101);
    expect(result.scope.hasNextPage).toBe(true);
    expect(result.scope.nextPage).toBe(3);
    expect(result.scope.eligibleTotal).toBe(841);
  });

  it('3c. último lote sem próxima página', async () => {
    repository.findSubTypeById.mockImplementation(() =>
      Promise.resolve(activeSubType),
    );
    repository.findEligibleRisksForSuggestion.mockImplementation(() =>
      Promise.resolve({ rows: [eligibleRisk], total: 4 }),
    );
    aiAdapter.analyze.mockImplementation(() =>
      Promise.resolve({
        analysis: JSON.stringify({
          items: [
            {
              riskFactorId: 'risk-1',
              suggestedInclude: true,
              confidence: 'high',
              rationale: 'Match',
              warnings: [],
            },
          ],
        }),
      }),
    );

    const result = await service.suggestCandidates({
      type: RiskFactorsEnum.QUI,
      subTypeId: 10,
      page: 1,
      limit: 100,
      search: 'xileno',
    } as never);

    expect(result.scope.hasNextPage).toBe(false);
    expect(result.scope.nextPage).toBeNull();
    expect(result.scope.truncated).toBe(false);
  });

  it('4. respeita onlyPcmso', async () => {
    repository.findSubTypeById.mockImplementation(() =>
      Promise.resolve(activeSubType),
    );
    repository.findEligibleRisksForSuggestion.mockImplementation(() =>
      Promise.resolve({ rows: [], total: 0 }),
    );

    await service.suggestCandidates({
      type: RiskFactorsEnum.QUI,
      subTypeId: 10,
      onlyPcmso: true,
    } as never);

    expect(repository.findEligibleRisksForSuggestion).toHaveBeenCalledWith(
      expect.objectContaining({ onlyPcmso: true }),
    );
  });

  it('8. endpoint continua sem writes e enriquece antes da IA', async () => {
    repository.findSubTypeById.mockImplementation(() =>
      Promise.resolve(activeSubType),
    );
    repository.findEligibleRisksForSuggestion.mockImplementation(() =>
      Promise.resolve({ rows: [eligibleRisk], total: 1 }),
    );
    aiAdapter.analyze.mockImplementation(() =>
      Promise.resolve({
        analysis: JSON.stringify({
          items: [
            {
              riskFactorId: 'risk-1',
              suggestedInclude: true,
              confidence: 'high',
              rationale: 'Aromático',
              warnings: [],
            },
          ],
        }),
      }),
    );

    await service.suggestCandidates({
      type: RiskFactorsEnum.QUI,
      subTypeId: 10,
    } as never);

    expect(enrichmentService.enrichBatch).toHaveBeenCalled();
    expect(repository.replaceRiskSubTypes).not.toHaveBeenCalled();
    expect(repository.clearRiskSubTypes).not.toHaveBeenCalled();
  });

  it('7. ignora resposta IA com riskFactorId fora do lote', async () => {
    repository.findSubTypeById.mockImplementation(() =>
      Promise.resolve(activeSubType),
    );
    repository.findEligibleRisksForSuggestion.mockImplementation(() =>
      Promise.resolve({
        rows: [{
          ...eligibleRisk,
          name: 'Composto orgânico sintético A-17',
          synonymous: [],
        }],
        total: 1,
      }),
    );
    aiAdapter.analyze.mockImplementation(() =>
      Promise.resolve({
        analysis: JSON.stringify({
          items: [
            {
              riskFactorId: 'outro-id',
              suggestedInclude: true,
              confidence: 'high',
              rationale: 'Inválido',
              warnings: [],
            },
          ],
        }),
      }),
    );

    const result = await service.suggestCandidates({
      type: RiskFactorsEnum.QUI,
      subTypeId: 10,
    } as never);

    expect(result.candidates[0].suggestedInclude).toBe(false);
    expect(result.candidates[0].confidence).toBe('low');
  });

  it('8. omissão de risco vira low/exclude com warning', async () => {
    repository.findSubTypeById.mockImplementation(() =>
      Promise.resolve(activeSubType),
    );
    repository.findEligibleRisksForSuggestion.mockImplementation(() =>
      Promise.resolve({
        rows: [{
          ...eligibleRisk,
          name: 'Composto orgânico sintético A-17',
          synonymous: [],
        }],
        total: 1,
      }),
    );
    aiAdapter.analyze.mockImplementation(() =>
      Promise.resolve({
        analysis: JSON.stringify({ items: [] }),
      }),
    );

    const result = await service.suggestCandidates({
      type: RiskFactorsEnum.QUI,
      subTypeId: 10,
    } as never);

    expect(result.candidates[0].suggestedInclude).toBe(false);
    expect(result.candidates[0].confidence).toBe('low');
    expect(result.candidates[0].warnings[0]).toContain('Sem evidência suficiente');
  });

  it('9. defaultSelected só para include high/medium sem subtipo', async () => {
    repository.findSubTypeById.mockImplementation(() =>
      Promise.resolve(activeSubType),
    );
    repository.findEligibleRisksForSuggestion.mockImplementation(() =>
      Promise.resolve({
        rows: [
          eligibleRisk,
          { ...eligibleRisk, id: 'risk-2', name: 'Benzeno' },
          {
            ...eligibleRisk,
            id: 'risk-3',
            name: 'Composto orgânico sintético B-22',
            synonymous: [],
          },
        ],
        total: 3,
      }),
    );
    aiAdapter.analyze.mockImplementation(() =>
      Promise.resolve({
        analysis: JSON.stringify({
          items: [
            {
              riskFactorId: 'risk-1',
              suggestedInclude: true,
              confidence: 'high',
              rationale: 'A',
              warnings: [],
            },
            {
              riskFactorId: 'risk-2',
              suggestedInclude: true,
              confidence: 'medium',
              rationale: 'B',
              warnings: [],
            },
            {
              riskFactorId: 'risk-3',
              suggestedInclude: true,
              confidence: 'low',
              rationale: 'C',
              warnings: [],
            },
          ],
        }),
      }),
    );

    const result = await service.suggestCandidates({
      type: RiskFactorsEnum.QUI,
      subTypeId: 10,
    } as never);

    const byId = Object.fromEntries(
      result.candidates.map((c) => [c.riskFactorId, c]),
    );
    expect(byId['risk-1'].defaultSelected).toBe(true);
    expect(byId['risk-2'].defaultSelected).toBe(true);
    expect(byId['risk-3'].defaultSelected).toBe(false);
  });

  it('11. acetaldeído incorreto da IA é normalizado para exclude', async () => {
    repository.findSubTypeById.mockImplementation(() =>
      Promise.resolve(activeSubType),
    );
    repository.findEligibleRisksForSuggestion.mockImplementation(() =>
      Promise.resolve({
        rows: [{ ...eligibleRisk, id: 'risk-a', name: 'Acetaldeído', synonymous: [] }],
        total: 1,
      }),
    );
    aiAdapter.analyze.mockImplementation(() =>
      Promise.resolve({
        analysis: JSON.stringify({
          items: [
            {
              riskFactorId: 'risk-a',
              suggestedInclude: true,
              confidence: 'medium',
              rationale: 'Efeito no SNC.',
              warnings: [],
            },
          ],
        }),
      }),
    );

    const result = await service.suggestCandidates({
      type: RiskFactorsEnum.QUI,
      subTypeId: 10,
    } as never);

    expect(result.candidates[0].suggestedInclude).toBe(false);
    expect(result.candidates[0].reasonCategory).toBe('NOT_A_MATCH');
  });

  it('10. sem API key retorna erro claro', async () => {
    delete process.env.OPENAI_API_KEY;

    await expect(
      service.suggestCandidates({
        type: RiskFactorsEnum.QUI,
        subTypeId: 10,
      } as never),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });
});
