import {
  BiologicalIndicatorMatchMethodEnum,
  BiologicalNormativeSourceEnum,
  Prisma,
  PrismaClient,
} from '@prisma/client';

import {
  BiologicalIndicatorExamMatchResult,
  BiologicalIndicatorMatchReport,
  BiologicalIndicatorRiskMatchResult,
} from './biological-indicator-match.types';
import { matchIndicatorToExams } from './biological-indicator-exam-match.util';
import {
  buildCatalogNameAliasMap,
  matchIndicatorToRisks,
} from './biological-indicator-risk-match.util';

export type RunBiologicalIndicatorMatchOptions = {
  dryRun?: boolean;
  indicatorIds?: string[];
};

const increment = (map: Record<string, number>, key: string) => {
  map[key] = (map[key] ?? 0) + 1;
};

export class BiologicalIndicatorMatchService {
  constructor(private readonly prisma: PrismaClient) {}

  async run(options: RunBiologicalIndicatorMatchOptions = {}): Promise<BiologicalIndicatorMatchReport> {
    const indicators = await this.prisma.occupationalBiologicalIndicator.findMany({
      where: {
        deleted_at: null,
        ...(options.indicatorIds?.length
          ? { id: { in: options.indicatorIds } }
          : {}),
      },
      orderBy: [{ substanceName: 'asc' }, { biologicalIndicatorNormalized: 'asc' }],
    });

    const risks = await this.prisma.riskFactors.findMany({
      where: {
        system: true,
        type: 'QUI',
        deleted_at: null,
      },
      select: {
        id: true,
        name: true,
        cas: true,
        synonymous: true,
      },
    });

    const exams = await this.prisma.exam.findMany({
      where: {
        system: true,
        deleted_at: null,
      },
      select: {
        id: true,
        name: true,
        material: true,
        instruction: true,
        analyses: true,
      },
    });

    const catalogRows = await this.prisma.riskCatalogEquivalence.findMany({
      where: { revokedAt: null },
      select: {
        canonicalLabel: true,
        aliasLabel: true,
      },
    });

    const catalogNameAliases = buildCatalogNameAliasMap(catalogRows);

    const report: BiologicalIndicatorMatchReport = {
      indicatorsAnalyzed: indicators.length,
      riskLinksCreated: 0,
      riskLinksSkipped: 0,
      examLinksCreated: 0,
      examLinksSkipped: 0,
      noRiskMatch: [],
      noExamMatch: [],
      ambiguousRiskMatches: [],
      secureCasMatches: [],
      riskByConfidence: {},
      riskByMethod: {},
      examByConfidence: {},
      examByMethod: {},
      sampleRiskMatches: [],
      sampleExamMatches: [],
    };

    const riskResults: BiologicalIndicatorRiskMatchResult[] = [];
    const examResults: BiologicalIndicatorExamMatchResult[] = [];

    for (const indicator of indicators) {
      const matchInput = {
        id: indicator.id,
        substanceName: indicator.substanceName,
        substanceNameNormalized: indicator.substanceNameNormalized,
        casNumbers: indicator.casNumbers,
        biologicalIndicatorNormalized: indicator.biologicalIndicatorNormalized,
        biologicalMatrix: indicator.biologicalMatrix,
        collectionMoment: indicator.collectionMoment,
        tableNumber: indicator.tableNumber,
        indicatorType: indicator.indicatorType,
        isSubstanceGroup: indicator.isSubstanceGroup,
        requiresNormativeReview: indicator.requiresNormativeReview,
      };

      const riskMatches = matchIndicatorToRisks(
        matchInput,
        risks,
        catalogNameAliases,
      );

      const examMatches = matchIndicatorToExams(matchInput, exams);

      const riskResult: BiologicalIndicatorRiskMatchResult = {
        indicatorId: indicator.id,
        substanceName: indicator.substanceName,
        matches: riskMatches,
        matchMethod:
          riskMatches.length > 0
            ? riskMatches[0].matchMethod
            : ('NO_RISK_MATCH' as const),
      };

      const examResult: BiologicalIndicatorExamMatchResult = {
        indicatorId: indicator.id,
        substanceName: indicator.substanceName,
        biologicalIndicatorNormalized: indicator.biologicalIndicatorNormalized,
        matches: examMatches,
        matchMethod:
          examMatches.length > 0
            ? examMatches[0].matchMethod
            : ('NO_EXAM_MATCH' as const),
      };

      riskResults.push(riskResult);
      examResults.push(examResult);

      if (!riskMatches.length) {
        report.noRiskMatch.push(riskResult);
      } else if (riskMatches.length > 1) {
        report.ambiguousRiskMatches.push(riskResult);
      } else if (
        riskMatches[0].matchMethod === BiologicalIndicatorMatchMethodEnum.CAS_EXACT ||
        riskMatches[0].matchMethod === BiologicalIndicatorMatchMethodEnum.CAS_MULTI_ANY
      ) {
        report.secureCasMatches.push({
          indicatorId: indicator.id,
          substanceName: indicator.substanceName,
          casNumbers: indicator.casNumbers,
          matches: riskMatches,
        });
      }

      if (!examMatches.length) {
        report.noExamMatch.push(examResult);
      }

      if (!options.dryRun) {
        await this.persistRiskMatches(indicator.id, riskMatches, report);
        await this.persistExamMatches(indicator.id, examMatches, report);
      } else {
        riskMatches.forEach((match) => {
          increment(report.riskByConfidence, match.matchConfidence);
          increment(report.riskByMethod, match.matchMethod);
        });
        examMatches.forEach((match) => {
          increment(report.examByConfidence, match.matchConfidence);
          increment(report.examByMethod, match.matchMethod);
        });
        report.riskLinksCreated += riskMatches.length;
        report.examLinksCreated += examMatches.length;
      }
    }

    if (!options.dryRun) {
      const persisted = await this.loadPersistedDistribution();
      report.riskByConfidence = persisted.riskByConfidence;
      report.riskByMethod = persisted.riskByMethod;
      report.examByConfidence = persisted.examByConfidence;
      report.examByMethod = persisted.examByMethod;
    }

    report.sampleRiskMatches = riskResults
      .filter((result) => result.matches.length)
      .slice(0, 5)
      .map((result) => ({
        indicatorId: result.indicatorId,
        substanceName: result.substanceName,
        biologicalIndicatorNormalized:
          indicators.find((item) => item.id === result.indicatorId)
            ?.biologicalIndicatorNormalized ?? '',
        match: result.matches[0],
      }));

    report.sampleExamMatches = examResults
      .filter((result) => result.matches.length)
      .slice(0, 5)
      .map((result) => ({
        indicatorId: result.indicatorId,
        substanceName: result.substanceName,
        biologicalIndicatorNormalized: result.biologicalIndicatorNormalized,
        match: result.matches[0],
      }));

    return report;
  }

