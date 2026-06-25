import { BadRequestException, Injectable } from '@nestjs/common';
import { BiologicalNormativeSourceEnum, Prisma } from '@prisma/client';
import * as XLSX from 'xlsx';

import { PrismaService } from '@/prisma/prisma.service';

import {
  getNormativePayloadDiffFields,
  IndicatorNormativePayload,
  toIndicatorNormativePayload,
} from '../biological-indicator-import.util';
import {
  BiologicalIndicatorPreviewClassification as Classification,
  ParsedPreviewRow,
  parsePreviewRow,
  PreviewAnchor,
  PreviewRowError,
} from '../biological-indicator-preview.util';
import {
  SpreadsheetIndicatorRow,
} from '../biological-indicator-spreadsheet.parser';
import { BIOLOGICAL_INDICATOR_SHEET_NAMES as SHEETS } from '../biological-indicator-spreadsheet.constants';

const DEFAULT_NORMATIVE_VERSION = 'NR-07-2022';

/** Payload fields that the spreadsheet does not control independently, or that
 *  are lifecycle metadata, or that are DERIVED from another field — excluded
 *  from the normative diff to avoid false UPDATED rows.
 *
 *  - referenceValue: normalized derivative of referenceValueRaw (the only
 *    "Valor" column the spreadsheet round-trips). Compared via referenceValueRaw.
 *  - casPrimary: derivative (first item) of casNumbers. There is no independent
 *    "primary CAS" column. Compared via casNumbers. */
const DIFF_IGNORED_FIELDS = new Set<keyof IndicatorNormativePayload>([
  'substanceGroupId',
  'idempotencyKey',
  'status',
  'dataOrigin',
  'referenceValue',
  'casPrimary',
]);

export type PreviewFieldChange = {
  field: string;
  from: string;
  to: string;
};

export type PreviewLine = {
  rowNumber: number;
  classification: Classification;
  anchorUsed: PreviewAnchor;
  indicatorId: string | null;
  idempotencyKey: string | null;
  substanceName: string;
  changedFields: string[];
  fieldChanges: PreviewFieldChange[];
  errors: PreviewRowError[];
};

export type ImportPreviewResult = {
  fileName: string;
  totals: {
    read: number;
    valid: number;
    invalid: number;
    new: number;
    updated: number;
    unchanged: number;
    deprecatedCandidate: number;
    conflict: number;
  };
  lines: PreviewLine[];
  deprecatedCandidates: Array<{ indicatorId: string; substanceName: string }>;
};

export const existingSelect = {
  id: true,
  idempotencyKey: true,
  normativeSource: true,
  annex: true,
  tableNumber: true,
  indicatorType: true,
  normativeVersion: true,
  substanceName: true,
  substanceNameNormalized: true,
  casPrimary: true,
  casNumbers: true,
  substanceGroupId: true,
  isSubstanceGroup: true,
  biologicalIndicatorOriginal: true,
  biologicalIndicatorNormalized: true,
  biologicalMatrix: true,
  collectionMoment: true,
  referenceValue: true,
  referenceValueRaw: true,
  unit: true,
  technicalObservations: true,
  technicalObservationsRaw: true,
  defaultValidityMonths: true,
  collectionToleranceDays: true,
  occupationalApplicability: true,
  requiresNormativeReview: true,
  generalApplicabilityNotes: true,
  status: true,
  dataOrigin: true,
} satisfies Prisma.OccupationalBiologicalIndicatorSelect;

export type ExistingIndicator = Prisma.OccupationalBiologicalIndicatorGetPayload<{
  select: typeof existingSelect;
}>;

/** Per-row outcome enriched with the data the apply step needs (incoming
 *  payload + matched existing record). Used by the apply service so that the
 *  classification logic stays single-sourced with the preview. */
export type PreviewPlanItem = {
  line: PreviewLine;
  payload: IndicatorNormativePayload | null;
  existing: ExistingIndicator | null;
};

export type ImportPreviewModel = {
  fileName: string;
  normativeVersion: string;
  totals: ImportPreviewResult['totals'];
  lines: PreviewLine[];
  deprecatedCandidates: ImportPreviewResult['deprecatedCandidates'];
  plan: PreviewPlanItem[];
};

type ClassifiedRow = {
  line: PreviewLine;
  payload: IndicatorNormativePayload | null;
  existing: ExistingIndicator | null;
};

@Injectable()
export class BiologicalIndicatorImportPreviewService {
  constructor(private readonly prisma: PrismaService) {}

