import * as fs from 'fs';
import * as path from 'path';

import {
  BiologicalIndicatorStatusEnum,
  PrismaClient,
} from '@prisma/client';
import * as XLSX from 'xlsx';

import {
  NORMATIVE_SUBSTANCE_GROUPS,
} from '../src/@v2/medicine/biological-indicator/biological-indicator-groups.constant';
import {
  parseSpreadsheetIndicatorRow,
  SpreadsheetIndicatorRow,
} from '../src/@v2/medicine/biological-indicator/biological-indicator-spreadsheet.parser';
import { sha256File } from '../src/@v2/medicine/biological-indicator/biological-indicator-normalize.util';

const DEFAULT_SPREADSHEET_PATH =
  '/Users/alex/Library/Mobile Documents/com~apple~CloudDocs/03 Acervo/00 Organizações/00 MTE/00 NR´S/00 PT/07/NR07_Anexo_I_Indicadores_Biologicos.xlsx';

const DEFAULT_NORMATIVE_VERSION = 'NR-07-2022';
const SHEET_NAME = 'Indicadores_NR07_AnexoI';

type CliOptions = {
  dryRun: boolean;
  filePath: string;
  normativeVersion: string;
  importedById?: number;
};

type ImportStats = {
  totalRows: number;
  parsed: number;
  created: number;
  updated: number;
  skipped: number;
  errors: number;
  groupsCreated: number;
  groupsReused: number;
  errorMessages: string[];
};

function parseArgs(argv: string[]): CliOptions {
  const dryRun = argv.includes('--dry-run');
  const fileArg = argv.find((arg) => arg.startsWith('--file='));
  const versionArg = argv.find((arg) => arg.startsWith('--normative-version='));
  const importedByArg = argv.find((arg) => arg.startsWith('--imported-by-id='));

  return {
    dryRun,
    filePath: fileArg?.split('=')[1] ?? DEFAULT_SPREADSHEET_PATH,
    normativeVersion: versionArg?.split('=')[1] ?? DEFAULT_NORMATIVE_VERSION,
    importedById: importedByArg ? Number(importedByArg.split('=')[1]) : undefined,
  };
}