  private async persistRiskMatches(
    indicatorId: string,
    matches: Awaited<ReturnType<typeof matchIndicatorToRisks>>,
    report: BiologicalIndicatorMatchReport,
  ) {
    for (const match of matches) {
      const existing = await this.prisma.biologicalIndicatorToRisk.findUnique({
        where: {
          indicatorId_riskFactorId: {
            indicatorId,
            riskFactorId: match.riskFactorId,
          },
        },
      });

      if (
        existing &&
        existing.matchConfidence === match.matchConfidence &&
        existing.matchMethod === match.matchMethod &&
        existing.requiresReview === match.requiresReview
      ) {
        report.riskLinksSkipped += 1;
        increment(report.riskByConfidence, existing.matchConfidence);
        increment(report.riskByMethod, existing.matchMethod);
        continue;
      }

      const data: Prisma.BiologicalIndicatorToRiskUpsertArgs['create'] = {
        indicatorId,
        riskFactorId: match.riskFactorId,
        matchConfidence: match.matchConfidence,
        matchMethod: match.matchMethod,
        requiresReview: match.requiresReview,
        isConfirmed: false,
        isPrimary: matches.length === 1,
        riskNameSnapshot: match.riskName,
        riskCasSnapshot: match.riskCas,
      };

      await this.prisma.biologicalIndicatorToRisk.upsert({
        where: {
          indicatorId_riskFactorId: {
            indicatorId,
            riskFactorId: match.riskFactorId,
          },
        },
        create: data,
        update: {
          ...data,
          deleted_at: null,
        },
      });

      report.riskLinksCreated += 1;
      increment(report.riskByConfidence, match.matchConfidence);
      increment(report.riskByMethod, match.matchMethod);
    }

    const activeRiskFactorIds = matches.map((match) => match.riskFactorId);
    const deprecated = await this.prisma.biologicalIndicatorToRisk.updateMany({
      where: {
        indicatorId,
        deleted_at: null,
        ...(activeRiskFactorIds.length
          ? { riskFactorId: { notIn: activeRiskFactorIds } }
          : {}),
      },
      data: { deleted_at: new Date() },
    });

    if (deprecated.count > 0) {
      report.riskLinksDeprecated = (report.riskLinksDeprecated ?? 0) + deprecated.count;
    }
  }

