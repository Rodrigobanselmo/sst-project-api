import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Prisma } from '@prisma/client';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { AcgihExamLinkService } from './acgih-exam-link.service';
import {
  ACGIH_EXAM_LINK_RESOLVE_CONFIRM_TEXT,
  ACGIH_EXAM_LINK_SYNC_CONFIRM_TEXT,
  AcgihExamLinkResolveBody,
  AcgihExamLinkSyncBody,
} from './acgih-exam-link.dto';
import {
  buildAcgihExamName,
  classifyAcgihExamPreview,
  matchAcgihIndicatorExam,
} from './acgih-exam-link.util';

type IndicatorRow = {
  id: string;
  acgihBeiIndicatorId: string | null;
  substanceName: string;
  biologicalIndicatorOriginal: string;
  biologicalIndicatorNormalized: string;
  biologicalMatrix: string;
  casPrimary: string | null;
  examLinks: Array<{
    examId: number;
    deleted_at: Date | null;
    examName: string | null;
  }>;
  riskLinks: Array<{ riskFactorId: string; riskName: string | null }>;
};

const indicator = (over: Partial<IndicatorRow> = {}): IndicatorRow => ({
  id: 'ind-1',
  acgihBeiIndicatorId: 'acgih-1',
  substanceName: 'n-Heptano',
  biologicalIndicatorOriginal: '2,5-hexanodiona na urina',
  biologicalIndicatorNormalized: '2,5 hexanodiona urina',
  biologicalMatrix: 'urina',
  casPrimary: '142-82-5',
  examLinks: [],
  riskLinks: [],
  ...over,
});

const buildRepo = (over: {
  indicators?: IndicatorRow[];
  catalog?: Array<{ id: number; name: string; material: string | null; esocial27Code: string | null }>;
  nr7?: Array<{
    determinantNormalized: string;
    matrix: string;
    examId: number;
    examName: string;
    examMaterial: string | null;
  }>;
  createExamLink?: jest.Mock;
  createSystemExam?: jest.Mock;
} = {}) => {
  const createExamLink =
    over.createExamLink ?? jest.fn().mockResolvedValue({ id: 'link-1' } as never);
  const createSystemExam =
    over.createSystemExam ??
    jest.fn().mockResolvedValue({
      id: 99,
      name: 'Novo exame',
      material: 'urina',
      esocial27Code: null,
    } as never);
  return {
    findAcgihOfficialIndicators: jest
      .fn()
      .mockResolvedValue((over.indicators ?? [indicator()]) as never),
    findSystemicCatalog: jest.fn().mockResolvedValue((over.catalog ?? []) as never),
    findNr7ConfirmedExamLinks: jest.fn().mockResolvedValue((over.nr7 ?? []) as never),
    createExamLink,
    createSystemExam,
  };
};

