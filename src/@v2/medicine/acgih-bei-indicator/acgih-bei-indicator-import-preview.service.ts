import { BadRequestException, Injectable } from '@nestjs/common';
import { PcmsoAcgihBeiIndicator } from '@prisma/client';
import * as XLSX from 'xlsx';

import {
  AcgihBeiFieldChange,
  AcgihBeiImportClassification as Classification,
  AcgihBeiPayload,
  AcgihBeiRowError,
  describeAcgihBeiPayload,
  diffAcgihBeiPayload,
  ExistingAcgihBeiSnapshot,
  normalizeText,
  parseAcgihBeiRow,
  RawSpreadsheetRow,
} from './acgih-bei-indicator-import.util';
import { ACGIH_BEI_SHEET_NAMES as SHEETS } from './acgih-bei-indicator-spreadsheet.constants';
import { AcgihBeiIndicatorRepository } from './acgih-bei-indicator.repository';

export type AcgihBeiPreviewLine = {
  rowNumber: number;
  classification: Classification;
  id: string;
  substanceName: string;
  determinant: string | null;
  restored: boolean;
  changedFields: string[];
  fieldChanges: AcgihBeiFieldChange[];
  warnings: string[];
  errors: AcgihBeiRowError[];
};

export type AcgihBeiImportTotals = {
  read: number;
  valid: number;
  create: number;
  update: number;
  unchanged: number;
  rejected: number;
  conflict: number;
  invalid: number;
};

export type AcgihBeiImportPreviewResult = {
  fileName: string;
  totals: AcgihBeiImportTotals;
  lines: AcgihBeiPreviewLine[];
};

export type AcgihBeiPlanItem = {
  line: AcgihBeiPreviewLine;
  payload: AcgihBeiPayload | null;
  targetId: string | null;
  dedupeKey: string;
  substanceNameNormalized: string;
};

export type AcgihBeiImportModel = {
  fileName: string;
  totals: AcgihBeiImportTotals;
  lines: AcgihBeiPreviewLine[];
  plan: AcgihBeiPlanItem[];
};

const toSnapshot = (record: PcmsoAcgihBeiIndicator): ExistingAcgihBeiSnapshot => ({
  substanceName: record.substanceName,
  cas: record.cas,
  referenceYear: record.referenceYear,
  determinant: record.determinant,
  biologicalMatrix: record.biologicalMatrix,
  samplingTime: record.samplingTime,
  beiValue: record.beiValue,
  unit: record.unit,
  notation: record.notation,
  status: record.status,
  source: record.source,
  sourceYear: record.sourceYear,
  isCurated: record.isCurated,
  internalNotes: record.internalNotes,
  sourcePage: record.sourcePage,
  confidence: record.confidence,
});

@Injectable()
export class AcgihBeiIndicatorImportPreviewService {
  constructor(private readonly repository: AcgihBeiIndicatorRepository) {}

  async preview(params: {
    buffer: Buffer;
    fileName: string;
  }): Promise<AcgihBeiImportPreviewResult> {
    const model = await this.buildModel(params);
    return {
      fileName: model.fileName,
      totals: model.totals,
      lines: model.lines,
    };
  }

