import { BadRequestException, Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';

import {
  CurationFieldChange,
  describeCurationPayload,
  diffCurationPayload,
  EsocialProcedureCurationPayload,
  EsocialProcedureImportClassification as Classification,
  EsocialProcedureRowError,
  isRawCurationEmpty,
  parseCurationRow,
  RawSpreadsheetRow,
} from './esocial-procedure-import.util';
import { ESOCIAL_PROCEDURE_SHEET_NAMES as SHEETS } from './esocial-procedure-spreadsheet.constants';
import { EsocialProcedureRepository } from './esocial-procedure.repository';

export type EsocialProcedurePreviewLine = {
  rowNumber: number;
  classification: Classification;
  procedureCode: string;
  procedureNameSnapshot: string | null;
  changedFields: string[];
  fieldChanges: CurationFieldChange[];
  errors: EsocialProcedureRowError[];
};

export type EsocialProcedureImportTotals = {
  read: number;
  valid: number;
  create: number;
  update: number;
  unchanged: number;
  rejected: number;
  conflict: number;
  invalid: number;
};

export type EsocialProcedureImportPreviewResult = {
  fileName: string;
  totals: EsocialProcedureImportTotals;
  lines: EsocialProcedurePreviewLine[];
};

/** Item do plano de aplicação (reusado pelo apply para não duplicar regras). */
export type EsocialProcedurePlanItem = {
  line: EsocialProcedurePreviewLine;
  payload: EsocialProcedureCurationPayload | null;
  existingId: string | null;
};

export type EsocialProcedureImportModel = {
  fileName: string;
  totals: EsocialProcedureImportTotals;
  lines: EsocialProcedurePreviewLine[];
  plan: EsocialProcedurePlanItem[];
};

@Injectable()
export class EsocialProcedureImportPreviewService {
  constructor(private readonly repository: EsocialProcedureRepository) {}

  async preview(params: {
    buffer: Buffer;
    fileName: string;
  }): Promise<EsocialProcedureImportPreviewResult> {
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
  }): Promise<EsocialProcedureImportModel> {
    const rawRows = this.readRows(params.buffer);

    const [catalog, curations] = await Promise.all([
      this.repository.getOfficialCatalog(),
      this.repository.findManyCurations(),
    ]);

    const officialNameByCode = new Map(
      catalog.map((item) => [item.code, item.name]),
    );
    const curationByCode = new Map(
      curations.map((curation) => [curation.procedureCode, curation]),
    );

    // Conta ocorrências de cada procedureCode na planilha para detectar duplicados.
    const codeOccurrences = new Map<string, number>();
    const parsedRows = rawRows.map((raw, index) => {
      const parsed = parseCurationRow(raw, index + 2);
      if (parsed.procedureCode) {
        codeOccurrences.set(
          parsed.procedureCode,
          (codeOccurrences.get(parsed.procedureCode) ?? 0) + 1,
        );
      }
      return parsed;
    });

    const plan: EsocialProcedurePlanItem[] = parsedRows.map((parsed, index) => {
      const raw = rawRows[index];
      const base: EsocialProcedurePreviewLine = {
        rowNumber: parsed.rowNumber,
        classification: Classification.CREATE,
        procedureCode: parsed.procedureCode,
        procedureNameSnapshot:
          officialNameByCode.get(parsed.procedureCode) ?? null,
        changedFields: [],
        fieldChanges: [],
        errors: parsed.errors,
      };

      // Erros de formato/enum/obrigatório → INVALID.
      if (parsed.errors.length || !parsed.payload) {
        return {
          line: { ...base, classification: Classification.INVALID },
          payload: null,
          existingId: null,
        };
      }

      // Código duplicado na planilha → CONFLICT (não aplica).
      if ((codeOccurrences.get(parsed.procedureCode) ?? 0) > 1) {
        return {
          line: {
            ...base,
            classification: Classification.CONFLICT,
            errors: [
              {
                field: 'procedureCode',
                message: 'procedureCode duplicado na planilha.',
              },
            ],
          },
          payload: null,
          existingId: null,
        };
      }

      // Código não existe no catálogo oficial da Tabela 27 → REJECTED.
      if (!officialNameByCode.has(parsed.procedureCode)) {
        return {
          line: {
            ...base,
            classification: Classification.REJECTED,
            errors: [
              {
                field: 'procedureCode',
                message: `procedureCode "${parsed.procedureCode}" não existe na Tabela 27 oficial.`,
              },
            ],
          },
          payload: null,
          existingId: null,
        };
      }

      const existing = curationByCode.get(parsed.procedureCode);
      if (existing) {
        const changes = diffCurationPayload(
          {
            isOccupationalRelevant: existing.isOccupationalRelevant,
            technicalType: existing.technicalType,
            status: existing.status,
            internalNotes: existing.internalNotes,
          },
          parsed.payload,
        );
        return {
          line: {
            ...base,
            classification: changes.length
              ? Classification.UPDATE
              : Classification.UNCHANGED,
            changedFields: changes.map((c) => String(c.field)),
            fieldChanges: changes,
          },
          payload: parsed.payload,
          existingId: existing.id,
        };
      }

      // Sem curadoria no banco e planilha sem campos preenchidos → não criar registro.
      if (isRawCurationEmpty(raw)) {
        return {
          line: { ...base, classification: Classification.UNCHANGED },
          payload: null,
          existingId: null,
        };
      }

      const createChanges = describeCurationPayload(parsed.payload);
      return {
        line: {
          ...base,
          classification: Classification.CREATE,
          changedFields: createChanges.map((c) => String(c.field)),
          fieldChanges: createChanges,
        },
        payload: parsed.payload,
        existingId: null,
      };
    });

    const lines = plan.map((item) => item.line);

    return {
      fileName: params.fileName,
      totals: this.buildTotals(lines),
      lines,
      plan,
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

  private buildTotals(
    lines: EsocialProcedurePreviewLine[],
  ): EsocialProcedureImportTotals {
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
