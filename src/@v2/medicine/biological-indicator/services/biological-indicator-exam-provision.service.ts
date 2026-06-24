import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { ESocial27TableRepository } from '@/modules/esocial/repositories/implementations/ESocial27TableRepository';
import { simpleCompanyId } from '@/shared/constants/ids';

import {
  BiologicalIndicatorExamProvisionReport,
  ExamCatalogSnapshot,
  IndicatorExamProvisionSample,
} from '../biological-indicator-exam-provision.types';
import {
  buildExamCreatePayload,
  buildExamLinkProvisionPolicy,
  buildNormativeExamLinkNotes,
  findExistingExamForIndicator,
  findTenantReferenceExam,
  isSystemicCatalogExam,
  normalizeEsocialCatalog,
} from '../biological-indicator-exam-provision.util';

export type RunBiologicalIndicatorExamProvisionOptions = {
  dryRun?: boolean;
  indicatorIds?: string[];
  skipSanitize?: boolean;
};

@Injectable()
export class BiologicalIndicatorExamProvisionService {
  constructor(private readonly prisma: PrismaClient) {}

  async run(
    options: RunBiologicalIndicatorExamProvisionOptions = {},
  ): Promise<BiologicalIndicatorExamProvisionReport> {
    const invalidLinksSanitized = options.skipSanitize
      ? 0
      : await this.sanitizeInvalidExamLinks(options.dryRun ?? false);

    const indicators = await this.prisma.occupationalBiologicalIndicator.findMany({
      where: {
        deleted_at: null,
        ...(options.indicatorIds?.length ? { id: { in: options.indicatorIds } } : {}),
      },
      orderBy: [{ substanceName: 'asc' }, { biologicalIndicatorOriginal: 'asc' }],
    });

    const exams = await this.prisma.exam.findMany({
      where: { deleted_at: null },
      select: {
        id: true,
        name: true,
        material: true,
        instruction: true,
        analyses: true,
        esocial27Code: true,
        companyId: true,
        system: true,
      },
      orderBy: [{ system: 'desc' }, { companyId: 'asc' }, { name: 'asc' }],
    });

    const esocialCatalog = normalizeEsocialCatalog(
      await new ESocial27TableRepository().findAll(),
    );

    const pool: ExamCatalogSnapshot[] = [...exams];
    const report: BiologicalIndicatorExamProvisionReport = {
      indicatorsProcessed: indicators.length,
      examsReused: 0,
      examsCreated: 0,
      linksCreated: 0,
      linksReused: 0,
      linksUpdated: 0,
      invalidLinksSanitized,
      indicatorsWithExam: 0,
      indicatorsWithoutExam: [],
      esocialCodesApplied: 0,
      samples: [],
    };

    for (const indicator of indicators) {
      const provisionInput = {
        id: indicator.id,
        biologicalIndicatorOriginal: indicator.biologicalIndicatorOriginal,
        biologicalIndicatorNormalized: indicator.biologicalIndicatorNormalized,
        biologicalMatrix: indicator.biologicalMatrix,
        collectionMoment: indicator.collectionMoment,
        tableNumber: indicator.tableNumber,
        indicatorType: indicator.indicatorType,
        isSubstanceGroup: indicator.isSubstanceGroup,
        requiresNormativeReview: indicator.requiresNormativeReview,
        referenceValue: indicator.referenceValue,
        unit: indicator.unit,
        technicalObservations: indicator.technicalObservations,
        technicalObservationsRaw: indicator.technicalObservationsRaw,
        normativeVersion: indicator.normativeVersion,
      };

      let resolved = findExistingExamForIndicator(provisionInput, pool, esocialCatalog);
      const referenceExam = resolved
        ? null
        : findTenantReferenceExam(provisionInput, pool, esocialCatalog);

      let action: IndicatorExamProvisionSample['action'] = 'REUSED_EXAM';
      let createdEsocialCode: string | null = resolved?.esocial27Code ?? null;
      let matchedViaEsocial = resolved?.matchedViaEsocial ?? false;

      if (!resolved) {
        const createPayload = buildExamCreatePayload(
          provisionInput,
          esocialCatalog,
          referenceExam,
        );
        action = 'CREATED_EXAM';
        createdEsocialCode = createPayload.esocial27Code ?? null;
        matchedViaEsocial = Boolean(createPayload.esocial27Code);

        if (!options.dryRun) {
          const created = await this.prisma.exam.create({
            data: createPayload,
            select: {
              id: true,
              name: true,
              material: true,
              instruction: true,
              analyses: true,
              esocial27Code: true,
              companyId: true,
              system: true,
            },
          });

          pool.push(created);
          resolved = {
            examId: created.id,
            examName: created.name,
            examMaterial: created.material,
            matchMethod: buildExamLinkProvisionPolicy(provisionInput).matchMethod,
            matchConfidence: buildExamLinkProvisionPolicy(provisionInput).matchConfidence,
            matchedViaEsocial,
            esocial27Code: created.esocial27Code,
          };
        } else {
          resolved = {
            examId: -1,
            examName: createPayload.name,
            examMaterial: createPayload.material,
            matchMethod: buildExamLinkProvisionPolicy(provisionInput).matchMethod,
            matchConfidence: buildExamLinkProvisionPolicy(provisionInput).matchConfidence,
            matchedViaEsocial,
            esocial27Code: createdEsocialCode,
          };
        }

        report.examsCreated += 1;
        if (createdEsocialCode) report.esocialCodesApplied += 1;
      } else {
        report.examsReused += 1;
        if (resolved.matchedViaEsocial) report.esocialCodesApplied += 1;
      }

      if (!resolved) {
        report.indicatorsWithoutExam.push(indicator.biologicalIndicatorOriginal);
        continue;
      }

      if (!options.dryRun && resolved.examId > 0) {
        const linkedExam = pool.find((exam) => exam.id === resolved.examId);
        if (!linkedExam || !isSystemicCatalogExam(linkedExam)) {
          report.indicatorsWithoutExam.push(indicator.biologicalIndicatorOriginal);
          continue;
        }
      }

      const linkPolicy = buildExamLinkProvisionPolicy(provisionInput);
      const notes = buildNormativeExamLinkNotes(provisionInput, referenceExam);
      let linkAction: IndicatorExamProvisionSample['linkAction'] = 'CREATED_LINK';

      if (!options.dryRun && resolved.examId > 0) {
        const existingLink = await this.prisma.biologicalIndicatorToExam.findUnique({
          where: {
            indicatorId_examId: {
              indicatorId: indicator.id,
              examId: resolved.examId,
            },
          },
        });

        if (
          existingLink &&
          existingLink.deleted_at === null &&
          existingLink.isConfirmed === linkPolicy.isConfirmed &&
          existingLink.isDefault === linkPolicy.isDefault &&
          existingLink.requiresReview === linkPolicy.requiresReview &&
          existingLink.matchMethod === linkPolicy.matchMethod
        ) {
          linkAction = 'REUSED_LINK';
          report.linksReused += 1;
        } else if (existingLink) {
          linkAction = 'UPDATED_LINK';
          report.linksUpdated += 1;
        } else {
          report.linksCreated += 1;
        }

        await this.prisma.$transaction([
          this.prisma.biologicalIndicatorToExam.updateMany({
            where: {
              indicatorId: indicator.id,
              deleted_at: null,
              examId: { not: resolved.examId },
            },
            data: { deleted_at: new Date(), isDefault: false },
          }),
          this.prisma.biologicalIndicatorToExam.upsert({
            where: {
              indicatorId_examId: {
                indicatorId: indicator.id,
                examId: resolved.examId,
              },
            },
            create: {
              indicatorId: indicator.id,
              examId: resolved.examId,
              matchConfidence: linkPolicy.matchConfidence,
              matchMethod: linkPolicy.matchMethod,
              requiresReview: linkPolicy.requiresReview,
              isConfirmed: linkPolicy.isConfirmed,
              isDefault: linkPolicy.isDefault,
              examNameSnapshot: resolved.examName,
              examMaterialSnapshot: resolved.examMaterial,
              notes,
            },
            update: {
              deleted_at: null,
              matchConfidence: linkPolicy.matchConfidence,
              matchMethod: linkPolicy.matchMethod,
              requiresReview: linkPolicy.requiresReview,
              isConfirmed: linkPolicy.isConfirmed,
              isDefault: linkPolicy.isDefault,
              examNameSnapshot: resolved.examName,
              examMaterialSnapshot: resolved.examMaterial,
              notes,
            },
          }),
        ]);
      } else if (options.dryRun) {
        report.linksCreated += 1;
      }

      report.indicatorsWithExam += 1;

      if (report.samples.length < 12) {
        report.samples.push({
          indicatorId: indicator.id,
          biologicalIndicatorOriginal: indicator.biologicalIndicatorOriginal,
          examId: resolved.examId,
          examName: resolved.examName,
          examMaterial: resolved.examMaterial,
          action,
          linkAction,
          esocial27Code: createdEsocialCode ?? resolved.esocial27Code,
          matchedViaEsocial,
        });
      }
    }

    return report;
  }