  async buildModel(params: {
    buffer: Buffer;
    fileName: string;
  }): Promise<AcgihBeiImportModel> {
    const rawRows = this.readRows(params.buffer);

    const parsedRows = rawRows.map((raw, index) =>
      parseAcgihBeiRow(raw, index + 2),
    );

    // Linhas que efetivamente escrevem (têm payload e não são REJECTED por id).
    const referencedIds = parsedRows
      .filter((p) => p.id)
      .map((p) => p.id);
    const referencedDedupeKeys = parsedRows
      .filter((p) => p.payload)
      .map((p) => p.dedupeKey);

    const [byIdRecords, byDedupeRecords] = await Promise.all([
      this.repository.findByIdsRaw(referencedIds),
      this.repository.findByDedupeKeys(referencedDedupeKeys),
    ]);

    const recordById = new Map(byIdRecords.map((r) => [r.id, r]));
    const recordByDedupe = new Map(byDedupeRecords.map((r) => [r.dedupeKey, r]));

    // Contagens para detectar duplicados na própria planilha.
    const idOccurrences = new Map<string, number>();
    const dedupeOccurrences = new Map<string, number>();
    parsedRows.forEach((p) => {
      if (!p.payload) return;
      if (p.id) idOccurrences.set(p.id, (idOccurrences.get(p.id) ?? 0) + 1);
      dedupeOccurrences.set(
        p.dedupeKey,
        (dedupeOccurrences.get(p.dedupeKey) ?? 0) + 1,
      );
    });

    const plan: AcgihBeiPlanItem[] = parsedRows.map((parsed) => {
      const base: AcgihBeiPreviewLine = {
        rowNumber: parsed.rowNumber,
        classification: Classification.CREATE,
        id: parsed.id,
        substanceName: parsed.payload?.substanceName ?? '',
        determinant: parsed.payload?.determinant ?? null,
        restored: false,
        changedFields: [],
        fieldChanges: [],
        warnings: parsed.readonlyTouched.length
          ? [`Colunas read-only ignoradas: ${parsed.readonlyTouched.join(', ')}.`]
          : [],
        errors: parsed.errors,
      };

      // Linha totalmente vazia → sem alteração, não grava.
      if (!parsed.payload && !parsed.errors.length) {
        return this.reject(base, Classification.UNCHANGED);
      }

      // Erros de formato/obrigatório → INVALID.
      if (parsed.errors.length || !parsed.payload) {
        return this.reject(base, Classification.INVALID);
      }

      const payload = parsed.payload;
      const dedupeKey = parsed.dedupeKey;
      const substanceNameNormalized = normalizeText(payload.substanceName);

      // id duplicado na planilha → CONFLICT.
      if (parsed.id && (idOccurrences.get(parsed.id) ?? 0) > 1) {
        return this.reject(
          { ...base, errors: [{ field: 'id', message: 'id duplicado na planilha.' }] },
          Classification.CONFLICT,
        );
      }

      // chave natural duplicada na planilha → CONFLICT.
      if ((dedupeOccurrences.get(dedupeKey) ?? 0) > 1) {
        return this.reject(
          {
            ...base,
            errors: [
              {
                field: 'dedupeKey',
                message:
                  'Combinação substância/CAS/determinante/matriz/momento duplicada na planilha.',
              },
            ],
          },
          Classification.CONFLICT,
        );
      }

      // âncora explícita por id.
      if (parsed.id) {
        const target = recordById.get(parsed.id);
        if (!target) {
          return this.reject(
            {
              ...base,
              errors: [
                { field: 'id', message: `id "${parsed.id}" não encontrado na base.` },
              ],
            },
            Classification.REJECTED,
          );
        }

        // Atualizar o id muda dedupeKey: se a nova chave já pertence a OUTRO
        // registro ativo, o upsert violaria a unicidade → CONFLICT.
        const dkOwner = recordByDedupe.get(dedupeKey);
        if (dkOwner && dkOwner.id !== target.id && dkOwner.deleted_at === null) {
          return this.reject(
            {
              ...base,
              errors: [
                {
                  field: 'dedupeKey',
                  message:
                    'A chave natural resultante já pertence a outro indicador ativo.',
                },
              ],
            },
            Classification.CONFLICT,
          );
        }

        return this.classifyAgainstTarget(
          base,
          target,
          payload,
          dedupeKey,
          substanceNameNormalized,
          target.id,
        );
      }

      // sem id → âncora pela chave natural.
      const target = recordByDedupe.get(dedupeKey) ?? null;
      if (!target) {
        const createChanges = describeAcgihBeiPayload(payload);
        return {
          line: {
            ...base,
            classification: Classification.CREATE,
            changedFields: createChanges.map((c) => String(c.field)),
            fieldChanges: createChanges,
          },
          payload,
          targetId: null,
          dedupeKey,
          substanceNameNormalized,
        };
      }

      return this.classifyAgainstTarget(
        base,
        target,
        payload,
        dedupeKey,
        substanceNameNormalized,
        null,
      );
    });

    const lines = plan.map((item) => item.line);

    return {
      fileName: params.fileName,
      totals: this.buildTotals(lines),
      lines,
      plan,
    };
  }

  private classifyAgainstTarget(
    base: AcgihBeiPreviewLine,
    target: PcmsoAcgihBeiIndicator,
    payload: AcgihBeiPayload,
    dedupeKey: string,
    substanceNameNormalized: string,
    targetId: string | null,
  ): AcgihBeiPlanItem {
    const changes = diffAcgihBeiPayload(toSnapshot(target), payload);
    const isDeleted = target.deleted_at !== null;
    const classification =
      changes.length || isDeleted
        ? Classification.UPDATE
        : Classification.UNCHANGED;

    return {
      line: {
        ...base,
        classification,
        restored: isDeleted,
        changedFields: changes.map((c) => String(c.field)),
        fieldChanges: changes,
        warnings: isDeleted
          ? [...base.warnings, 'Registro soft-deleted será restaurado.']
          : base.warnings,
      },
      payload,
      targetId: targetId ?? target.id,
      dedupeKey,
      substanceNameNormalized,
    };
  }

  private reject(
    base: AcgihBeiPreviewLine,
    classification: Classification,
  ): AcgihBeiPlanItem {
    return {
      line: { ...base, classification },
      payload: null,
      targetId: null,
      dedupeKey: '',
      substanceNameNormalized: '',
    };
  }

  private readRows(buffer: Buffer): RawSpreadsheetRow[] {
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

    return XLSX.utils.sheet_to_json<RawSpreadsheetRow>(sheet, {
      defval: null,
      raw: false,
    });
  }

  private buildTotals(lines: AcgihBeiPreviewLine[]): AcgihBeiImportTotals {
    const count = (c: Classification) =>
      lines.filter((l) => l.classification === c).length;

    const create = count(Classification.CREATE);
    const update = count(Classification.UPDATE);
    const unchanged = count(Classification.UNCHANGED);
    const rejected = count(Classification.REJECTED);
    const conflict = count(Classification.CONFLICT);
    const invalid = count(Classification.INVALID);

    return {
      read: lines.length,
      valid: create + update + unchanged,
      create,
      update,
      unchanged,
      rejected,
      conflict,
      invalid,
    };
  }
}
