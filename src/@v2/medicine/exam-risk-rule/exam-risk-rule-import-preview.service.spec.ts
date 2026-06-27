import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
  PcmsoExamRiskRuleScopeEnum,
  PcmsoExamRiskRuleSourceEnum,
  PcmsoExamRiskRuleStatusEnum,
} from '@prisma/client';
import * as XLSX from 'xlsx';

import { ExamRiskRuleImportClassification as C } from './exam-risk-rule-import.util';
import { ExamRiskRuleImportPreviewService } from './exam-risk-rule-import-preview.service';
import { EXAM_RISK_RULE_COLUMN_ORDER } from './exam-risk-rule-spreadsheet.constants';

type Row = Record<string, unknown>;

const SYSTEM_EXAMS = [
  { id: 10, name: 'Hemograma', system: true, esocial27Code: '0101' },
  { id: 11, name: 'Audiometria', system: true, esocial27Code: '0202' },
];

const buildBuffer = (rows: Row[], sheetName = 'Regras'): Buffer => {
  const ws = XLSX.utils.json_to_sheet(rows, {
    header: [...EXAM_RISK_RULE_COLUMN_ORDER],
  });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
};

const makeExam = (overrides: Record<string, unknown> = {}) => ({
  id: 're1',
  ruleId: 'r1',
  examId: 10,
  examNameSnapshot: 'Hemograma',
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
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
  ...overrides,
});

const makeRule = (overrides: Record<string, unknown> = {}) => ({
  id: 'r1',
  scope: PcmsoExamRiskRuleScopeEnum.RISK,
  riskFactorId: 'risk-1',
  riskCategory: null,
  riskSubTypeId: null,
  agentCas: null,
  agentName: null,
  agentNameNormalized: null,
  riskNameSnapshot: 'Ruído',
  subTypeNameSnapshot: null,
  source: PcmsoExamRiskRuleSourceEnum.SIMPLE_SST,
  status: PcmsoExamRiskRuleStatusEnum.DRAFT,
  rationale: null,
  sourceIndicatorId: null,
  isCurated: false,
  createdById: 1,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
  exams: [makeExam()],
  ...overrides,
});

