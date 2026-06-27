import { Injectable } from '@nestjs/common';

import {
  diffCurationPayload,
  EsocialProcedureImportClassification as Classification,
} from './esocial-procedure-import.util';
import {
  EsocialProcedureImportPreviewService,
  EsocialProcedureImportTotals,
} from './esocial-procedure-import-preview.service';
import {
  EsocialProcedureImportUpsertItem,
  EsocialProcedureRepository,
} from './esocial-procedure.repository';

export type EsocialProcedureImportApplyResult = {
  fileName: string;
  applied: {
    created: number;
    updated: number;
    unchanged: number;
    rejected: number;
    conflict: number;
    invalid: number;
  };
  totals: EsocialProcedureImportTotals;
  affectedCodes: string[];
};

@Injectable()
export class EsocialProcedureImportApplyService {
  constructor(
    private readonly repository: EsocialProcedureRepository,
    private readonly previewService: EsocialProcedureImportPreviewService,
  ) {}

  async apply(params: {
    buffer: Buffer;
    fileName: string;
    userId?: number;
  }): Promise<EsocialProcedureImportApplyResult> {
    // Reclassifica com o estado atual do banco no momento do apply.
    const model = await this.previewService.buildModel({
      buffer: params.buffer,
      fileName: params.fileName,
    });

    const candidates = model.plan.filter(
      (item) =>
        item.payload &&
        (item.line.classification === Classification.CREATE ||
          item.line.classification === Classification.UPDATE),
    );

    if (!candidates.length) {
      return this.buildResult(model.fileName, model.totals, {
        created: 0,
        updated: 0,
        unchanged: model.totals.unchanged,
        affectedCodes: [],
      });
    }

    const codes = candidates.map((item) => item.line.procedureCode);
    const existingRows = await this.repository.findByProcedureCodes(codes);
    const existingByCode = new Map(
      existingRows.map((row) => [row.procedureCode, row]),
    );

    const upserts: EsocialProcedureImportUpsertItem[] = [];
    const affectedCodes: string[] = [];
    let appliedCreated = 0;
    let appliedUpdated = 0;
    let skippedUnchanged = 0;

    for (const item of candidates) {
      const payload = item.payload!;
      const existing = existingByCode.get(item.line.procedureCode);

      if (existing && existing.deleted_at === null) {
        const changes = diffCurationPayload(
          {
            isOccupationalRelevant: existing.isOccupationalRelevant,
            technicalType: existing.technicalType,
            status: existing.status,
            internalNotes: existing.internalNotes,
          },
          payload,
        );
        if (!changes.length) {
          skippedUnchanged++;
          continue;
        }
        appliedUpdated++;
      } else if (existing?.deleted_at) {
        // Soft-deleted: upsert restaura e atualiza.
        appliedUpdated++;
      } else {
        appliedCreated++;
      }

      upserts.push({
        procedureCode: item.line.procedureCode,
        procedureNameSnapshot: item.line.procedureNameSnapshot,
        payload,
        userId: params.userId,
      });
      affectedCodes.push(item.line.procedureCode);
    }

    if (upserts.length) {
      await this.repository.applyImportUpsertBatch(upserts);
    }

    return this.buildResult(model.fileName, model.totals, {
      created: appliedCreated,
      updated: appliedUpdated,
      unchanged: model.totals.unchanged + skippedUnchanged,
      affectedCodes,
    });
  }

  private buildResult(
    fileName: string,
    totals: EsocialProcedureImportTotals,
    applied: {
      created: number;
      updated: number;
      unchanged: number;
      affectedCodes: string[];
    },
  ): EsocialProcedureImportApplyResult {
    return {
      fileName,
      applied: {
        created: applied.created,
        updated: applied.updated,
        unchanged: applied.unchanged,
        rejected: totals.rejected,
        conflict: totals.conflict,
        invalid: totals.invalid,
      },
      totals,
      affectedCodes: applied.affectedCodes,
    };
  }
}
