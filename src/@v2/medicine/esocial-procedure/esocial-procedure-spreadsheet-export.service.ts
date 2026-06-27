import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

import {
  ESOCIAL_PROCEDURE_COLUMN_ORDER,
  ESOCIAL_PROCEDURE_COLUMN_WIDTHS,
  ESOCIAL_PROCEDURE_REFERENCE_VALUES,
  ESOCIAL_PROCEDURE_SHEET_NAMES as SHEETS,
} from './esocial-procedure-spreadsheet.constants';
import { EsocialProcedureRepository } from './esocial-procedure.repository';

@Injectable()
export class EsocialProcedureSpreadsheetExportService {
  constructor(private readonly repository: EsocialProcedureRepository) {}

  /** Exporta todos os procedimentos oficiais da Tabela 27 + curadoria atual. */
  async exportCurrentBase(): Promise<Buffer> {
    const [catalog, curations] = await Promise.all([
      this.repository.getOfficialCatalog(),
      this.repository.findManyCurations(),
    ]);

    const curationByCode = new Map(
      curations.map((curation) => [curation.procedureCode, curation]),
    );
    const catalogCodes = new Set(catalog.map((item) => item.code));

    const workbook = this.createWorkbook();
    const dataSheet = workbook.addWorksheet(SHEETS.DATA);
    this.setupDataSheetColumns(dataSheet);

    catalog.forEach((item) => {
      const curation = curationByCode.get(item.code) ?? null;
      dataSheet.addRow({
        procedureCode: item.code,
        procedureNameSnapshot: item.name,
        isOccupationalRelevant: curation
          ? String(curation.isOccupationalRelevant)
          : '',
        technicalType: curation?.technicalType ?? '',
        status: curation?.status ?? '',
        internalNotes: curation?.internalNotes ?? '',
      });
    });

    // Curadorias órfãs: código curado que não está mais no catálogo oficial.
    // Exportadas para visibilidade; não há código oficial correspondente.
    curations
      .filter((curation) => !catalogCodes.has(curation.procedureCode))
      .forEach((curation) => {
        dataSheet.addRow({
          procedureCode: curation.procedureCode,
          procedureNameSnapshot: curation.procedureNameSnapshot ?? '',
          isOccupationalRelevant: String(curation.isOccupationalRelevant),
          technicalType: curation.technicalType ?? '',
          status: curation.status,
          internalNotes: curation.internalNotes ?? '',
        });
      });

    this.addInstructionsSheet(workbook);
    this.addReferencesSheet(workbook);

    return this.toBuffer(workbook);
  }

  /** Modelo vazio com cabeçalhos + abas de instruções/referências. */
  async buildTemplate(): Promise<Buffer> {
    const workbook = this.createWorkbook();
    const dataSheet = workbook.addWorksheet(SHEETS.DATA);
    this.setupDataSheetColumns(dataSheet);
    this.addInstructionsSheet(workbook);
    this.addReferencesSheet(workbook);
    return this.toBuffer(workbook);
  }

  private createWorkbook(): ExcelJS.Workbook {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'SimpleSST';
    workbook.created = new Date();
    return workbook;
  }

  private setupDataSheetColumns(sheet: ExcelJS.Worksheet) {
    sheet.columns = ESOCIAL_PROCEDURE_COLUMN_ORDER.map((key) => ({
      header: key,
      key,
      width: ESOCIAL_PROCEDURE_COLUMN_WIDTHS[key],
    }));

    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { vertical: 'middle' };
    sheet.views = [{ state: 'frozen', ySplit: 1 }];
  }

  private addInstructionsSheet(workbook: ExcelJS.Workbook) {
    const sheet = workbook.addWorksheet(SHEETS.INSTRUCTIONS);
    sheet.columns = [
      { header: 'Tópico', key: 'topic', width: 32 },
      { header: 'Descrição', key: 'description', width: 100 },
    ];
    sheet.getRow(1).font = { bold: true };

    const rows: Array<[string, string]> = [
      ['Objetivo', 'Curadoria SimpleSST sobre os procedimentos da Tabela 27 do eSocial. A importação trabalha SOMENTE com a camada de curadoria (PcmsoEsocialProcedure).'],
      ['Tabela 27 oficial', 'Os campos procedureCode e procedureNameSnapshot são apenas REFERÊNCIA/validação. A importação NUNCA altera a Tabela 27 oficial, eventos eSocial, XML, S-2220/S-2240, Exam ou ExamToRisk.'],
      ['Coluna-chave', 'procedureCode é a chave. Deve existir no catálogo oficial da Tabela 27, senão a linha é REJEITADA.'],
      ['Campos editáveis', 'isOccupationalRelevant; technicalType; status; internalNotes. Apenas estes são gravados na curadoria.'],
      ['isOccupationalRelevant', 'Aceita true/false, sim/não, 1/0. Vazio = false.'],
      ['technicalType', `Um de: ${ESOCIAL_PROCEDURE_REFERENCE_VALUES.technicalType.join(', ')}. Vazio = não classificado.`],
      ['status', `Um de: ${ESOCIAL_PROCEDURE_REFERENCE_VALUES.status.join(', ')}. Vazio = DRAFT.`],
      ['Prévia (dry-run)', 'A importação roda primeiro em PRÉVIA: valida, classifica (criar/atualizar/sem alteração/rejeitada/conflito) e NÃO grava nada.'],
      ['Aplicar', 'A gravação só acontece após confirmação explícita do MASTER. Faz upsert em PcmsoEsocialProcedure por procedureCode.'],
      ['Duplicados', 'procedureCode repetido na planilha gera CONFLITO e não é aplicado.'],
    ];
    rows.forEach((row) => sheet.addRow({ topic: row[0], description: row[1] }));
    sheet.getColumn('description').alignment = { wrapText: true, vertical: 'top' };
  }

  private addReferencesSheet(workbook: ExcelJS.Workbook) {
    const sheet = workbook.addWorksheet(SHEETS.REFERENCES);
    sheet.columns = [
      { header: 'Campo', key: 'field', width: 24 },
      { header: 'Valores válidos', key: 'values', width: 80 },
    ];
    sheet.getRow(1).font = { bold: true };

    Object.entries(ESOCIAL_PROCEDURE_REFERENCE_VALUES).forEach(
      ([field, values]) => {
        sheet.addRow({ field, values: values.join(', ') });
      },
    );
    sheet.getColumn('values').alignment = { wrapText: true, vertical: 'top' };
  }

  private async toBuffer(workbook: ExcelJS.Workbook): Promise<Buffer> {
    const result = await workbook.xlsx.writeBuffer();
    return Buffer.from(result as ArrayBuffer);
  }
}
