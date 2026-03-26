import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';

/**
 * Formulários acessíveis para uma empresa incluem:
 * - a própria empresa
 * - empresas consultoras/prestadoras aplicáveis via Contract ACTIVE
 */
export async function getAccessibleFormCompanyIds(
  prisma: PrismaServiceV2,
  companyId: string,
): Promise<string[]> {
  const contracts = await prisma.contract.findMany({
    where: {
      receivingServiceCompanyId: companyId,
      status: 'ACTIVE',
    },
    select: {
      applyingServiceCompanyId: true,
    },
  });

  const ids = new Set<string>([companyId]);
  for (const contract of contracts) {
    if (contract.applyingServiceCompanyId) {
      ids.add(contract.applyingServiceCompanyId);
    }
  }

  return Array.from(ids);
}

