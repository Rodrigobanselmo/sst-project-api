import { createHash } from 'crypto';

import { BadRequestException, Injectable } from '@nestjs/common';
import {
  BiologicalIndicatorStatusEnum,
  BiologicalNormativeSourceEnum,
  Prisma,
} from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';

import { buildIndicatorCreateData } from '../biological-indicator-import.util';
import { BiologicalIndicatorPreviewClassification as Classification } from '../biological-indicator-preview.util';
import {
  BiologicalIndicatorImportPreviewService,
  ImportPreviewModel,
} from './biological-indicator-import-preview.service';

/** Changed fields that imply the indicator → risk curation must be redone. */
const RISK_RECURATION_FIELDS = new Set<string>([
  'substanceName',
  'substanceNameNormalized',
  'casNumbers',
  'casPrimary',
  'isSubstanceGroup',
  'substanceGroupId',
]);

/** Changed fields that imply the indicator → exam curation must be redone. */
const EXAM_RECURATION_FIELDS = new Set<string>([
  'biologicalIndicatorOriginal',
  'biologicalIndicatorNormalized',
  'biologicalMatrix',
  'collectionMoment',
  'referenceValueRaw',
  'referenceValue',
  'unit',
]);

export type ImportApplyResult = {
  batchId: string;
  fileName: string;
  applied: {
    new: number;
    updated: number;
    deprecated: number;
    unchanged: number;
    riskLinksFlagged: number;
    examLinksFlagged: number;
  };
  totals: ImportPreviewModel['totals'];
  affectedIndicatorIds: string[];
};

@Injectable()
export class BiologicalIndicatorImportApplyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly previewService: BiologicalIndicatorImportPreviewService,
  ) {}

  async apply(params: {
    buffer: Buffer;
    fileName: string;
    normativeVersion?: string;
    userId: number;
  }): Promise<ImportApplyResult> {
    const model = await this.previewService.buildModel({
      buffer: params.buffer,
      fileName: params.fileName,
      normativeVersion: params.normativeVersion,
    });

    this.assertApplicable(model);

    const fileHash = createHash('sha256').update(params.buffer).digest('hex');
    const appliedAt = new Date();

    return this.prisma.$transaction(async (tx) => {
      const batch = await tx.biologicalIndicatorImportBatch.create({
        data: {
          normativeSource: BiologicalNormativeSourceEnum.NR_07,
          normativeVersion: model.normativeVersion,
          sourceFileName: params.fileName,
          sourceFileHash: fileHash,
          importedById: params.userId,
          notes: 'Aplicação normativa NR-07 via planilha (Fase 3.6-B).',
          stats: {
            mode: 'APPLIED',
            userId: params.userId,
            appliedAt: appliedAt.toISOString(),
            fileName: params.fileName,
            fileHash,
            read: model.totals.read,
            valid: model.totals.valid,
            invalid: model.totals.invalid,
            new: model.totals.new,
            updated: model.totals.updated,
            unchanged: model.totals.unchanged,
            deprecatedCandidate: model.totals.deprecatedCandidate,
            conflict: model.totals.conflict,
          },
        },
      });

      const affectedIndicatorIds: string[] = [];
      let riskLinksFlagged = 0;
      let examLinksFlagged = 0;

      for (const item of model.plan) {
        const { line, payload, existing } = item;

        if (line.classification === Classification.NEW && payload) {
          const created = await tx.occupationalBiologicalIndicator.create({
            data: {
              ...buildIndicatorCreateData(payload, batch.id),
              status: BiologicalIndicatorStatusEnum.DRAFT,
            },
            select: { id: true },
          });
          affectedIndicatorIds.push(created.id);
          continue;
        }

        if (
          line.classification === Classification.UPDATED &&
          payload &&
          existing
        ) {
          const revalidationNote = this.buildRevalidationNote(
            appliedAt,
            line.changedFields,
          );

          const updateData: Prisma.OccupationalBiologicalIndicatorUncheckedUpdateInput =
            {
              ...payload,
              occupationalApplicability:
                payload.occupationalApplicability as Prisma.InputJsonValue,
              importBatchId: batch.id,
              status: BiologicalIndicatorStatusEnum.DRAFT,
              reviewedById: null,
              reviewedAt: null,
              reviewNotes: revalidationNote,
            };

          await tx.occupationalBiologicalIndicator.update({
            where: { id: existing.id },
            data: updateData,
          });
          affectedIndicatorIds.push(existing.id);

          if (this.intersects(line.changedFields, RISK_RECURATION_FIELDS)) {
            const res = await tx.biologicalIndicatorToRisk.updateMany({
              where: { indicatorId: existing.id, deleted_at: null },
              data: { requiresReview: true, isConfirmed: false },
            });
            riskLinksFlagged += res.count;
          }

          if (this.intersects(line.changedFields, EXAM_RECURATION_FIELDS)) {
            const res = await tx.biologicalIndicatorToExam.updateMany({
              where: { indicatorId: existing.id, deleted_at: null },
              data: { requiresReview: true, isConfirmed: false },
            });
            examLinksFlagged += res.count;
          }
          continue;
        }

        if (
          line.classification === Classification.DEPRECATED_CANDIDATE &&
          existing
        ) {
          await tx.occupationalBiologicalIndicator.update({
            where: { id: existing.id },
            data: {
              status: BiologicalIndicatorStatusEnum.DEPRECATED,
              importBatchId: batch.id,
            },
          });
          affectedIndicatorIds.push(existing.id);
          continue;
        }

        // UNCHANGED / anything else: no-op
      }

      return {
        batchId: batch.id,
        fileName: params.fileName,
        applied: {
          new: model.totals.new,
          updated: model.totals.updated,
          deprecated: model.totals.deprecatedCandidate,
          unchanged: model.totals.unchanged,
          riskLinksFlagged,
          examLinksFlagged,
        },
        totals: model.totals,
        affectedIndicatorIds,
      };
    });
  }

  private assertApplicable(model: ImportPreviewModel) {
    if (model.totals.invalid > 0 || model.totals.conflict > 0) {
      const offending = model.lines
        .filter(
          (l) =>
            l.classification === Classification.INVALID ||
            l.classification === Classification.CONFLICT,
        )
        .map((l) => ({
          rowNumber: l.rowNumber,
          classification: l.classification,
          substanceName: l.substanceName,
          errors: l.errors,
        }));

      throw new BadRequestException({
        message:
          'A aplicação foi bloqueada: existem linhas inválidas ou em conflito. Corrija a planilha e gere uma nova prévia.',
        invalid: model.totals.invalid,
        conflict: model.totals.conflict,
        offending,
      });
    }

    const applicable =
      model.totals.new + model.totals.updated + model.totals.deprecatedCandidate;
    if (applicable === 0) {
      throw new BadRequestException(
        'Nenhuma alteração aplicável foi detectada na planilha.',
      );
    }
  }

  private buildRevalidationNote(date: Date, changedFields: string[]): string {
    const formatted = date.toLocaleDateString('pt-BR');
    const fields = changedFields.length ? changedFields.join(', ') : '—';
    return `Revalidação exigida por atualização normativa via planilha em ${formatted}. Campos alterados: ${fields}.`;
  }

  private intersects(fields: string[], set: Set<string>): boolean {
    return fields.some((field) => set.has(field));
  }
}
