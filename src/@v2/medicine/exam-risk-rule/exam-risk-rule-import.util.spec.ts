import { describe, expect, it } from '@jest/globals';
import { PcmsoExamRiskRuleStatusEnum } from '@prisma/client';

import {
  diffExamPayload,
  diffRulePayload,
  ExamEditablePayload,
  isRowEmpty,
  parseOptionalBoolean,
  parseOptionalInt,
  parseRuleRow,
} from './exam-risk-rule-import.util';

const baseExam = (overrides: Partial<ExamEditablePayload> = {}): ExamEditablePayload => ({
  examId: 10,
  validityInMonths: 12,
  considerBetweenDays: null,
  collectionToleranceDays: null,
  collectionMoment: null,
  fromAge: null,
  toAge: null,
  minRiskDegree: null,
  minRiskDegreeQuantity: null,
  isMale: true,
  isFemale: true,
  isAdmission: true,
  isPeriodic: false,
  isChange: false,
  isReturn: false,
  isDismissal: false,
  ...overrides,
});

describe('exam-risk-rule-import.util', () => {
  describe('parseOptionalBoolean', () => {
    it('aceita tokens true/false e vazio', () => {
      expect(parseOptionalBoolean('sim')).toEqual({ value: true, error: false });
      expect(parseOptionalBoolean('NAO')).toEqual({ value: false, error: false });
      expect(parseOptionalBoolean('')).toEqual({ value: undefined, error: false });
      expect(parseOptionalBoolean('talvez').error).toBe(true);
    });
  });

  describe('parseOptionalInt', () => {
    it('rejeita negativos e não-inteiros', () => {
      expect(parseOptionalInt('5')).toEqual({ value: 5, error: false });
      expect(parseOptionalInt('')).toEqual({ value: undefined, error: false });
      expect(parseOptionalInt('-1').error).toBe(true);
      expect(parseOptionalInt('1.5').error).toBe(true);
    });
  });

  describe('parseRuleRow', () => {
    it('detecta linha vazia (sem regra e sem exame)', () => {
      const parsed = parseRuleRow({ ruleId: 'r1' }, 2);
      expect(isRowEmpty(parsed)).toBe(true);
      expect(parsed.errors).toHaveLength(0);
    });

    it('parseia campos editáveis de regra e exame', () => {
      const parsed = parseRuleRow(
        {
          ruleId: 'r1',
          ruleExamId: 're1',
          status: 'active',
          isCurated: 'true',
          rationale: 'motivo',
          examId: '10',
          validityInMonths: '12',
          isAdmission: 'sim',
        },
        3,
      );
      expect(parsed.rule.status).toBe(PcmsoExamRiskRuleStatusEnum.ACTIVE);
      expect(parsed.rule.isCurated).toBe(true);
      expect(parsed.rule.rationale).toBe('motivo');
      expect(parsed.exam.examId).toBe(10);
      expect(parsed.exam.validityInMonths).toBe(12);
      expect(parsed.exam.isAdmission).toBe(true);
      expect(parsed.hasExamData).toBe(true);
      expect(isRowEmpty(parsed)).toBe(false);
    });

    it('marca status inválido como erro', () => {
      const parsed = parseRuleRow({ ruleId: 'r1', status: 'LIGADO' }, 2);
      expect(parsed.errors.find((e) => e.field === 'status')).toBeTruthy();
    });

    it('valida fromAge <= toAge', () => {
      const parsed = parseRuleRow(
        { ruleId: 'r1', examId: '10', fromAge: '40', toAge: '30' },
        2,
      );
      expect(parsed.errors.find((e) => e.field === 'toAge')).toBeTruthy();
    });

    it('exige collectionMoment quando collectionToleranceDays presente', () => {
      const parsed = parseRuleRow(
        { ruleId: 'r1', examId: '10', collectionToleranceDays: '5' },
        2,
      );
      expect(
        parsed.errors.find((e) => e.field === 'collectionToleranceDays'),
      ).toBeTruthy();
    });

    it('sinaliza colunas read-only preenchidas', () => {
      const parsed = parseRuleRow(
        { ruleId: 'r1', scope: 'AGENT', examName: 'editado' },
        2,
      );
      expect(parsed.readonlyTouched).toContain('examName');
    });
  });

  describe('diffRulePayload', () => {
    const existing = {
      status: PcmsoExamRiskRuleStatusEnum.DRAFT,
      isCurated: false,
      rationale: null,
      agentName: null,
      agentCas: null,
    };

    it('detecta apenas campos preenchidos que mudaram', () => {
      const changes = diffRulePayload(
        existing,
        { status: PcmsoExamRiskRuleStatusEnum.ACTIVE },
        { isAgentScope: false },
      );
      expect(changes).toHaveLength(1);
      expect(changes[0].field).toBe('status');
    });

    it('ignora agentName fora de scope=AGENT', () => {
      const changes = diffRulePayload(
        existing,
        { agentName: 'Chumbo' },
        { isAgentScope: false },
      );
      expect(changes).toHaveLength(0);
    });
  });

  describe('diffExamPayload', () => {
    it('detecta mudanças de campos de exame', () => {
      const changes = diffExamPayload(baseExam(), baseExam({ validityInMonths: 6 }));
      expect(changes).toHaveLength(1);
      expect(changes[0].field).toBe('validityInMonths');
    });

    it('sem mudanças retorna vazio', () => {
      expect(diffExamPayload(baseExam(), baseExam())).toHaveLength(0);
    });
  });
});
