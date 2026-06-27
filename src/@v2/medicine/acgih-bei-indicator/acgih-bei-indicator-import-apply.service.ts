import { Injectable } from '@nestjs/common';

import { AcgihBeiImportClassification as Classification } from './acgih-bei-indicator-import.util';
import {
  AcgihBeiImportTotals,
  AcgihBeiIndicatorImportPreviewService,
} from './acgih-bei-indicator-import-preview.service';
import {
  AcgihBeiImportUpsertItem,
  AcgihBeiIndicatorRepository,
} from './acgih-bei-indicator.repository';

export type AcgihBeiImportApplyResult = {
  fileName: string;
  applied: {
    created: number;
    updated: number;
    unchanged: number;
    rejected: number;
    conflict: number;
    invalid: number;
  };
  totals: AcgihBeiImportTotals;
  affectedIds: number;
};

@Injectable()
export class AcgihBeiIndicatorImportApplyService {
  constructor(
    private readonly repository: AcgihBeiIndicatorRepository,
    private readonly previewService: AcgihBeiIndicatorImportPreviewService,
  ) {}

  async apply(params: {
    buffer: Buffer;
    fileName: string;
    userId?: number;
  }): Promise<AcgihBeiImportApplyResult> {
    // Reclassifica com o estado atual do banco no momento do apply (idempotente).
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

    let created = 0;
    let updated = 0;

    const upserts: AcgihBeiImportUpsertItem[] = candidates.map((item) => {
      if (item.line.classification === Classification.CREATE) created++;
      else updated++;
      return {
        targetId: item.targetId,
        dedupeKey: item.dedupeKey,
        substanceNameNormalized: item.substanceNameNormalized,
        payload: item.payload!,
        userId: params.userId,
      };
    });

    if (upserts.length) {
      await this.repository.applyImportUpsertBatch(upserts);
    }

    return {
      fileName: model.fileName,
      applied: {
        created,
        updated,
        unchanged: model.totals.unchanged,
        rejected: model.totals.rejected,
        conflict: model.totals.conflict,
        invalid: model.totals.invalid,
      },
      totals: model.totals,
      affectedIds: upserts.length,
    };
  }
}
