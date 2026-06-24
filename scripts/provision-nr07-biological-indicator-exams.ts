import { PrismaClient } from '@prisma/client';

import { createBiologicalIndicatorExamProvisionService } from '../src/@v2/medicine/biological-indicator/services/biological-indicator-exam-provision.service';
import { simpleCompanyId } from '../src/shared/constants/ids';

type CliOptions = {
  dryRun: boolean;
  indicatorIds?: string[];
};

function parseArgs(argv: string[]): CliOptions {
  const indicatorArg = argv.find((arg) => arg.startsWith('--indicator-ids='));
  return {
    dryRun: argv.includes('--dry-run'),
    indicatorIds: indicatorArg
      ? indicatorArg.replace('--indicator-ids=', '').split(',').filter(Boolean)
      : undefined,
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const prisma = new PrismaClient();
  const service = createBiologicalIndicatorExamProvisionService(prisma);

  try {
    const invalidBefore = await service.diagnoseInvalidExamLinks();
    const coverageBefore = await service.diagnoseActiveExamLinkCoverage();

    console.log('=== Diagnóstico pré-correção ===');
    console.log(
      JSON.stringify(
        {
          invalidLinks: invalidBefore.length,
          coverage: coverageBefore,
          invalidExamples: invalidBefore.slice(0, 10).map((link) => ({
            indicator: link.indicator.biologicalIndicatorOriginal,
            examId: link.exam.id,
            examName: link.exam.name,
            examCompany: link.exam.company?.name,
            examCompanyId: link.exam.companyId,
            examSystem: link.exam.system,
          })),
        },
        null,
        2,
      ),
    );
    console.log('');

    const report = await service.run({
      dryRun: options.dryRun,
      indicatorIds: options.indicatorIds,
    });

    console.log('=== NR-07 Anexo I — Provisionamento de Exames ===');
    console.log(`Modo: ${options.dryRun ? 'DRY-RUN' : 'PERSIST'}`);
    console.log('');
    console.log(JSON.stringify(report, null, 2));

    if (!options.dryRun) {
      const [
        indicatorCount,
        linkCount,
        indicatorsWithLinks,
        examToRiskCount,
        examToRiskDataCount,
      ] = await Promise.all([
        prisma.occupationalBiologicalIndicator.count({ where: { deleted_at: null } }),
        prisma.biologicalIndicatorToExam.count({ where: { deleted_at: null } }),
        prisma.occupationalBiologicalIndicator.count({
          where: {
            deleted_at: null,
            examLinks: { some: { deleted_at: null } },
          },
        }),
        prisma.examToRisk.count(),
        prisma.examToRiskData.count(),
      ]);

      const tricloro = await prisma.occupationalBiologicalIndicator.findMany({
        where: {
          deleted_at: null,
          substanceName: { contains: '1,1,1 Tricloroetano', mode: 'insensitive' },
        },
        orderBy: { biologicalIndicatorOriginal: 'asc' },
        include: {
          examLinks: {
            where: { deleted_at: null },
            include: {
              exam: {
                select: {
                  id: true,
                  name: true,
                  material: true,
                  esocial27Code: true,
                  system: true,
                  companyId: true,
                },
              },
            },
          },
        },
      });

      const coverageAfter = await service.diagnoseActiveExamLinkCoverage();
      const invalidAfter = await service.diagnoseInvalidExamLinks();

      console.log('\nCobertura pós-provisionamento:');
      console.log(
        JSON.stringify(
          {
            coverage: coverageAfter,
            invalidLinksRemaining: invalidAfter.length,
            simpleCompanyId,
          },
          null,
          2,
        ),
      );

      console.log('\nPós-provisionamento:');
      console.log(
        JSON.stringify(
          {
            indicators: indicatorCount,
            indicatorsWithExamLinks: indicatorsWithLinks,
            biologicalIndicatorToExam: linkCount,
            examToRiskUnchanged: examToRiskCount,
            examToRiskDataUnchanged: examToRiskDataCount,
          },
          null,
          2,
        ),
      );

      console.log('\nExemplo 1,1,1 Tricloroetano:');
      tricloro.forEach((indicator) => {
        const link = indicator.examLinks[0];
        console.log(
          JSON.stringify(
            {
              indicator: indicator.biologicalIndicatorOriginal,
              matrix: indicator.biologicalMatrix,
              technicalObservations: indicator.technicalObservations,
              exam: link?.exam ?? null,
              link: link
                ? {
                    isConfirmed: link.isConfirmed,
                    isDefault: link.isDefault,
                    requiresReview: link.requiresReview,
                    notes: link.notes,
                  }
                : null,
            },
            null,
            2,
          ),
        );
      });
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