  async preview(params: {
    buffer: Buffer;
    fileName: string;
    normativeVersion?: string;
  }): Promise<ImportPreviewResult> {
    const model = await this.buildModel(params);
    return {
      fileName: model.fileName,
      totals: model.totals,
      lines: model.lines,
      deprecatedCandidates: model.deprecatedCandidates,
    };
  }

  /** Full preview model including the per-row apply plan. The apply service
   *  reuses this so classification rules stay single-sourced. */
  async buildModel(params: {
    buffer: Buffer;
    fileName: string;
    normativeVersion?: string;
  }): Promise<ImportPreviewModel> {
    const normativeVersion = params.normativeVersion ?? DEFAULT_NORMATIVE_VERSION;
    const rows = this.readRows(params.buffer);

    const parsedRows = rows.map((row, index) =>
      parsePreviewRow(row, index + 2, normativeVersion),
    );

    const existing = await this.loadExisting(normativeVersion);
    const byId = new Map(existing.map((e) => [e.id, e]));
    const byKey = new Map(existing.map((e) => [e.idempotencyKey, e]));

    const seenIds = this.countOccurrences(
      parsedRows.map((r) => r.indicatorId).filter((v): v is string => !!v),
    );
    const seenKeys = this.countOccurrences(
      parsedRows.map((r) => r.idempotencyKey).filter((v): v is string => !!v),
    );

    const matchedExistingIds = new Set<string>();
    const classified: ClassifiedRow[] = parsedRows.map((parsed) =>
      this.classifyRow(parsed, {
        byId,
        byKey,
        seenIds,
        seenKeys,
        matchedExistingIds,
      }),
    );

    const lines: PreviewLine[] = classified.map((c) => c.line);
    const plan: PreviewPlanItem[] = classified.map((c) => ({
      line: c.line,
      payload: c.payload,
      existing: c.existing,
    }));

    const deprecatedCandidates = existing
      .filter((e) => !matchedExistingIds.has(e.id))
      .map((e) => ({ indicatorId: e.id, substanceName: e.substanceName }));

    deprecatedCandidates.forEach((candidate) => {
      const line: PreviewLine = {
        rowNumber: -1,
        classification: Classification.DEPRECATED_CANDIDATE,
        anchorUsed: 'indicatorId',
        indicatorId: candidate.indicatorId,
        idempotencyKey: null,
        substanceName: candidate.substanceName,
        changedFields: [],
        fieldChanges: [],
        errors: [],
      };
      lines.push(line);
      plan.push({
        line,
        payload: null,
        existing: byId.get(candidate.indicatorId) ?? null,
      });
    });

    return {
      fileName: params.fileName,
      normativeVersion,
      totals: this.buildTotals(lines),
      lines,
      deprecatedCandidates,
      plan,
    };
  }

  private classifyRow(
    parsed: ParsedPreviewRow,
    ctx: {
      byId: Map<string, ExistingIndicator>;
      byKey: Map<string, ExistingIndicator>;
      seenIds: Map<string, number>;
      seenKeys: Map<string, number>;
      matchedExistingIds: Set<string>;
    },
  ): ClassifiedRow {
    const base: PreviewLine = {
      rowNumber: parsed.rowNumber,
      classification: Classification.NEW,
      anchorUsed: 'none',
      indicatorId: parsed.indicatorId,
      idempotencyKey: parsed.idempotencyKey,
      substanceName: parsed.substanceName,
      changedFields: [],
      fieldChanges: [],
      errors: parsed.errors,
    };

    if (parsed.errors.length || !parsed.payload) {
      return {
        line: { ...base, classification: Classification.INVALID },
        payload: null,
        existing: null,
      };
    }

    // Duplicate anchors within the sheet => CONFLICT
    if (parsed.indicatorId && (ctx.seenIds.get(parsed.indicatorId) ?? 0) > 1) {
      return {
        line: {
          ...base,
          classification: Classification.CONFLICT,
          errors: [
            { field: 'indicatorId', message: 'indicatorId duplicado na planilha.' },
          ],
        },
        payload: null,
        existing: null,
      };
    }
    if (
      parsed.idempotencyKey &&
      (ctx.seenKeys.get(parsed.idempotencyKey) ?? 0) > 1
    ) {
      return {
        line: {
          ...base,
          classification: Classification.CONFLICT,
          errors: [
            {
              field: 'idempotencyKey',
              message: 'idempotencyKey duplicado na planilha.',
            },
          ],
        },
        payload: null,
        existing: null,
      };
    }

    // Anchor by indicatorId
    if (parsed.indicatorId) {
      const existing = ctx.byId.get(parsed.indicatorId);
      if (!existing) {
        return {
          line: {
            ...base,
            classification: Classification.CONFLICT,
            anchorUsed: 'indicatorId',
            errors: [
              {
                field: 'indicatorId',
                message: 'indicatorId não encontrado na base atual.',
              },
            ],
          },
          payload: null,
          existing: null,
        };
      }
      ctx.matchedExistingIds.add(existing.id);
      return {
        line: this.diffAgainstExisting(
          base,
          parsed.payload,
          existing,
          'indicatorId',
        ),
        payload: parsed.payload,
        existing,
      };
    }

    // Anchor by idempotencyKey
    if (parsed.idempotencyKey) {
      const existing = ctx.byKey.get(parsed.idempotencyKey);
      if (existing) {
        ctx.matchedExistingIds.add(existing.id);
        return {
          line: this.diffAgainstExisting(
            base,
            parsed.payload,
            existing,
            'idempotencyKey',
          ),
          payload: parsed.payload,
          existing,
        };
      }
    }

    // No anchor supplied — try implicit match by recomputed idempotencyKey
    const implicit = ctx.byKey.get(parsed.payload.idempotencyKey);
    if (implicit) {
      ctx.matchedExistingIds.add(implicit.id);
      return {
        line: this.diffAgainstExisting(
          base,
          parsed.payload,
          implicit,
          'idempotencyKey',
        ),
        payload: parsed.payload,
        existing: implicit,
      };
    }

    return {
      line: { ...base, classification: Classification.NEW, anchorUsed: 'none' },
      payload: parsed.payload,
      existing: null,
    };
  }