  async sanitizeInvalidExamLinks(dryRun: boolean): Promise<number> {
    const invalidLinks = await this.prisma.biologicalIndicatorToExam.findMany({
      where: {
        deleted_at: null,
        exam: {
          OR: [{ companyId: { not: simpleCompanyId } }, { system: false }],
        },
      },
      select: { id: true },
    });

    if (!invalidLinks.length || dryRun) {
      return invalidLinks.length;
    }

    await this.prisma.biologicalIndicatorToExam.updateMany({
      where: { id: { in: invalidLinks.map((link) => link.id) } },
      data: {
        deleted_at: new Date(),
        isDefault: false,
        isConfirmed: false,
      },
    });

    return invalidLinks.length;
  }

  async diagnoseInvalidExamLinks() {
    return this.prisma.biologicalIndicatorToExam.findMany({
      where: {
        deleted_at: null,
        exam: {
          OR: [{ companyId: { not: simpleCompanyId } }, { system: false }],
        },
      },
      include: {
        exam: {
          select: {
            id: true,
            name: true,
            material: true,
            companyId: true,
            system: true,
            esocial27Code: true,
            company: { select: { name: true } },
          },
        },
        indicator: {
          select: {
            id: true,
            biologicalIndicatorOriginal: true,
            substanceName: true,
          },
        },
      },
      orderBy: { created_at: 'asc' },
    });
  }

