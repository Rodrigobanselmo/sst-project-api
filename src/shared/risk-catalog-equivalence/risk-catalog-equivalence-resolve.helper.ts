import { RiskCatalogKind } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';

import { RiskCatalogEquivalenceService } from './risk-catalog-equivalence.service';

export async function resolveRecMedEntityToCanonical<T extends { id: string }>(
  prisma: PrismaService,
  equivalenceService: RiskCatalogEquivalenceService,
  recMed: T,
  aliasMap: ReadonlyMap<string, string>,
): Promise<T> {
  const canonicalId = equivalenceService.resolveCanonicalCatalogIdFromMap(
    RiskCatalogKind.REC_MED,
    recMed.id,
    aliasMap,
  );
  if (canonicalId === recMed.id) return recMed;

  const canonical = await prisma.recMed.findFirst({
    where: { id: canonicalId, deleted_at: null },
  });
  return (canonical as unknown as T) ?? recMed;
}

export async function resolveGenerateSourceEntityToCanonical<T extends { id: string }>(
  prisma: PrismaService,
  equivalenceService: RiskCatalogEquivalenceService,
  generateSource: T,
  aliasMap: ReadonlyMap<string, string>,
): Promise<T> {
  const canonicalId = equivalenceService.resolveCanonicalCatalogIdFromMap(
    RiskCatalogKind.GENERATE_SOURCE,
    generateSource.id,
    aliasMap,
  );
  if (canonicalId === generateSource.id) return generateSource;

  const canonical = await prisma.generateSource.findFirst({
    where: { id: canonicalId, deleted_at: null },
  });
  return (canonical as unknown as T) ?? generateSource;
}
