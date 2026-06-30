import { beforeEach, describe, expect, it, jest } from '@jest/globals';

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
}

const emptyData = (): MockData => ({
  riskIndicatorIds: [],
  riskFactorExamIds: [],
  libraryRules: [],
  casNameIndicatorLinks: [],
  nr07ExamIds: [],
});

const buildPrisma = (data: MockData) => {
  const examFindMany = jest.fn(async (_args?: { where: Where }) => [] as any[]);
  const examCount = jest.fn(async (_args?: { where: Where }) => 0);

  const biologicalIndicatorToExamFindMany = jest.fn(
    async ({ where }: { where: Where }) => {
      // getNr07ExamIds(): indicator.normativeSource === NR_07
      if (where?.indicator?.normativeSource) {
        return data.nr07ExamIds.map((examId) => ({ examId }));
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

  return { prisma, examFindMany, examCount };
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