describe('ExamRiskRuleImportPreviewService', () => {
  let service: ExamRiskRuleImportPreviewService;
  let repository: {
    findRulesByIdsRaw: jest.Mock;
    findExamsByIds: jest.Mock;
  };

  beforeEach(() => {
    repository = {
      findRulesByIdsRaw: jest.fn(() => Promise.resolve([makeRule()])),
      findExamsByIds: jest.fn(() => Promise.resolve(SYSTEM_EXAMS)),
    };
    service = new ExamRiskRuleImportPreviewService(repository as never);
  });

  it('CREATE: novo exame em regra existente', async () => {
    repository.findRulesByIdsRaw.mockResolvedValue([
      makeRule({ exams: [] }),
    ] as never);
    const buffer = buildBuffer([
      { ruleId: 'r1', examId: '11', validityInMonths: '6' },
    ]);
    const result = await service.preview({ buffer, fileName: 'f.xlsx' });
    expect(result.totals.create).toBe(1);
    expect(result.lines[0].classification).toBe(C.CREATE);
  });

  it('UPDATE: altera campo de exame existente', async () => {
    const buffer = buildBuffer([
      { ruleId: 'r1', ruleExamId: 're1', examId: '10', validityInMonths: '6' },
    ]);
    const result = await service.preview({ buffer, fileName: 'f.xlsx' });
    expect(result.totals.update).toBe(1);
    expect(result.lines[0].classification).toBe(C.UPDATE);
    expect(result.lines[0].changedFields).toContain('validityInMonths');
  });

  it('UNCHANGED: linha igual ao banco', async () => {
    const buffer = buildBuffer([
      {
        ruleId: 'r1',
        ruleExamId: 're1',
        examId: '10',
        validityInMonths: '12',
        isMale: 'true',
        isFemale: 'true',
        isAdmission: 'true',
      },
    ]);
    const result = await service.preview({ buffer, fileName: 'f.xlsx' });
    expect(result.totals.unchanged).toBe(1);
  });

  it('REJECTED: examId fora do catálogo system', async () => {
    const buffer = buildBuffer([{ ruleId: 'r1', examId: '999' }]);
    const result = await service.preview({ buffer, fileName: 'f.xlsx' });
    expect(result.totals.rejected).toBe(1);
    expect(result.lines[0].classification).toBe(C.REJECTED);
  });

  it('REJECTED: regra inexistente', async () => {
    repository.findRulesByIdsRaw.mockResolvedValue([] as never);
    const buffer = buildBuffer([{ ruleId: 'rX', examId: '10' }]);
    const result = await service.preview({ buffer, fileName: 'f.xlsx' });
    expect(result.totals.rejected).toBe(1);
  });

  it('CONFLICT: campos de regra divergentes entre linhas', async () => {
    repository.findRulesByIdsRaw.mockResolvedValue([
      makeRule({ exams: [makeExam(), makeExam({ id: 're2' })] }),
    ] as never);
    const buffer = buildBuffer([
      { ruleId: 'r1', ruleExamId: 're1', examId: '10', status: 'ACTIVE' },
      { ruleId: 'r1', ruleExamId: 're2', examId: '10', status: 'DRAFT' },
    ]);
    const result = await service.preview({ buffer, fileName: 'f.xlsx' });
    expect(result.totals.conflict).toBe(2);
  });

  it('INVALID: ACTIVE sem exame válido', async () => {
    repository.findRulesByIdsRaw.mockResolvedValue([
      makeRule({ exams: [] }),
    ] as never);
    const buffer = buildBuffer([{ ruleId: 'r1', status: 'ACTIVE' }]);
    const result = await service.preview({ buffer, fileName: 'f.xlsx' });
    expect(result.totals.invalid).toBe(1);
    expect(result.lines[0].classification).toBe(C.INVALID);
  });

  it('INVALID: ruleId vazio com dados (não cria regra nova)', async () => {
    repository.findRulesByIdsRaw.mockResolvedValue([] as never);
    const buffer = buildBuffer([{ ruleId: '', status: 'ACTIVE', examId: '10' }]);
    const result = await service.preview({ buffer, fileName: 'f.xlsx' });
    expect(result.totals.invalid).toBe(1);
  });

  it('UPDATE/RESTORE: âncora aponta para exame soft-deleted', async () => {
    repository.findRulesByIdsRaw.mockResolvedValue([
      makeRule({
        exams: [makeExam({ id: 're1', deleted_at: new Date() })],
      }),
    ] as never);
    const buffer = buildBuffer([
      { ruleId: 'r1', ruleExamId: 're1', examId: '10', validityInMonths: '12' },
    ]);
    const result = await service.preview({ buffer, fileName: 'f.xlsx' });
    expect(result.totals.update).toBe(1);
    expect(
      result.lines[0].fieldChanges.find((c) => c.field === 'deleted_at'),
    ).toBeTruthy();
  });

  it('isCurated=true automático no plano quando regra muda', async () => {
    const buffer = buildBuffer([
      { ruleId: 'r1', ruleExamId: 're1', examId: '10', validityInMonths: '6' },
    ]);
    const model = await service.buildModel({ buffer, fileName: 'f.xlsx' });
    const rulePlan = model.plan.find((p) => p.ruleId === 'r1');
    expect(rulePlan?.ruleUpdateData).toBeTruthy();
    // Mudança apenas de exame ainda marca a regra como curada.
    expect(rulePlan?.ruleUpdateData?.isCurated).toBe(true);
  });

  it('respeita isCurated explícito da planilha (mesmo com alteração de exame)', async () => {
    repository.findRulesByIdsRaw.mockResolvedValue([
      makeRule({ isCurated: true }),
    ] as never);
    const buffer = buildBuffer([
      {
        ruleId: 'r1',
        ruleExamId: 're1',
        examId: '10',
        validityInMonths: '6',
        isCurated: 'false',
      },
    ]);
    const model = await service.buildModel({ buffer, fileName: 'f.xlsx' });
    const rulePlan = model.plan.find((p) => p.ruleId === 'r1');
    expect(rulePlan?.ruleUpdateData?.isCurated).toBe(false);
  });

  it('aviso em coluna read-only alterada', async () => {
    const buffer = buildBuffer([
      {
        ruleId: 'r1',
        ruleExamId: 're1',
        examId: '10',
        validityInMonths: '6',
        examName: 'editei o nome',
      },
    ]);
    const result = await service.preview({ buffer, fileName: 'f.xlsx' });
    expect(result.lines[0].warnings.length).toBeGreaterThan(0);
  });

  it('idempotência: reimportar planilha já aplicada → tudo UNCHANGED (0/0/N/0/0/0)', async () => {
    // Banco já reflete exatamente os valores da planilha (estado pós-apply).
    repository.findRulesByIdsRaw.mockResolvedValue([
      makeRule({
        status: PcmsoExamRiskRuleStatusEnum.ACTIVE,
        isCurated: true,
        exams: [
          makeExam({ id: 're1', examId: 10, validityInMonths: 6 }),
          makeExam({ id: 're2', examId: 11, validityInMonths: 12 }),
        ],
      }),
    ] as never);

    const buffer = buildBuffer([
      {
        ruleId: 'r1',
        ruleExamId: 're1',
        examId: '10',
        status: 'ACTIVE',
        isCurated: 'true',
        validityInMonths: '6',
        isMale: 'true',
        isFemale: 'true',
        isAdmission: 'true',
      },
      {
        ruleId: 'r1',
        ruleExamId: 're2',
        examId: '11',
        status: 'ACTIVE',
        isCurated: 'true',
        validityInMonths: '12',
        isMale: 'true',
        isFemale: 'true',
        isAdmission: 'true',
      },
    ]);

    const model = await service.buildModel({ buffer, fileName: 'f.xlsx' });
    expect(model.totals.read).toBe(2);
    expect(model.totals.create).toBe(0);
    expect(model.totals.update).toBe(0);
    expect(model.totals.unchanged).toBe(2);
    expect(model.totals.rejected).toBe(0);
    expect(model.totals.conflict).toBe(0);
    expect(model.totals.invalid).toBe(0);
    // Plano vazio → 0 gravações no apply.
    expect(model.plan).toHaveLength(0);
  });

  it('totais consistentes: valid = create + update + unchanged', async () => {
    repository.findRulesByIdsRaw.mockResolvedValue([
      makeRule({ exams: [makeExam()] }),
    ] as never);
    const buffer = buildBuffer([
      { ruleId: 'r1', ruleExamId: 're1', examId: '10', validityInMonths: '6' },
    ]);
    const result = await service.preview({ buffer, fileName: 'f.xlsx' });
    expect(result.totals.valid).toBe(
      result.totals.create + result.totals.update + result.totals.unchanged,
    );
  });
});
