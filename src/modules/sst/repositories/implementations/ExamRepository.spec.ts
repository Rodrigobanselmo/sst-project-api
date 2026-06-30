import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { simpleCompanyId } from '../../../../shared/constants/ids';
import { ExamRepository } from './ExamRepository';

/**
 * Focused tests for the consolidated ACGIH/BEI recommendation path added to the
 * company exam picker (`riskFactorId → BiologicalIndicatorToRisk →
 * BiologicalIndicatorToExam → Exam`). Prisma is fully mocked: the goal is to
 * assert which recommended exam ids feed the final exam query and the
 * `agentFilter.recommendedCount` metadata, not to exercise the database.
 *
 * Confirmed-only / not-deleted semantics for the new path are enforced by the
 * Prisma where-clauses and unit-tested in exam-origin.util.spec.ts
 * (buildRiskIndicatorLinkWhere / buildRiskIndicatorExamWhere).
 */

type Where = any;

interface MockData {
  /** indicatorId[] returned for the riskFactor→indicator query. */
  riskIndicatorIds: string[];
  /** examId[] returned for the confirmed indicator→exam query (riskFactor path). */
  riskFactorExamIds: number[];
  /** Library (PcmsoExamRiskRule) ACTIVE/AGENT rows for the CAS/name path. */
  libraryRules: {
    agentCas: string | null;
    agentNameNormalized: string | null;
    exams: { examId: number | null }[];
  }[];
  /** Generic indicator→exam links for the CAS/name path. */
  casNameIndicatorLinks: {
    examId: number;
    indicator: {
      casPrimary: string | null;
      casNumbers: string[];
      substanceNameNormalized: string | null;
    };
  }[];
  /** examId[] linked to NR-07 indicators (origin classification). */
  nr07ExamIds: number[];
  /** examId[] linked to confirmed ACGIH/BEI indicators (origin enrichment). */
  acgihBeiExamIds: number[];
  /** Exam rows returned by the final exam.findMany (origin chips). */
  examRows: { id: number; companyId: string; system: boolean }[];
}

const emptyData = (): MockData => ({
  riskIndicatorIds: [],
  riskFactorExamIds: [],
  libraryRules: [],
  casNameIndicatorLinks: [],
  nr07ExamIds: [],
  acgihBeiExamIds: [],
  examRows: [],
});

const buildPrisma = (data: MockData) => {
  const examFindMany = jest.fn(async (_args?: { where: Where }) => data.examRows);
  const examCount = jest.fn(async (_args?: { where: Where }) => data.examRows.length);

  const biologicalIndicatorToExamFindMany = jest.fn(
    async ({ where }: { where: Where }) => {
      // getNr07ExamIds(): indicator.normativeSource === NR_07 (whole table).
      if (where?.indicator?.normativeSource === 'NR_07') {
        return data.nr07ExamIds.map((examId) => ({ examId }));
      }
      // getAcgihBeiExamIds(): ACGIH_BEI links batched by page examId in (...).
      if (where?.indicator?.normativeSource === 'ACGIH_BEI') {
        const pageIds: number[] = where?.examId?.in ?? [];
        return data.acgihBeiExamIds
          .filter((examId) => pageIds.includes(examId))
          .map((examId) => ({ examId }));
      }
      // riskFactor path: indicator→exam restricted to a set of indicator ids.
      if (where?.indicatorId?.in) {
        return data.riskFactorExamIds.map((examId) => ({ examId }));
      }
      // CAS/name path: generic indicator links (buildAgentIndicatorWhere).
      return data.casNameIndicatorLinks;
    },
  );

  const prisma = {
    pcmsoExamRiskRule: {
      findMany: jest.fn(async () => data.libraryRules),
    },
    biologicalIndicatorToRisk: {
      findMany: jest.fn(async () =>
        data.riskIndicatorIds.map((indicatorId) => ({ indicatorId })),
      ),
    },
    biologicalIndicatorToExam: {
      findMany: biologicalIndicatorToExamFindMany,
    },
    exam: {
      count: examCount,
      findMany: examFindMany,
    },
    $transaction: (ops: Promise<any>[]) => Promise.all(ops),
  };

  return {
    prisma,
    examFindMany,
    examCount,
    biologicalIndicatorToExamFindMany,
  };
};