function readSpreadsheetRows(filePath: string): SpreadsheetIndicatorRow[] {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Planilha não encontrada: ${filePath}`);
  }

  const workbook = XLSX.readFile(filePath, { cellDates: false });
  const sheet = workbook.Sheets[SHEET_NAME];

  if (!sheet) {
    throw new Error(`Aba "${SHEET_NAME}" não encontrada na planilha`);
  }

  return XLSX.utils.sheet_to_json<SpreadsheetIndicatorRow>(sheet, {
    defval: null,
    raw: false,
  });
}

async function ensureSubstanceGroups(
  prisma: PrismaClient,
  dryRun: boolean,
): Promise<{ created: number; reused: number; groupIdByName: Map<string, string> }> {
  const groupIdByName = new Map<string, string>();
  let created = 0;
  let reused = 0;

  for (const group of NORMATIVE_SUBSTANCE_GROUPS) {
    if (dryRun) {
      groupIdByName.set(group.name, `dry-run-${group.groupType}`);
      continue;
    }

    const existing = await prisma.biologicalIndicatorSubstanceGroup.findUnique({
      where: {
        groupType_name: {
          groupType: group.groupType,
          name: group.name,
        },
      },
    });

    if (existing) {
      groupIdByName.set(group.name, existing.id);
      reused += 1;
      continue;
    }

    const createdGroup = await prisma.biologicalIndicatorSubstanceGroup.create({
      data: {
        groupType: group.groupType,
        name: group.name,
        status: BiologicalIndicatorStatusEnum.DRAFT,
        matchRules: {
          expandStrategy: 'MANUAL_ONLY',
          requiredReview: true,
        },
      },
    });

    groupIdByName.set(group.name, createdGroup.id);
    created += 1;
  }

  return { created, reused, groupIdByName };
}

async function runImport(options: CliOptions): Promise<{
  stats: ImportStats;
  parsedRows: ReturnType<typeof parseSpreadsheetIndicatorRow>[];
}> {
  const stats: ImportStats = {
    totalRows: 0,
    parsed: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
    groupsCreated: 0,
    groupsReused: 0,
    errorMessages: [],
  };

  const fileBuffer = fs.readFileSync(options.filePath);
  const sourceFileHash = sha256File(fileBuffer);
  const rows = readSpreadsheetRows(options.filePath);
  stats.totalRows = rows.length;

  const parsedRows = rows
    .map((row, index) => {
      try {
        const parsed = parseSpreadsheetIndicatorRow(row, options.normativeVersion);
        stats.parsed += 1;
        return parsed;
      } catch (error) {
        stats.errors += 1;
        const message =
          error instanceof Error
            ? `Linha ${index + 2}: ${error.message}`
            : `Linha ${index + 2}: erro desconhecido`;
        stats.errorMessages.push(message);
        return null;
      }
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  if (options.dryRun) {
    stats.created = parsedRows.length;
    return { stats, parsedRows };
  }

  const prisma = new PrismaClient();

  try {
    const groups = await ensureSubstanceGroups(prisma, false);
    stats.groupsCreated = groups.created;
    stats.groupsReused = groups.reused;

    const batch = await prisma.biologicalIndicatorImportBatch.create({
      data: {
        normativeSource: 'NR_07',
        normativeVersion: options.normativeVersion,
        sourceFileName: path.basename(options.filePath),
        sourceFileHash,
        importedById: options.importedById,
        notes: 'Importação inicial NR-07 Anexo I',
      },
    });

    for (const row of parsedRows) {
      const substanceGroupId = row.groupDefinition
        ? groups.groupIdByName.get(row.groupDefinition.name) ?? null
        : null;

      const data = {
        normativeSource: row.normativeSource,
        annex: row.annex,
        tableNumber: row.tableNumber,
        indicatorType: row.indicatorType,
        normativeVersion: options.normativeVersion,
        substanceName: row.substanceName,
        substanceNameNormalized: row.substanceNameNormalized,
        casPrimary: row.casPrimary,
        casNumbers: row.casNumbers,
        substanceGroupId,
        isSubstanceGroup: row.isSubstanceGroup,
        biologicalIndicatorOriginal: row.biologicalIndicatorOriginal,
        biologicalIndicatorNormalized: row.biologicalIndicatorNormalized,
        biologicalMatrix: row.biologicalMatrix,
        collectionMoment: row.collectionMoment,
        referenceValue: row.referenceValue,
        referenceValueRaw: row.referenceValueRaw,
        unit: row.unit,
        technicalObservations: row.technicalObservations,
        technicalObservationsRaw: row.technicalObservationsRaw,
        defaultValidityMonths: row.defaultValidityMonths,
        collectionToleranceDays: row.collectionToleranceDays,
        occupationalApplicability: row.occupationalApplicability,
        requiresNormativeReview: row.requiresNormativeReview,
        generalApplicabilityNotes: row.generalApplicabilityNotes,
        status: row.status,
        dataOrigin: row.dataOrigin,
        importBatchId: batch.id,
        idempotencyKey: row.idempotencyKey,
      };

      const existing = await prisma.occupationalBiologicalIndicator.findUnique({
        where: { idempotencyKey: row.idempotencyKey },
      });

      if (!existing) {
        await prisma.occupationalBiologicalIndicator.create({ data });
        stats.created += 1;
        continue;
      }

      const hasChanges =
        existing.substanceName !== data.substanceName ||
        existing.referenceValue !== data.referenceValue ||
        existing.unit !== data.unit ||
        existing.collectionToleranceDays !== data.collectionToleranceDays ||
        JSON.stringify(existing.occupationalApplicability) !==
          JSON.stringify(data.occupationalApplicability);

      if (!hasChanges) {
        stats.skipped += 1;
        continue;
      }

      await prisma.occupationalBiologicalIndicator.update({
        where: { id: existing.id },
        data: {
          ...data,
          reviewNotes: `Atualizado por reimportação em ${new Date().toISOString()}`,
        },
      });
      stats.updated += 1;
    }

    await prisma.biologicalIndicatorImportBatch.update({
      where: { id: batch.id },
      data: {
        stats: {
          totalRows: stats.totalRows,
          parsed: stats.parsed,
          created: stats.created,
          updated: stats.updated,
          skipped: stats.skipped,
          errors: stats.errors,
          groupsCreated: stats.groupsCreated,
          groupsReused: stats.groupsReused,
        },
      },
    });

    return { stats, parsedRows };
  } finally {
    await prisma.$disconnect();
  }
}

function printReport(
  options: CliOptions,
  stats: ImportStats,
  parsedRows?: ReturnType<typeof parseSpreadsheetIndicatorRow>[],
) {
  console.log('=== NR-07 Anexo I — Importação de Indicadores Biológicos ===');
  console.log(`Modo: ${options.dryRun ? 'DRY-RUN' : 'IMPORT'}`);
  console.log(`Arquivo: ${options.filePath}`);
  console.log(`Versão normativa: ${options.normativeVersion}`);
  console.log('');
  console.log('Estatísticas:');
  console.log(JSON.stringify(stats, null, 2));

  const samples = parsedRows?.slice(0, 5) ?? [];
  if (samples.length) {
    console.log('\nAmostra (5 registros):');
    samples.forEach((row, index) => {
      console.log(
        JSON.stringify(
          {
            index: index + 1,
            substanceName: row.substanceName,
            tableNumber: row.tableNumber,
            indicatorType: row.indicatorType,
            status: row.status,
            collectionToleranceDays: row.collectionToleranceDays,
            requiresNormativeReview: row.requiresNormativeReview,
            isSubstanceGroup: row.isSubstanceGroup,
            collectionMoment: row.collectionMoment,
            biologicalIndicatorNormalized: row.biologicalIndicatorNormalized,
          },
          null,
          2,
        ),
      );
    });
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const { stats, parsedRows } = await runImport(options);

  printReport(options, stats, parsedRows);

  if (options.dryRun) {
    const allDraft = parsedRows.every((row) => row.status === 'DRAFT');
    const allTolerance45 = parsedRows.every((row) => row.collectionToleranceDays === 45);
    const quadro2Review = parsedRows
      .filter((row) => row.tableNumber === 'QUADRO_2')
      .every((row) => row.requiresNormativeReview);

    console.log(`\nTodos DRAFT: ${allDraft}`);
    console.log(`Todos collectionToleranceDays=45: ${allTolerance45}`);
    console.log(`Quadro 2 com requiresNormativeReview=true: ${quadro2Review}`);
    return;
  }

  const prisma = new PrismaClient();
  try {
    const count = await prisma.occupationalBiologicalIndicator.count();
    const draftCount = await prisma.occupationalBiologicalIndicator.count({
      where: { status: 'DRAFT' },
    });
    const tolerance45Count = await prisma.occupationalBiologicalIndicator.count({
      where: { collectionToleranceDays: 45 },
    });
    const groupCount = await prisma.biologicalIndicatorSubstanceGroup.count();

    console.log('\nPós-importação no banco:');
    console.log(`Total indicadores: ${count}`);
    console.log(`DRAFT: ${draftCount}`);
    console.log(`collectionToleranceDays=45: ${tolerance45Count}`);
    console.log(`Grupos normativos: ${groupCount}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
