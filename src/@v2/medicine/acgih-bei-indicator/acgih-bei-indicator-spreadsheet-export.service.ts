import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

import {
  ACGIH_BEI_COLUMN_ORDER,
  ACGIH_BEI_COLUMN_WIDTHS,
  ACGIH_BEI_REFERENCE_VALUES,
  ACGIH_BEI_SHEET_NAMES as SHEETS,
} from './acgih-bei-indicator-spreadsheet.constants';
import { AcgihBeiIndicatorRepository } from './acgih-bei-indicator.repository';

@Injectable()
export class AcgihBeiIndicatorSpreadsheetExportService {
  constructor(private readonly repository: AcgihBeiIndicatorRepository) {}

  /** Exporta toda a base ACGIH/BEI atual (não soft-deleted). */
  async exportCurrentBase(): Promise<Buffer> {
    const indicators = await this.repository.findAllForExport();

    const workbook = this.createWorkbook();
    const dataSheet = workbook.addWorksheet(SHEETS.DATA);
    this.setupDataSheetColumns(dataSheet);

    indicators.forEach((item) => {
      dataSheet.addRow({
        id: item.id,
        substanceName: item.substanceName,
        cas: item.cas ?? '',
        referenceYear: item.referenceYear ?? '',
        determinant: item.determinant ?? '',
        biologicalMatrix: item.biologicalMatrix ?? '',
        samplingTime: item.samplingTime ?? '',
        beiValue: item.beiValue ?? '',
        unit: item.unit ?? '',
        notation: item.notation ?? '',
        status: item.status,
        source: item.source,
        sourceYear: item.sourceYear ?? '',
        isCurated: String(item.isCurated),
        internalNotes: item.internalNotes ?? '',
        sourcePage: item.sourcePage ?? '',
        confidence: item.confidence ?? '',
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
    sheet.columns = ACGIH_BEI_COLUMN_ORDER.map((key) => ({
      header: key,
      key,
      width: ACGIH_BEI_COLUMN_WIDTHS[key],
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
      ['Objetivo', 'Base técnica de referência ACGIH/BEI (indicadores biológicos). Camada interna, aditiva e isolada — NÃO altera NR-7, Tabela 27/eSocial, XML, S-2220/S-2240, ExamToRisk, empresas nem a biblioteca Regras Exame × Risco.'],
      ['Âncora de identidade', 'A coluna id (read-only) é a âncora quando presente. Quando id estiver vazio, o sistema usa uma chave natural: substanceName | cas | determinant | biologicalMatrix | samplingTime (normalizados).'],
      ['Não preencher id manualmente', 'Para criar um indicador novo, deixe id em branco. Para atualizar um existente, mantenha o id exportado.'],
      ['substanceName', 'Obrigatório quando a linha tem qualquer dado. Linha totalmente vazia é ignorada (sem alteração).'],
      ['beiValue', 'Texto livre: pode conter símbolos, faixas, percentuais e unidades compostas.'],
      ['status', `Um de: ${ACGIH_BEI_REFERENCE_VALUES.status.join(', ')}. Vazio = DRAFT.`],
      ['source', `Um de: ${ACGIH_BEI_REFERENCE_VALUES.source.join(', ')}. Vazio = ACGIH_BEI.`],
      ['confidence', 'HIGH/MEDIUM/LOW. Aceita também Alta/Média/Baixa. Vazio = não informado.'],
      ['biologicalMatrix / notation', 'Texto livre. Não há lista fixa obrigatória.'],
      ['isCurated', 'true/false. Vazio = false.'],
      ['Prévia (dry-run)', 'A importação roda primeiro em PRÉVIA: valida, classifica (criar/atualizar/sem alteração/rejeitada/conflito/inválida) e NÃO grava nada.'],
      ['Aplicar', 'A gravação só acontece após confirmação explícita do MASTER (frase: APLICAR CURADORIA ACGIH BEI). Faz upsert idempotente.'],
      ['Duplicados', 'Mesma chave natural (ou mesmo id) repetida na planilha gera CONFLITO e não é aplicada.'],
      ['Sem aplicação automática', 'Esta base NÃO é aplicada automaticamente em empresas, exames, vínculos ou na biblioteca Regras Exame × Risco.'],
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

    Object.entries(ACGIH_BEI_REFERENCE_VALUES).forEach(([field, values]) => {
      sheet.addRow({ field, values: values.join(', ') });
    });
    sheet.getColumn('values').alignment = { wrapText: true, vertical: 'top' };
  }

  private async toBuffer(workbook: ExcelJS.Workbook): Promise<Buffer> {
    const result = await workbook.xlsx.writeBuffer();
    return Buffer.from(result as ArrayBuffer);
  }
}