  async diagnoseActiveExamLinkCoverage() {
    const [totalActiveLinks, systemicLinks, simpleCompanyLinks, externalTenantLinks, indicatorsWithActiveLink] =
      await Promise.all([
        this.prisma.biologicalIndicatorToExam.count({ where: { deleted_at: null } }),
        this.prisma.biologicalIndicatorToExam.count({
          where: { deleted_at: null, exam: { system: true, companyId: simpleCompanyId } },
        }),
        this.prisma.biologicalIndicatorToExam.count({
          where: { deleted_at: null, exam: { companyId: simpleCompanyId } },
        }),
        this.prisma.biologicalIndicatorToExam.count({
          where: {
            deleted_at: null,
            exam: {
              OR: [{ companyId: { not: simpleCompanyId } }, { system: false }],
            },
          },
        }),
        this.prisma.occupationalBiologicalIndicator.count({
          where: {
            deleted_at: null,
            examLinks: { some: { deleted_at: null } },
          },
        }),
      ]);

    return {
      totalActiveLinks,
      systemicLinks,
      simpleCompanyLinks,
      externalTenantLinks,
      indicatorsWithActiveLink,
    };
  }
}

export const createBiologicalIndicatorExamProvisionService = (
  prisma: PrismaClient,
) => new BiologicalIndicatorExamProvisionService(prisma);