  private async persistExamMatches(
    indicatorId: string,
    matches: Awaited<ReturnType<typeof matchIndicatorToExams>>,
    report: BiologicalIndicatorMatchReport,
  ) {
    for (const match of matches) {
      const existing = await this.prisma.biologicalIndicatorToExam.findUnique({
        where: {
          indicatorId_examId: {
            indicatorId,
            examId: match.examId,
          },
        },
      });

      if (
        existing &&
        existing.matchConfidence === match.matchConfidence &&
        existing.matchMethod === match.matchMethod &&
        existing.requiresReview === match.requiresReview
      ) {
        report.examLinksSkipped += 1;
        increment(report.examByConfidence, existing.matchConfidence);
        increment(report.examByMethod, existing.matchMethod);
        continue;
      }

      const data: Prisma.BiologicalIndicatorToExamUpsertArgs['create'] = {
        indicatorId,
        examId: match.examId,
        matchConfidence: match.matchConfidence,
        matchMethod: match.matchMethod,
        requiresReview: match.requiresReview,
        isConfirmed: false,
        isDefault: false,
        examNameSnapshot: match.examName,
        examMaterialSnapshot: match.examMaterial,
      };

      await this.prisma.biologicalIndicatorToExam.upsert({
        where: {
          indicatorId_examId: {
            indicatorId,
            examId: match.examId,
          },
        },
        create: data,
        update: {
          ...data,
          deleted_at: null,
        },
      });

      report.examLinksCreated += 1;
      increment(report.examByConfidence, match.matchConfidence);
      increment(report.examByMethod, match.matchMethod);
    }

    const activeExamIds = matches.map((match) => match.examId);
    const deprecated = await this.prisma.biologicalIndicatorToExam.updateMany({
      where: {
        indicatorId,
        deleted_at: null,
        ...(activeExamIds.length
          ? { examId: { notIn: activeExamIds } }
          : {}),
      },
      data: { deleted_at: new Date() },
    });

    if (deprecated.count > 0) {
      report.examLinksDeprecated = (report.examLinksDeprecated ?? 0) + deprecated.count;
    }
  }

  private async loadPersistedDistribution() {
    const [riskLinks, examLinks] = await Promise.all([
      this.prisma.biologicalIndicatorToRisk.findMany({
        where: { deleted_at: null },
        select: { matchConfidence: true, matchMethod: true },
      }),
      this.prisma.biologicalIndicatorToExam.findMany({
        where: { deleted_at: null },
        select: { matchConfidence: true, matchMethod: true },
      }),
    ]);

    const riskByConfidence: Record<string, number> = {};
    const riskByMethod: Record<string, number> = {};
    const examByConfidence: Record<string, number> = {};
    const examByMethod: Record<string, number> = {};

    riskLinks.forEach((link) => {
      increment(riskByConfidence, link.matchConfidence);
      increment(riskByMethod, link.matchMethod);
    });

    examLinks.forEach((link) => {
      increment(examByConfidence, link.matchConfidence);
      increment(examByMethod, link.matchMethod);
    });

    return { riskByConfidence, riskByMethod, examByConfidence, examByMethod };
  }

  async findReusableImportBatch(params: {
    normativeSource: BiologicalNormativeSourceEnum;
    normativeVersion: string;
    sourceFileHash: string;
  }) {
    return this.prisma.biologicalIndicatorImportBatch.findFirst({
      where: {
        normativeSource: params.normativeSource,
        normativeVersion: params.normativeVersion,
        sourceFileHash: params.sourceFileHash,
      },
      orderBy: { importedAt: 'desc' },
    });
  }
}