  private diffAgainstExisting(
    base: PreviewLine,
    payload: IndicatorNormativePayload,
    existing: ExistingIndicator,
    anchorUsed: PreviewAnchor,
  ): PreviewLine {
    const normalizedExisting = toIndicatorNormativePayload(existing);
    const incoming = toIndicatorNormativePayload(payload);
    const changed = getNormativePayloadDiffFields(
      normalizedExisting,
      payload,
    ).filter((field) => !DIFF_IGNORED_FIELDS.has(field));

    const fieldChanges: PreviewFieldChange[] = changed.map((field) => ({
      field: String(field),
      from: this.formatFieldValue(normalizedExisting[field]),
      to: this.formatFieldValue(incoming[field]),
    }));

    return {
      ...base,
      anchorUsed,
      indicatorId: existing.id,
      changedFields: changed.map(String),
      fieldChanges,
      classification: changed.length
        ? Classification.UPDATED
        : Classification.UNCHANGED,
    };
  }

  private formatFieldValue(value: unknown): string {
    if (value === null || value === undefined) return '∅';
    if (Array.isArray(value)) return value.join('; ') || '∅';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  private async loadExisting(
    normativeVersion: string,
  ): Promise<ExistingIndicator[]> {
    return this.prisma.occupationalBiologicalIndicator.findMany({
      where: {
        deleted_at: null,
        normativeSource: BiologicalNormativeSourceEnum.NR_07,
        normativeVersion,
      },
      select: existingSelect,
    });
  }

  private readRows(buffer: Buffer): SpreadsheetIndicatorRow[] {
    let workbook: XLSX.WorkBook;
    try {
      workbook = XLSX.read(buffer, { type: 'buffer' });
    } catch {
      throw new BadRequestException('Arquivo inválido. Envie um .xlsx válido.');
    }

    const sheet = workbook.Sheets[SHEETS.DATA];
    if (!sheet) {
      throw new BadRequestException(
        `Aba "${SHEETS.DATA}" não encontrada na planilha.`,
      );
    }

    return XLSX.utils.sheet_to_json<SpreadsheetIndicatorRow>(sheet, {
      defval: null,
      raw: false,
    });
  }

  private countOccurrences(values: string[]): Map<string, number> {
    const map = new Map<string, number>();
    values.forEach((value) => map.set(value, (map.get(value) ?? 0) + 1));
    return map;
  }

  private buildTotals(lines: PreviewLine[]): ImportPreviewResult['totals'] {
    const sheetLines = lines.filter((l) => l.rowNumber !== -1);
    const count = (c: Classification) =>
      lines.filter((l) => l.classification === c).length;

    return {
      read: sheetLines.length,
      valid: sheetLines.filter(
        (l) => l.classification !== Classification.INVALID,
      ).length,
      invalid: count(Classification.INVALID),
      new: count(Classification.NEW),
      updated: count(Classification.UPDATED),
      unchanged: count(Classification.UNCHANGED),
      deprecatedCandidate: count(Classification.DEPRECATED_CANDIDATE),
      conflict: count(Classification.CONFLICT),
    };
  }
}