/** Extracts the `{ id: { in } }` recommendation constraint from the exam query. */
const lastExamWhere = (examFindMany: jest.Mock): Where => {
  const calls = examFindMany.mock.calls as any[];
  return calls.at(-1)?.[0]?.where;
};

const recommendedIdsFromExamFindMany = (examFindMany: jest.Mock): number[] => {
  const and: Where[] = lastExamWhere(examFindMany)?.AND ?? [];
  const idConstraint = and.find((c) => c?.id?.in);
  return idConstraint ? idConstraint.id.in : [];
};

const COMPANY = 'company-1';
const HEPTANO_RISK = 'rf-heptano';
const HEPTANODIONA_EXAM = 501;

describe('ExamRepository.find — consolidated ACGIH/BEI riskFactorId path', () => {
  let data: MockData;

  beforeEach(() => {
    data = emptyData();
  });

  it('(1) sem riskFactorId e sem agente: não aplica filtro nem consulta o caminho consolidado', async () => {
    const { prisma } = buildPrisma(data);
    const repo = new ExamRepository(prisma as any);

    const result = await repo.find(
      { companyId: COMPANY },
      { skip: 0, take: 20 },
      {},
      { withOrigin: true },
    );

    expect((result as any).agentFilter).toBeUndefined();
    expect(prisma.biologicalIndicatorToRisk.findMany).not.toHaveBeenCalled();
  });

  it('(2/3) com riskFactorId e vínculos confirmados: recomenda o exame mesmo sem CAS/nome (grupo/isômero)', async () => {
    data.riskIndicatorIds = ['ind-n-heptano'];
    data.riskFactorExamIds = [HEPTANODIONA_EXAM];
    const { prisma, examFindMany } = buildPrisma(data);
    const repo = new ExamRepository(prisma as any);

    const result = await repo.find(
      // Note: no agentCas / agentName — "Heptano, todos os isômeros" não bate
      // com "n-Heptano", então só o riskFactorId resolve.
      { companyId: COMPANY, riskFactorId: HEPTANO_RISK },
      { skip: 0, take: 20 },
      {},
      { withOrigin: true },
    );

    expect((result as any).agentFilter).toEqual({
      applied: true,
      recommendedCount: 1,
    });
    expect(recommendedIdsFromExamFindMany(examFindMany)).toEqual([
      HEPTANODIONA_EXAM,
    ]);
    expect(prisma.biologicalIndicatorToRisk.findMany).toHaveBeenCalledTimes(1);
  });

  it('(7) includeIncompatible=true ignora riskFactorId e não aplica recomendação (catálogo amplo)', async () => {
    data.riskIndicatorIds = ['ind-n-heptano'];
    data.riskFactorExamIds = [HEPTANODIONA_EXAM];
    const { prisma } = buildPrisma(data);
    const repo = new ExamRepository(prisma as any);

    const result = await repo.find(
      { companyId: COMPANY, riskFactorId: HEPTANO_RISK, includeIncompatible: true },
      { skip: 0, take: 20 },
      {},
      { withOrigin: true },
    );

    expect((result as any).agentFilter).toBeUndefined();
    expect(prisma.biologicalIndicatorToRisk.findMany).not.toHaveBeenCalled();
  });

  it('(8) search continua filtrando dentro dos recomendados (search + restrição por id coexistem)', async () => {
    data.riskIndicatorIds = ['ind-n-heptano'];
    data.riskFactorExamIds = [HEPTANODIONA_EXAM];
    const { prisma, examFindMany } = buildPrisma(data);
    const repo = new ExamRepository(prisma as any);

    await repo.find(
      { companyId: COMPANY, riskFactorId: HEPTANO_RISK, search: 'heptanodiona' },
      { skip: 0, take: 20 },
      {},
      { withOrigin: true },
    );

    const flatten = JSON.stringify(lastExamWhere(examFindMany));
    expect(flatten).toContain('heptanodiona');
    expect(recommendedIdsFromExamFindMany(examFindMany)).toEqual([
      HEPTANODIONA_EXAM,
    ]);
  });

  it('(9/10) recommendedCount e união/dedupe consideram Biblioteca + CAS/nome + riskFactorId', async () => {
    // Biblioteca recomenda 10 e 20; CAS/nome recomenda 20 e 30; riskFactorId
    // recomenda 30 e 40. União esperada: {10,20,30,40} → count 4.
    data.libraryRules = [
      {
        agentCas: '142-82-5',
        agentNameNormalized: 'heptano todos os isomeros',
        exams: [{ examId: 10 }, { examId: 20 }],
      },
    ];
    data.casNameIndicatorLinks = [
      {
        examId: 20,
        indicator: {
          casPrimary: '142-82-5',
          casNumbers: ['142-82-5'],
          substanceNameNormalized: 'heptano todos os isomeros',
        },
      },
      {
        examId: 30,
        indicator: {
          casPrimary: '142-82-5',
          casNumbers: [],
          substanceNameNormalized: 'heptano todos os isomeros',
        },
      },
    ];
    data.riskIndicatorIds = ['ind-n-heptano'];
    data.riskFactorExamIds = [30, 40];

    const { prisma, examFindMany } = buildPrisma(data);
    const repo = new ExamRepository(prisma as any);

    const result = await repo.find(
      {
        companyId: COMPANY,
        riskFactorId: HEPTANO_RISK,
        agentCas: '142-82-5',
        agentName: 'Heptano, todos os isômeros',
      },
      { skip: 0, take: 20 },
      {},
      { withOrigin: true },
    );

    expect((result as any).agentFilter.recommendedCount).toBe(4);
    expect(recommendedIdsFromExamFindMany(examFindMany).sort((a, b) => a - b)).toEqual([
      10, 20, 30, 40,
    ]);
  });

  it('riskFactorId sem vínculos confirmados não recomenda nenhum exame (conjunto vazio, sem fallback ao catálogo)', async () => {
    data.riskIndicatorIds = [];
    data.riskFactorExamIds = [];
    const { prisma, examFindMany } = buildPrisma(data);
    const repo = new ExamRepository(prisma as any);

    const result = await repo.find(
      { companyId: COMPANY, riskFactorId: HEPTANO_RISK },
      { skip: 0, take: 20 },
      {},
      { withOrigin: true },
    );

    expect((result as any).agentFilter).toEqual({
      applied: true,
      recommendedCount: 0,
    });
    expect(recommendedIdsFromExamFindMany(examFindMany)).toEqual([]);
    // Sem indicadores, não consulta o segundo hop indicador→exame do caminho consolidado.
    expect(prisma.biologicalIndicatorToRisk.findMany).toHaveBeenCalledTimes(1);
  });

  it('não honra riskFactorId quando withOrigin não é solicitado (picker de clínica)', async () => {
    data.riskIndicatorIds = ['ind-n-heptano'];
    data.riskFactorExamIds = [HEPTANODIONA_EXAM];
    const { prisma } = buildPrisma(data);
    const repo = new ExamRepository(prisma as any);

    const result = await repo.find(
      { companyId: COMPANY, riskFactorId: HEPTANO_RISK },
      { skip: 0, take: 20 },
      {},
      {},
    );

    expect((result as any).agentFilter).toBeUndefined();
    expect(prisma.biologicalIndicatorToRisk.findMany).not.toHaveBeenCalled();
  });
});

