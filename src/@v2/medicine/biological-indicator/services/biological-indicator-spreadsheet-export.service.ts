import { Injectable } from '@nestjs/common';
import {
  BiologicalNormativeSourceEnum,
  Prisma,
} from '@prisma/client';
import * as ExcelJS from 'exceljs';

import { PrismaService } from '@/prisma/prisma.service';

import {
  BIOLOGICAL_INDICATOR_COLUMN_ORDER,
  BIOLOGICAL_INDICATOR_COLUMNS as COL,
  BIOLOGICAL_INDICATOR_REFERENCE_VALUES,
  BIOLOGICAL_INDICATOR_SHEET_NAMES as SHEETS,
  BiologicalIndicatorColumnKey,
  TABLE_ENUM_TO_LABEL,
  TYPE_ENUM_TO_LABEL,
} from '../biological-indicator-spreadsheet.constants';

const exportSelect = {
  id: true,
  idempotencyKey: true,
  normativeSource: true,
  normativeVersion: true,
  annex: true,
  status: true,
  substanceName: true,
  casNumbers: true,
  isSubstanceGroup: true,
  tableNumber: true,
  indicatorType: true,
  biologicalIndicatorOriginal: true,
  biologicalIndicatorNormalized: true,
  biologicalMatrix: true,
  collectionMoment: true,
  referenceValueRaw: true,
  referenceValue: true,
  unit: true,
  technicalObservationsRaw: true,
  generalApplicabilityNotes: true,
  defaultValidityMonths: true,
  collectionToleranceDays: true,
  requiresNormativeReview: true,
  reviewNotes: true,
  reviewedAt: true,
  substanceGroup: { select: { groupType: true } },
  reviewedBy: { select: { name: true, email: true } },
  riskLinks: {
    where: { deleted_at: null },
    select: { isConfirmed: true, isPrimary: true, riskNameSnapshot: true },
  },
  examLinks: {
    where: { deleted_at: null },
    select: {
      isConfirmed: true,
      isDefault: true,
      examNameSnapshot: true,
    },
  },
} satisfies Prisma.OccupationalBiologicalIndicatorSelect;

type ExportRow = Prisma.OccupationalBiologicalIndicatorGetPayload<{
  select: typeof exportSelect;
}>;

@Injectable()
export class BiologicalIndicatorSpreadsheetExportService {
  constructor(private readonly prisma: PrismaService) {}

