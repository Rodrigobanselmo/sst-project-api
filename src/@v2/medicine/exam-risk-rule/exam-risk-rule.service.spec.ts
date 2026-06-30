import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  PcmsoExamRiskRuleScopeEnum,
  PcmsoExamRiskRuleSourceEnum,
  PcmsoExamRiskRuleStatusEnum,
  RiskFactorsEnum,
} from '@prisma/client';

import { CreateExamRiskRuleBody } from './exam-risk-rule.dto';
import { ExamRiskRuleService } from './exam-risk-rule.service';

describe('ExamRiskRuleService', () => {
  let service: ExamRiskRuleService;
  let repository: {
    browse: jest.Mock;
    findById: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    updateStatus: jest.Mock;
    softDelete: jest.Mock;
    findRiskById: jest.Mock;
    findSubTypeById: jest.Mock;
    findExamById: jest.Mock;
    searchRiskCandidates: jest.Mock;
    searchExamCandidates: jest.Mock;
    findNr07IndicatorIdsByRiskFactorNameSearch: jest.Mock;
    findNr07IndicatorRiskFactorsByIds: jest.Mock;
  };

  beforeEach(() => {
    repository = {
      browse: jest.fn(),
      findById: jest.fn(),
      create: jest.fn((data) => Promise.resolve({ id: 'rule-1', ...(data as object) })),
      update: jest.fn((id, data) => Promise.resolve({ id, ...(data as object) })),
      updateStatus: jest.fn(),
      softDelete: jest.fn(() => Promise.resolve(undefined)),
      findRiskById: jest.fn(() =>
        Promise.resolve({ id: 'risk-1', name: 'Ruído', type: 'FIS', cas: null, system: true }),
      ),
      findSubTypeById: jest.fn(() =>
        Promise.resolve({ id: 10, name: 'Ambientais', type: 'FIS', sub_type: 'AMBIENTAIS' }),
      ),
      findExamById: jest.fn(() =>
        Promise.resolve({ id: 5, name: 'Audiometria', system: true }),
      ),
      searchRiskCandidates: jest.fn(),
      searchExamCandidates: jest.fn(),
      findNr07IndicatorIdsByRiskFactorNameSearch: jest.fn(() => Promise.resolve([])),
      findNr07IndicatorRiskFactorsByIds: jest.fn(() => Promise.resolve(new Map())),
    };

    service = new ExamRiskRuleService(repository as never);
  });

  const baseRule = (
    overrides: Partial<CreateExamRiskRuleBody> = {},
  ): CreateExamRiskRuleBody => ({
    scope: PcmsoExamRiskRuleScopeEnum.RISK,
    riskFactorId: 'risk-1',
    source: PcmsoExamRiskRuleSourceEnum.NR_07,
    ...overrides,
  });

  describe('browse enriquecido', () => {
    it('expõe riskFactorDisplayName para NR-7 via indicador correlacionado', async () => {
      repository.browse.mockResolvedValueOnce({
        count: 1,
        page: 1,
        limit: 20,
        data: [
          {
            id: 'rule-benzeno',
            scope: PcmsoExamRiskRuleScopeEnum.AGENT,
            source: PcmsoExamRiskRuleSourceEnum.NR_07,
            sourceIndicatorId: 'ind-benzeno',
            agentName: 'Benzeno',
            agentCas: '71-43-2',
            riskNameSnapshot: null,
            riskFactorId: null,
            riskCategory: null,
            riskSubTypeId: null,
            subTypeNameSnapshot: null,
            exams: [],
            references: [],
          },
        ],
      } as never);

      repository.findNr07IndicatorRiskFactorsByIds.mockResolvedValueOnce(
        new Map([
          [
            'ind-benzeno',
            {
              riskFactorId: 'risk-benzeno',
              riskFactorName: 'Benzeno e seus compostos tóxicos',
            },
          ],
        ]) as never,
      );

      const result = await service.browse({ page: 1, limit: 20 });

      expect(repository.findNr07IndicatorRiskFactorsByIds).toHaveBeenCalledWith([
        'ind-benzeno',
      ]);
      expect(result.data[0].riskFactorDisplayName).toBe(
        'Benzeno e seus compostos tóxicos',
      );
      expect(result.data[0].normativeOriginLabel).toBe('Origem normativa: Benzeno');
      expect(result.data[0].linkedRiskFactorId).toBe('risk-benzeno');
    });

    it('inclui indicadores NR-7 na busca por nome do fator de risco', async () => {
      repository.findNr07IndicatorIdsByRiskFactorNameSearch.mockResolvedValueOnce([
        'ind-benzeno',
      ] as never);
      repository.browse.mockResolvedValueOnce({
        count: 0,
        page: 1,
        limit: 20,
        data: [],
      } as never);

      await service.browse({
        page: 1,
        limit: 20,
        filters: { search: 'compostos tóxicos' },
      });

      expect(
        repository.findNr07IndicatorIdsByRiskFactorNameSearch,
      ).toHaveBeenCalledWith('compostos tóxicos');
      expect(repository.browse).toHaveBeenCalledWith(
        expect.objectContaining({
          filters: expect.objectContaining({
            nr07SourceIndicatorIds: ['ind-benzeno'],
          }),
        }),
      );
    });
  });

  describe('validação de escopo', () => {
    it('cria regra por RISK com snapshot do nome do risco', async () => {
      const result: any = await service.create(baseRule(), 99);

      expect(repository.findRiskById).toHaveBeenCalledWith('risk-1');
      expect(result.scope).toBe(PcmsoExamRiskRuleScopeEnum.RISK);
      expect(result.riskFactorId).toBe('risk-1');
      expect(result.riskNameSnapshot).toBe('Ruído');
      expect(result.riskCategory).toBeNull();
      expect(result.riskSubTypeId).toBeNull();
      expect(result.agentCas).toBeNull();
      expect(result.status).toBe(PcmsoExamRiskRuleStatusEnum.DRAFT);
      expect(result.createdById).toBe(99);
    });

    it('rejeita regra RISK sem riskFactorId', async () => {
      await expect(
        service.create(baseRule({ riskFactorId: undefined })),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('rejeita regra ambígua (RISK com categoria preenchida)', async () => {
      await expect(
        service.create(
          baseRule({ riskCategory: RiskFactorsEnum.QUI }),
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('cria regra por CATEGORY sem tocar nas demais referências', async () => {
      const result: any = await service.create(
        baseRule({
          scope: PcmsoExamRiskRuleScopeEnum.CATEGORY,
          riskFactorId: undefined,
          riskCategory: RiskFactorsEnum.QUI,
        }),
      );

      expect(result.riskCategory).toBe(RiskFactorsEnum.QUI);
      expect(result.riskFactorId).toBeNull();
      expect(repository.findRiskById).not.toHaveBeenCalled();
    });

    it('cria regra por GROUP resolvendo snapshot do subtipo', async () => {
      const result: any = await service.create(
        baseRule({
          scope: PcmsoExamRiskRuleScopeEnum.GROUP,
          riskFactorId: undefined,
          riskSubTypeId: 10,
        }),
      );

      expect(repository.findSubTypeById).toHaveBeenCalledWith(10);
      expect(result.riskSubTypeId).toBe(10);
      expect(result.subTypeNameSnapshot).toBe('Ambientais');
    });

    it('cria regra por AGENT normalizando o nome', async () => {
      const result: any = await service.create(
        baseRule({
          scope: PcmsoExamRiskRuleScopeEnum.AGENT,
          riskFactorId: undefined,
          agentCas: '71-55-6',
          agentName: 'Tricloroetano',
        }),
      );

      expect(result.agentCas).toBe('71-55-6');
      expect(result.agentNameNormalized).toBe('tricloroetano');
    });

    it('rejeita regra AGENT sem cas e sem nome', async () => {
      await expect(
        service.create(
          baseRule({
            scope: PcmsoExamRiskRuleScopeEnum.AGENT,
            riskFactorId: undefined,
          }),
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('rejeita risco inexistente no catálogo global', async () => {
      repository.findRiskById.mockResolvedValueOnce(null as never);
      await expect(service.create(baseRule())).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('exames sugeridos', () => {
    it('aplica defaults e resolve snapshot do exame', async () => {
      const result: any = await service.create(
        baseRule({
          exams: [{ examId: 5, isPeriodic: true, validityInMonths: 12 }],
        }),
      );

      const exams = result.exams.createMany.data;
      expect(exams).toHaveLength(1);
      expect(exams[0].examNameSnapshot).toBe('Audiometria');
      expect(exams[0].isPeriodic).toBe(true);
      expect(exams[0].isMale).toBe(true);
      expect(exams[0].validityInMonths).toBe(12);
      expect(exams[0].minRiskDegree).toBeNull();
    });

    it('preserva null em campos numéricos de limpeza', async () => {
      const result: any = await service.create(
        baseRule({
          exams: [{ examId: 5, validityInMonths: null, fromAge: null }],
        }),
      );

      const exam = result.exams.createMany.data[0];
      expect(exam.validityInMonths).toBeNull();
      expect(exam.fromAge).toBeNull();
    });
  });

  describe('status e soft delete', () => {
    it('soft delete chama repository após validar existência', async () => {
      repository.findById.mockResolvedValueOnce({ id: 'rule-1' } as never);
      const result = await service.softDelete('rule-1');
      expect(repository.softDelete).toHaveBeenCalledWith('rule-1');
      expect(result).toEqual({ id: 'rule-1', deleted: true });
    });

    it('soft delete lança NotFound quando regra não existe', async () => {
      repository.findById.mockResolvedValueOnce(null as never);
      await expect(service.softDelete('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('updateStatus altera status de regra existente', async () => {
      repository.findById.mockResolvedValueOnce({ id: 'rule-1' } as never);
      repository.updateStatus.mockResolvedValueOnce({
        id: 'rule-1',
        status: PcmsoExamRiskRuleStatusEnum.ACTIVE,
      } as never);

      const result: any = await service.updateStatus(
        'rule-1',
        PcmsoExamRiskRuleStatusEnum.ACTIVE,
      );

      expect(repository.updateStatus).toHaveBeenCalledWith(
        'rule-1',
        PcmsoExamRiskRuleStatusEnum.ACTIVE,
      );
      expect(result.status).toBe(PcmsoExamRiskRuleStatusEnum.ACTIVE);
    });
  });

  describe('update', () => {
    it('troca escopo de RISK para CATEGORY limpando referências antigas', async () => {
      repository.findById.mockResolvedValueOnce({
        id: 'rule-1',
        scope: PcmsoExamRiskRuleScopeEnum.RISK,
        riskFactorId: 'risk-1',
        riskCategory: null,
        riskSubTypeId: null,
        agentCas: null,
        agentName: null,
      } as never);

      const result: any = await service.update('rule-1', {
        scope: PcmsoExamRiskRuleScopeEnum.CATEGORY,
        riskCategory: RiskFactorsEnum.BIO,
        riskFactorId: null,
      });

      expect(result.riskFactorId).toBeNull();
      expect(result.riskCategory).toBe(RiskFactorsEnum.BIO);
    });

    it('marca isCurated = true ao editar manualmente', async () => {
      repository.findById.mockResolvedValueOnce({
        id: 'rule-1',
        scope: PcmsoExamRiskRuleScopeEnum.AGENT,
        riskFactorId: null,
        riskCategory: null,
        riskSubTypeId: null,
        agentCas: '108-88-3',
        agentName: 'Tolueno',
      } as never);

      const result: any = await service.update('rule-1', {
        rationale: 'ajuste manual do MASTER',
      });

      expect(result.isCurated).toBe(true);
    });
  });
});