describe('ExamRepository.find — accumulative originSources enrichment', () => {
  let data: MockData;

  // System catalog exams live under simpleCompanyId — these fall back to SYSTEM
  // when there is no normative source. A non-simple system company falls back
  // to OTHER, and a non-system exam to CLIENT.
  const SYSTEM_COMPANY = simpleCompanyId;
  const OTHER_COMPANY = '5e9e0335-b7cf-4805-9c7c-1bc637e2bb07';

  beforeEach(() => {
    data = emptyData();
  });

  const originSourcesById = (result: any): Record<number, string[]> =>
    Object.fromEntries(result.data.map((e: any) => [e.id, e.originSources]));

  it('(1) exame só NR-7 → ["NR_07"]', async () => {
    data.examRows = [{ id: 10, companyId: SYSTEM_COMPANY, system: true }];
    data.nr07ExamIds = [10];
    const { prisma } = buildPrisma(data);
    const repo = new ExamRepository(prisma as any);

    const result = await repo.find(
      { companyId: COMPANY },
      { skip: 0, take: 20 },
      {},
      { withOrigin: true },
    );

    expect(originSourcesById(result)[10]).toEqual(['NR_07']);
  });

  it('(2) exame só ACGIH/BEI → ["ACGIH_BEI"] (não "SYSTEM")', async () => {
    data.examRows = [{ id: 20, companyId: SYSTEM_COMPANY, system: true }];
    data.acgihBeiExamIds = [20];
    const { prisma } = buildPrisma(data);
    const repo = new ExamRepository(prisma as any);

    const result = await repo.find(
      { companyId: COMPANY },
      { skip: 0, take: 20 },
      {},
      { withOrigin: true },
    );

    expect(originSourcesById(result)[20]).toEqual(['ACGIH_BEI']);
  });

  it('(3) exame com NR-7 + ACGIH/BEI → ["NR_07", "ACGIH_BEI"]', async () => {
    data.examRows = [{ id: 30, companyId: SYSTEM_COMPANY, system: true }];
    data.nr07ExamIds = [30];
    data.acgihBeiExamIds = [30];
    const { prisma } = buildPrisma(data);
    const repo = new ExamRepository(prisma as any);

    const result = await repo.find(
      { companyId: COMPANY },
      { skip: 0, take: 20 },
      {},
      { withOrigin: true },
    );

    expect(originSourcesById(result)[30]).toEqual(['NR_07', 'ACGIH_BEI']);
  });

  it('(4) exame system do catálogo sem fonte normativa → ["SYSTEM"]', async () => {
    data.examRows = [{ id: 40, companyId: SYSTEM_COMPANY, system: true }];
    const { prisma } = buildPrisma(data);
    const repo = new ExamRepository(prisma as any);

    const result = await repo.find(
      { companyId: COMPANY },
      { skip: 0, take: 20 },
      {},
      { withOrigin: true },
    );

    expect(originSourcesById(result)[40]).toEqual(['SYSTEM']);
  });

  it('(4b) exame system de empresa não-simple sem fonte normativa → ["OTHER"]', async () => {
    data.examRows = [{ id: 41, companyId: OTHER_COMPANY, system: true }];
    const { prisma } = buildPrisma(data);
    const repo = new ExamRepository(prisma as any);

    const result = await repo.find(
      { companyId: COMPANY },
      { skip: 0, take: 20 },
      {},
      { withOrigin: true },
    );

    expect(originSourcesById(result)[41]).toEqual(['OTHER']);
  });

  it('(5) exame manual/empresa (system=false) preserva origem → ["CLIENT"]', async () => {
    data.examRows = [{ id: 50, companyId: COMPANY, system: false }];
    const { prisma } = buildPrisma(data);
    const repo = new ExamRepository(prisma as any);

    const result = await repo.find(
      { companyId: COMPANY },
      { skip: 0, take: 20 },
      {},
      { withOrigin: true },
    );

    expect(originSourcesById(result)[50]).toEqual(['CLIENT']);
  });

  it('(6/7) vínculo ACGIH/BEI deletado ou não confirmado não conta (where exige isConfirmed + deleted_at null)', async () => {
    // O mock só devolve ids "confirmados ativos"; aqui simulamos que o exame não
    // está nesse conjunto → cai no bucket sistêmico, sem chip ACGIH.
    data.examRows = [{ id: 60, companyId: SYSTEM_COMPANY, system: true }];
    data.acgihBeiExamIds = []; // nenhum link confirmado/ativo
    const { prisma, biologicalIndicatorToExamFindMany } = buildPrisma(data);
    const repo = new ExamRepository(prisma as any);

    const result = await repo.find(
      { companyId: COMPANY },
      { skip: 0, take: 20 },
      {},
      { withOrigin: true },
    );

    expect(originSourcesById(result)[60]).toEqual(['SYSTEM']);

    // Confirma o contrato do where do enriquecimento ACGIH/BEI.
    const acgihCall = biologicalIndicatorToExamFindMany.mock.calls
      .map((c: any[]) => c[0])
      .find((args: any) => args?.where?.indicator?.normativeSource === 'ACGIH_BEI');
    expect(acgihCall.where).toMatchObject({
      examId: { in: [60] },
      deleted_at: null,
      isConfirmed: true,
      indicator: { deleted_at: null, normativeSource: 'ACGIH_BEI' },
    });
  });

  it('(8) sem N+1: a fonte ACGIH/BEI é buscada em uma única query por lote para a página inteira', async () => {
    data.examRows = [
      { id: 71, companyId: SYSTEM_COMPANY, system: true },
      { id: 72, companyId: SYSTEM_COMPANY, system: true },
      { id: 73, companyId: SYSTEM_COMPANY, system: true },
    ];
    data.acgihBeiExamIds = [72];
    const { prisma, biologicalIndicatorToExamFindMany } = buildPrisma(data);
    const repo = new ExamRepository(prisma as any);

    const result = await repo.find(
      { companyId: COMPANY },
      { skip: 0, take: 20 },
      {},
      { withOrigin: true },
    );

    const acgihCalls = biologicalIndicatorToExamFindMany.mock.calls
      .map((c: any[]) => c[0])
      .filter((args: any) => args?.where?.indicator?.normativeSource === 'ACGIH_BEI');
    expect(acgihCalls).toHaveLength(1);
    expect(acgihCalls[0].where.examId.in).toEqual([71, 72, 73]);

    const byId = originSourcesById(result);
    expect(byId[71]).toEqual(['SYSTEM']);
    expect(byId[72]).toEqual(['ACGIH_BEI']);
    expect(byId[73]).toEqual(['SYSTEM']);
  });

  it('(9) não quebra o campo antigo origin (continua presente ao lado de originSources)', async () => {
    data.examRows = [{ id: 80, companyId: SYSTEM_COMPANY, system: true }];
    data.nr07ExamIds = [80];
    const { prisma } = buildPrisma(data);
    const repo = new ExamRepository(prisma as any);

    const result = await repo.find(
      { companyId: COMPANY },
      { skip: 0, take: 20 },
      {},
      { withOrigin: true },
    );

    expect((result.data[0] as any).origin).toBe('NR07');
    expect((result.data[0] as any).originSources).toEqual(['NR_07']);
  });

  it('sem withOrigin: não enriquece origin nem originSources (picker de clínica)', async () => {
    data.examRows = [{ id: 90, companyId: SYSTEM_COMPANY, system: true }];
    data.acgihBeiExamIds = [90];
    const { prisma, biologicalIndicatorToExamFindMany } = buildPrisma(data);
    const repo = new ExamRepository(prisma as any);

    const result = await repo.find(
      { companyId: COMPANY },
      { skip: 0, take: 20 },
      {},
      {},
    );

    expect((result.data[0] as any).origin).toBeUndefined();
    expect((result.data[0] as any).originSources).toBeUndefined();
    const acgihCalls = biologicalIndicatorToExamFindMany.mock.calls
      .map((c: any[]) => c[0])
      .filter((args: any) => args?.where?.indicator?.normativeSource === 'ACGIH_BEI');
    expect(acgihCalls).toHaveLength(0);
  });
});
