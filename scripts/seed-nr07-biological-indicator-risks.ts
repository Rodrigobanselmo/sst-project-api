import { PrismaClient } from '@prisma/client';

import { BiologicalIndicatorCatalogRiskService } from '../src/@v2/medicine/biological-indicator/biological-indicator-catalog-risk.service';

async function main() {
  const prisma = new PrismaClient();
  const service = new BiologicalIndicatorCatalogRiskService(prisma);

  try {
    const results = await service.ensureAll();

    console.log('=== NR-07 Anexo I — Catálogo de Riscos Químicos ===');
    results.forEach((result) => {
      console.log(
        JSON.stringify(
          {
            key: result.key,
            requestedName: result.name,
            action: result.action,
            matchedBy: result.matchedBy,
            existingName: result.existingName,
            risk: {
              id: result.risk.id,
              name: result.risk.name,
              cas: result.risk.cas,
              type: result.risk.type,
              system: result.risk.system,
              companyId: result.risk.companyId,
              synonymous: result.risk.synonymous,
            },
          },
          null,
          2,
        ),
      );
    });
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
