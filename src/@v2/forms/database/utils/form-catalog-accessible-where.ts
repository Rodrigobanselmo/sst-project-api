import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Prisma } from '@prisma/client';
import { getAccessibleFormCompanyIds } from './get-accessible-form-company-ids';

/**
 * Partes de `OR` alinhadas a {@link FormDAO} (read/browse):
 * - `system = true` (globais da biblioteca com `company_id` nulo)
 * - `company_id` em empresas acessíveis (própria + consultorias via Contract ACTIVE)
 *
 * Tipos separados para Question e Block (Prisma exige tipos distintos em `OR`).
 */
export async function getFormCatalogAccessibleOrWhereParts(
  prisma: PrismaServiceV2,
  companyId: string,
): Promise<{
  questionOr: Pick<Prisma.FormPreliminaryLibraryQuestionWhereInput, 'OR'>;
  blockOr: Pick<Prisma.FormPreliminaryLibraryBlockWhereInput, 'OR'>;
  accessibleCompanyIds: string[];
}> {
  const accessibleCompanyIds = await getAccessibleFormCompanyIds(prisma, companyId);
  return {
    accessibleCompanyIds,
    questionOr: {
      OR: [{ system: true }, { company_id: { in: accessibleCompanyIds } }],
    },
    blockOr: {
      OR: [{ system: true }, { company_id: { in: accessibleCompanyIds } }],
    },
  };
}