  async exportCurrentBase(): Promise<Buffer> {
    const indicators = await this.prisma.occupationalBiologicalIndicator.findMany({
      where: {
        deleted_at: null,
        normativeSource: BiologicalNormativeSourceEnum.NR_07,
      },
      orderBy: [
        { substanceName: 'asc' },
        { biologicalIndicatorNormalized: 'asc' },
      ],
      select: exportSelect,
    });

    const workbook = this.createWorkbook();
    const dataSheet = workbook.addWorksheet(SHEETS.DATA);
    this.setupDataSheetColumns(dataSheet);

    indicators.forEach((indicator) => {
      dataSheet.addRow(this.toRowValues(indicator));
    });

    this.addInstructionsSheet(workbook);
    this.addReferencesSheet(workbook);

    return this.toBuffer(workbook);
  }

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
    sheet.columns = BIOLOGICAL_INDICATOR_COLUMN_ORDER.map((key) => ({
      header: COL[key],
      key,
      width: this.columnWidth(key),
    }));

    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { vertical: 'middle' };
    sheet.views = [{ state: 'frozen', ySplit: 1 }];
  }

  private columnWidth(key: BiologicalIndicatorColumnKey): number {
    if (key === 'indicatorId' || key === 'idempotencyKey') return 30;
    if (
      key === 'substanceName' ||
      key === 'biologicalIndicatorOriginal' ||
      key === 'biologicalIndicatorNormalized' ||
      key === 'generalApplicabilityNotes' ||
      key === 'reviewNotes' ||
      key === 'linkedRisks' ||
      key === 'linkedExams' ||
      key === 'confirmedRisks' ||
      key === 'confirmedExams'
    ) {
      return 36;
    }
    return 18;
  }

  private toRowValues(indicator: ExportRow): Record<string, unknown> {
    const confirmedRisks = indicator.riskLinks.filter((l) => l.isConfirmed);
    const confirmedExams = indicator.examLinks.filter((l) => l.isConfirmed);
    const primaryRisk = indicator.riskLinks.find((l) => l.isPrimary);
    const defaultExam = indicator.examLinks.find((l) => l.isDefault);

    return {
      indicatorId: indicator.id,
      idempotencyKey: indicator.idempotencyKey,
      normativeSource: indicator.normativeSource,
      normativeVersion: indicator.normativeVersion,
      annex: indicator.annex,
      statusAtual: indicator.status,
      substanceName: indicator.substanceName,
      cas: indicator.casNumbers.join('; '),
      isSubstanceGroup: String(indicator.isSubstanceGroup),
      substanceGroupType: indicator.substanceGroup?.groupType ?? '',
      tableNumber: TABLE_ENUM_TO_LABEL[indicator.tableNumber],
      indicatorType: TYPE_ENUM_TO_LABEL[indicator.indicatorType],
      biologicalIndicatorOriginal: indicator.biologicalIndicatorOriginal,
      biologicalIndicatorNormalized: indicator.biologicalIndicatorNormalized,
      biologicalMatrix: indicator.biologicalMatrix,
      collectionMoment: indicator.collectionMoment,
      referenceValue: indicator.referenceValueRaw ?? indicator.referenceValue ?? '',
      unit: indicator.unit ?? '',
      technicalObservations: indicator.technicalObservationsRaw ?? '',
      generalApplicabilityNotes: indicator.generalApplicabilityNotes ?? '',
      technicalNotes: '',
      defaultValidityMonths: indicator.defaultValidityMonths,
      collectionToleranceDays: indicator.collectionToleranceDays,
      requiresNormativeReview: String(indicator.requiresNormativeReview),
      linkedRisks: indicator.riskLinks.map((l) => l.riskNameSnapshot).join(' | '),
      confirmedRisks: confirmedRisks.map((l) => l.riskNameSnapshot).join(' | '),
      primaryRisk: primaryRisk?.riskNameSnapshot ?? '',
      linkedExams: indicator.examLinks.map((l) => l.examNameSnapshot).join(' | '),
      confirmedExams: confirmedExams.map((l) => l.examNameSnapshot).join(' | '),
      defaultExam: defaultExam?.examNameSnapshot ?? '',
      reviewNotes: indicator.reviewNotes ?? '',
      reviewedAt: indicator.reviewedAt ? indicator.reviewedAt.toISOString() : '',
      reviewedBy: indicator.reviewedBy?.name ?? indicator.reviewedBy?.email ?? '',
    };
  }

  private addInstructionsSheet(workbook: ExcelJS.Workbook) {
    const sheet = workbook.addWorksheet(SHEETS.INSTRUCTIONS);
    sheet.columns = [
      { header: 'Tópico', key: 'topic', width: 32 },
      { header: 'Descrição', key: 'description', width: 90 },
    ];
    sheet.getRow(1).font = { bold: true };

    const rows: Array<[string, string]> = [
      ['Objetivo', 'Esta planilha permite revisar a base normativa NR-07 Anexo I. A importação roda apenas em PRÉVIA (dry-run) e NÃO grava alterações no banco.'],
      ['Campos obrigatórios', 'Substância; Quadro; Tipo indicador; Indicador biológico (original); Material biológico / matriz; Momento da coleta.'],
      ['Campos opcionais', 'CAS; Valor; Unidade; Observações NR-07; Regra geral / aplicabilidade; Notas técnicas; defaultValidityMonths; collectionToleranceDays; requiresNormativeReview.'],
      ['Campos informativos', 'indicatorId; idempotencyKey; statusAtual; risco(s)/exame(s) vinculados/confirmados; reviewNotes; reviewedAt; reviewedBy. Usados apenas como referência — não atualizam a base nesta fase.'],
      ['Âncora de comparação', 'O sistema usa indicatorId como âncora principal. Se vazio, usa idempotencyKey. Se nenhum casar, a linha é classificada como NEW.'],
      ['Editar linha existente', 'Mantenha o indicatorId original e altere os demais campos normativos. A prévia mostrará os campos alterados (UPDATED).'],
      ['Cadastrar nova linha', 'Deixe indicatorId e idempotencyKey em branco e preencha os campos obrigatórios. Será classificada como NEW.'],
      ['Múltiplos CAS', 'Separe múltiplos números CAS por ponto e vírgula. Ex.: 109-86-4; 109-49-6.'],
      ['Quadro 2 / IBE/SC', 'Indicadores de Quadro 2 ou IBE/SC exigem revisão normativa/médica (requiresNormativeReview = true).'],
      ['Importante', 'A PRÉVIA não grava nada. Nenhuma alteração é aplicada em ExamToRisk, ExamToRiskData ou no PCMSO.'],
    ];
    rows.forEach((row) => sheet.addRow({ topic: row[0], description: row[1] }));
    sheet.getColumn('description').alignment = { wrapText: true, vertical: 'top' };
  }

  private addReferencesSheet(workbook: ExcelJS.Workbook) {
    const sheet = workbook.addWorksheet(SHEETS.REFERENCES);
    sheet.columns = [
      { header: 'Campo', key: 'field', width: 24 },
      { header: 'Valores válidos', key: 'values', width: 70 },
    ];
    sheet.getRow(1).font = { bold: true };

    Object.entries(BIOLOGICAL_INDICATOR_REFERENCE_VALUES).forEach(
      ([field, values]) => {
        sheet.addRow({ field, values: (values as readonly string[]).join(', ') });
      },
    );
    sheet.getColumn('values').alignment = { wrapText: true, vertical: 'top' };
  }

  private async toBuffer(workbook: ExcelJS.Workbook): Promise<Buffer> {
    const result = await workbook.xlsx.writeBuffer();
    return Buffer.from(result as ArrayBuffer);
  }
}