describe('AcgihExamLinkSyncBody (confirmText)', () => {
  it('rejeita confirmText inválido', async () => {
    const dto = plainToInstance(AcgihExamLinkSyncBody, {
      confirmText: 'ERRADO',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('aceita confirmText exato', async () => {
    const dto = plainToInstance(AcgihExamLinkSyncBody, {
      confirmText: ACGIH_EXAM_LINK_SYNC_CONFIRM_TEXT,
      dryRun: true,
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});

describe('matchAcgihIndicatorExam', () => {
  it('reaproveita exame de vínculo NR-7 com o mesmo determinante', () => {
    const outcome = matchAcgihIndicatorExam({
      indicator: {
        id: 'i',
        substanceName: 'n-Heptano',
        determinant: '2,5-hexanodiona na urina',
        determinantNormalized: '2,5 hexanodiona urina',
        matrix: 'urina',
      },
      catalog: [],
      nr7ExamLinks: [
        {
          determinantNormalized: '2,5 hexanodiona urina',
          matrix: 'urina',
          examId: 99,
          examName: '2,5-hexanodiona (urina)',
          examMaterial: 'urina',
        },
      ],
    });
    expect(outcome.kind).toBe('matched');
    if (outcome.kind === 'matched') {
      expect(outcome.match.examId).toBe(99);
      expect(outcome.match.reusedFromNr7).toBe(true);
      expect(outcome.match.safe).toBe(true);
    }
  });

  it('faz match único por nome/determinante no catálogo', () => {
    const outcome = matchAcgihIndicatorExam({
      indicator: {
        id: 'i',
        substanceName: 'TDI',
        determinant: 'Toluenodiamina (TDA) na urina',
        determinantNormalized: 'toluenodiamina tda urina',
        matrix: 'urina',
      },
      catalog: [
        { id: 7, name: 'Toluenodiamina (TDA) na urina', material: 'urina', esocial27Code: null },
        { id: 8, name: 'Ácido hipúrico', material: 'urina', esocial27Code: null },
      ],
      nr7ExamLinks: [],
    });
    expect(outcome.kind).toBe('matched');
    if (outcome.kind === 'matched') {
      expect(outcome.match.examId).toBe(7);
      expect(outcome.match.safe).toBe(true);
    }
  });

  it('bloqueia quando não há candidato (NO_EXAM_MATCH)', () => {
    const outcome = matchAcgihIndicatorExam({
      indicator: {
        id: 'i',
        substanceName: 'Desconhecida',
        determinant: 'Determinante inexistente xyz',
        determinantNormalized: 'determinante inexistente xyz',
        matrix: 'urina',
      },
      catalog: [{ id: 1, name: 'Ácido hipúrico', material: 'urina', esocial27Code: null }],
      nr7ExamLinks: [],
    });
    expect(outcome.kind).toBe('none');
  });

  it('marca ambíguo quando há empate de candidatos', () => {
    const outcome = matchAcgihIndicatorExam({
      indicator: {
        id: 'i',
        substanceName: 'Fenol',
        determinant: 'Fenol na urina',
        determinantNormalized: 'fenol urina',
        matrix: 'urina',
      },
      catalog: [
        { id: 1, name: 'Fenol na urina', material: 'urina', esocial27Code: null },
        { id: 2, name: 'Fenol na urina', material: 'urina', esocial27Code: null },
      ],
      nr7ExamLinks: [],
    });
    expect(outcome.kind).toBe('ambiguous');
    if (outcome.kind === 'ambiguous') {
      expect(outcome.candidates).toHaveLength(2);
    }
  });
});

describe('AcgihExamLinkService.sync', () => {
  let repo: ReturnType<typeof buildRepo>;

  beforeEach(() => {
    repo = buildRepo();
  });

  it('dryRun não escreve e reporta linkCreated', async () => {
    repo = buildRepo({
      indicators: [indicator()],
      catalog: [
        {
          id: 7,
          name: '2,5-hexanodiona na urina',
          material: 'urina',
          esocial27Code: null,
        },
      ],
    });
    const service = new AcgihExamLinkService(repo as never);

    const res = await service.sync({ userId: 1, dryRun: true });

    expect(res.dryRun).toBe(true);
    expect(repo.createExamLink).not.toHaveBeenCalled();
    expect(res.totals.linksCreated).toBe(1);
    expect(res.items[0].action).toBe('linkCreated');
  });

  it('apply real cria o vínculo (única escrita)', async () => {
    repo = buildRepo({
      indicators: [indicator()],
      catalog: [
        {
          id: 7,
          name: '2,5-hexanodiona na urina',
          material: 'urina',
          esocial27Code: null,
        },
      ],
    });
    const service = new AcgihExamLinkService(repo as never);

    const res = await service.sync({ userId: 1, dryRun: false });

    expect(repo.createExamLink).toHaveBeenCalledTimes(1);
    expect(res.totals.linksCreated).toBe(1);
    expect(res.items[0].examId).toBe(7);
  });

  it('idempotência: indicador com vínculo ativo retorna alreadyLinked sem escrever', async () => {
    repo = buildRepo({
      indicators: [
        indicator({ examLinks: [{ examId: 7, deleted_at: null, examName: '2,5-hexanodiona na urina' }] }),
      ],
      catalog: [
        { id: 7, name: '2,5-hexanodiona na urina', material: 'urina', esocial27Code: null },
      ],
    });
    const service = new AcgihExamLinkService(repo as never);

    const res = await service.sync({ userId: 1, dryRun: false });

    expect(repo.createExamLink).not.toHaveBeenCalled();
    expect(res.items[0].action).toBe('alreadyLinked');
    expect(res.totals.alreadyLinked).toBe(1);
  });

  it('P2002 vira alreadyLinked, não erro fatal', async () => {
    const p2002 = new Prisma.PrismaClientKnownRequestError('dup', {
      code: 'P2002',
      clientVersion: 'x',
    });
    repo = buildRepo({
      indicators: [indicator()],
      catalog: [
        { id: 7, name: '2,5-hexanodiona na urina', material: 'urina', esocial27Code: null },
      ],
      createExamLink: jest.fn().mockRejectedValue(p2002 as never),
    });
    const service = new AcgihExamLinkService(repo as never);

    const res = await service.sync({ userId: 1, dryRun: false });

    expect(res.items[0].action).toBe('alreadyLinked');
    expect(res.items[0].reason).toBe('P2002_ALREADY_LINKED');
    expect(res.totals.failed).toBe(0);
  });

  it('bloqueia NO_EXAM_MATCH quando não encontra exame', async () => {
    repo = buildRepo({
      indicators: [indicator({ biologicalIndicatorOriginal: 'Algo inexistente zzz' })],
      catalog: [{ id: 1, name: 'Ácido hipúrico', material: 'urina', esocial27Code: null }],
    });
    const service = new AcgihExamLinkService(repo as never);

    const res = await service.sync({ userId: 1, dryRun: false });

    expect(repo.createExamLink).not.toHaveBeenCalled();
    expect(res.items[0].action).toBe('blocked');
    expect(res.items[0].reason).toBe('NO_EXAM_MATCH');
  });

  it('bloqueia AMBIGUOUS_EXAM_MATCH e lista candidatos', async () => {
    repo = buildRepo({
      indicators: [indicator({ biologicalIndicatorOriginal: 'Fenol na urina' })],
      catalog: [
        { id: 1, name: 'Fenol na urina', material: 'urina', esocial27Code: null },
        { id: 2, name: 'Fenol na urina', material: 'urina', esocial27Code: null },
      ],
    });
    const service = new AcgihExamLinkService(repo as never);

    const res = await service.sync({ userId: 1, dryRun: false });

    expect(repo.createExamLink).not.toHaveBeenCalled();
    expect(res.items[0].action).toBe('blocked');
    expect(res.items[0].reason).toBe('AMBIGUOUS_EXAM_MATCH');
    expect(res.items[0].candidates?.length).toBe(2);
  });

  it('bloqueia MISSING_DETERMINANT quando determinante está vazio', async () => {
    repo = buildRepo({
      indicators: [indicator({ biologicalIndicatorOriginal: '   ' })],
    });
    const service = new AcgihExamLinkService(repo as never);

    const res = await service.sync({ userId: 1, dryRun: false });

    expect(res.items[0].action).toBe('blocked');
    expect(res.items[0].reason).toBe('MISSING_DETERMINANT');
  });
});

describe('buildAcgihExamName', () => {
  it('monta nome com matriz urina', () => {
    expect(buildAcgihExamName('2,5-heptanodiona', 'urina')).toBe(
      '2,5-heptanodiona na urina',
    );
  });

  it('não duplica matriz se já estiver no determinante', () => {
    expect(buildAcgihExamName('2,5-hexanodiona na urina', 'urina')).toBe(
      '2,5-hexanodiona na urina',
    );
  });
});

describe('classifyAcgihExamPreview', () => {
  const snap = {
    id: 'i',
    substanceName: 'X',
    determinant: 'det',
    determinantNormalized: 'det',
    matrix: 'urina',
  };

  it('retorna LINKED quando já vinculado', () => {
    const r = classifyAcgihExamPreview({
      alreadyLinked: { examId: 1, examName: 'Exame A' },
      indicator: snap,
      outcome: { kind: 'none' },
    });
    expect(r.status).toBe('LINKED');
  });

  it('retorna READY_TO_CREATE quando sem match mas com dados', () => {
    const r = classifyAcgihExamPreview({
      alreadyLinked: null,
      indicator: snap,
      outcome: { kind: 'none' },
    });
    expect(r.status).toBe('READY_TO_CREATE');
    expect(r.suggestedExamName).toContain('det');
  });
});

describe('AcgihExamLinkResolveBody (confirmText)', () => {
  it('aceita confirmText RESOLVER EXAMES ACGIH', async () => {
    const dto = plainToInstance(AcgihExamLinkResolveBody, {
      confirmText: ACGIH_EXAM_LINK_RESOLVE_CONFIRM_TEXT,
      dryRun: true,
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});

describe('AcgihExamLinkService.preview', () => {
  it('retorna estado consolidado sem escrita', async () => {
    const repo = buildRepo({
      indicators: [
        indicator(),
        indicator({
          id: 'ind-2',
          acgihBeiIndicatorId: 'acgih-2',
          substanceName: 'Fluoretos',
          biologicalIndicatorOriginal: 'Fluoreto urinário',
          biologicalIndicatorNormalized: 'fluoreto urinario',
          examLinks: [
            { examId: 5, deleted_at: null, examName: 'Fluoreto na urina' },
          ],
        }),
      ],
      catalog: [
        { id: 7, name: '2,5-hexanodiona na urina', material: 'urina', esocial27Code: null },
      ],
    });
    const service = new AcgihExamLinkService(repo as never);
    const res = await service.preview();
    expect(res.totals.indicators).toBe(2);
    expect(res.totals.linked).toBe(1);
    expect(res.items[0].examLink.status).toBe('NOT_LINKED');
    expect(res.items[1].examLink.status).toBe('LINKED');
  });
});

describe('AcgihExamLinkService.resolve', () => {
  it('dryRun não escreve e reporta linkedExistingExam + createdExamAndLinked', async () => {
    const repo = buildRepo({
      indicators: [
        indicator(),
        indicator({
          id: 'ind-2',
          acgihBeiIndicatorId: 'acgih-2',
          substanceName: 'Fluoretos',
          biologicalIndicatorOriginal: 'Fluoreto urinário',
          biologicalIndicatorNormalized: 'fluoreto urinario',
        }),
      ],
      catalog: [
        { id: 7, name: '2,5-hexanodiona na urina', material: 'urina', esocial27Code: null },
      ],
    });
    const service = new AcgihExamLinkService(repo as never);
    const res = await service.resolve({ userId: 1, dryRun: true });
    expect(repo.createExamLink).not.toHaveBeenCalled();
    expect(repo.createSystemExam).not.toHaveBeenCalled();
    expect(res.totals.linksCreated).toBe(1);
    expect(res.totals.examsCreated).toBe(1);
  });

  it('apply real vincula existente e cria exame novo', async () => {
    const repo = buildRepo({
      indicators: [
        indicator(),
        indicator({
          id: 'ind-2',
          acgihBeiIndicatorId: 'acgih-2',
          substanceName: 'Fluoretos',
          biologicalIndicatorOriginal: 'Fluoreto urinário',
          biologicalIndicatorNormalized: 'fluoreto urinario',
        }),
      ],
      catalog: [
        { id: 7, name: '2,5-hexanodiona na urina', material: 'urina', esocial27Code: null },
      ],
    });
    const service = new AcgihExamLinkService(repo as never);
    const res = await service.resolve({ userId: 1, dryRun: false });
    expect(repo.createExamLink).toHaveBeenCalledTimes(2);
    expect(repo.createSystemExam).toHaveBeenCalledTimes(1);
    expect(res.totals.linksCreated).toBe(1);
    expect(res.totals.examsCreated).toBe(1);
  });

  it('ambíguo não processa em lote', async () => {
    const repo = buildRepo({
      indicators: [
        indicator({ biologicalIndicatorOriginal: 'Fenol na urina' }),
      ],
      catalog: [
        { id: 1, name: 'Fenol na urina', material: 'urina', esocial27Code: null },
        { id: 2, name: 'Fenol na urina', material: 'urina', esocial27Code: null },
      ],
    });
    const service = new AcgihExamLinkService(repo as never);
    const res = await service.resolve({ userId: 1, dryRun: false });
    expect(repo.createExamLink).not.toHaveBeenCalled();
    expect(res.items[0].action).toBe('ambiguous');
    expect(res.totals.ambiguous).toBe(1);
  });

  it('não cria exame duplicado se já existir no pool por nome+matriz', async () => {
    const repo = buildRepo({
      indicators: [
        indicator({
          biologicalIndicatorOriginal: 'Fluoreto urinário',
          biologicalIndicatorNormalized: 'fluoreto urinario',
        }),
      ],
      catalog: [
        {
          id: 50,
          name: 'Fluoreto urinário na urina',
          material: 'urina',
          esocial27Code: null,
        },
      ],
    });
    const service = new AcgihExamLinkService(repo as never);
    const res = await service.resolve({ userId: 1, dryRun: false });
    expect(repo.createSystemExam).not.toHaveBeenCalled();
    expect(res.items[0].action).toBe('linkedExistingExam');
  });
});
