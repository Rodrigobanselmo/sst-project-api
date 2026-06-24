import { PrismaClient } from '@prisma/client';

import { BiologicalIndicatorMatchService } from '../src/@v2/medicine/biological-indicator/biological-indicator-match.service';

type CliOptions = {
  dryRun: boolean;
};

function parseArgs(argv: string[]): CliOptions {
  return {
    dryRun: argv.includes('--dry-run'),
  };
}

function printMatchReport(
  report: Awaited<ReturnType<BiologicalIndicatorMatchService['run']>>,
  options: CliOptions,
) {
  console.log('=== NR-07 Anexo I — Match Indicadores Biológicos ===');
  console.log(`Modo: ${options.dryRun ? 'DRY-RUN' : 'PERSIST'}`);
  console.log('');

  console.log('Resumo:');
  console.log(
    JSON.stringify(
      {
        indicatorsAnalyzed: report.indicatorsAnalyzed,
        riskLinksCreated: report.riskLinksCreated,
        riskLinksSkipped: report.riskLinksSkipped,
        examLinksCreated: report.examLinksCreated,
        examLinksSkipped: report.examLinksSkipped,
        riskByConfidence: report.riskByConfidence,
        riskByMethod: report.riskByMethod,
        examByConfidence: report.examByConfidence,
        examByMethod: report.examByMethod,
        noRiskMatchCount: report.noRiskMatch.length,
        noExamMatchCount: report.noExamMatch.length,
        ambiguousRiskMatchesCount: report.ambiguousRiskMatches.length,
        secureCasMatchesCount: report.secureCasMatches.length,
      },
      null,
      2,
    ),
  );

  console.log('\nMatches seguros por CAS (amostra até 10):');
  report.secureCasMatches.slice(0, 10).forEach((entry) => {
    console.log(
      JSON.stringify(
        {
          substance: entry.substanceName,
          cas: entry.casNumbers,
          risk: entry.matches[0]?.riskName,
          confidence: entry.matches[0]?.matchConfidence,
          method: entry.matches[0]?.matchMethod,
        },
        null,
        2,
      ),
    );
  });

  console.log('\nMatches ambíguos (amostra até 10):');
  report.ambiguousRiskMatches.slice(0, 10).forEach((entry) => {
    console.log(
      JSON.stringify(
        {
          substance: entry.substanceName,
          matches: entry.matches.map((match) => ({
            riskName: match.riskName,
            confidence: match.matchConfidence,
            method: match.matchMethod,
          })),
        },
        null,
        2,
      ),
    );
  });

  console.log('\nSem match de risco:');
  report.noRiskMatch.forEach((entry) => {
    console.log(`- ${entry.substanceName}`);
  });

  console.log('\nSem match de exame:');
  report.noExamMatch.forEach((entry) => {
    console.log(
      `- ${entry.substanceName} / ${entry.biologicalIndicatorNormalized}`,
    );
  });

  console.log('\nExemplos indicador → risco:');
  report.sampleRiskMatches.forEach((entry) => {
    console.log(JSON.stringify(entry, null, 2));
  });

  console.log('\nExemplos indicador → exame:');
  report.sampleExamMatches.forEach((entry) => {
    console.log(JSON.stringify(entry, null, 2));
  });
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const prisma = new PrismaClient();
  const service = new BiologicalIndicatorMatchService(prisma);

  try {
    const report = await service.run({ dryRun: options.dryRun });
    printMatchReport(report, options);

    if (!options.dryRun) {
      const [riskCount, examCount, examToRiskCount, examToRiskDataCount] =
        await Promise.all([
          prisma.biologicalIndicatorToRisk.count({ where: { deleted_at: null } }),
          prisma.biologicalIndicatorToExam.count({ where: { deleted_at: null } }),
          prisma.examToRisk.count(),
          prisma.examToRiskData.count(),
        ]);

      console.log('\nPós-match no banco:');
      console.log(`BiologicalIndicatorToRisk: ${riskCount}`);
      console.log(`BiologicalIndicatorToExam: ${examCount}`);
      console.log(`ExamToRisk (inalterado): ${examToRiskCount}`);
      console.log(`ExamToRiskData (inalterado): ${examToRiskDataCount}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
