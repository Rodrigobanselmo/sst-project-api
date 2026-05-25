import { FormApplicationScopeService } from '@/@v2/forms/application/shared/services/form-application-scope.service';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

/**
 * Empresa que deve receber dados de inventário/risco (RiskFactorGroupData, etc.).
 * Diferente de accessCompanyId (empresa da rota), usada só para acesso ao formulário.
 */
export async function resolveOperationalCompanyIdForHierarchy(params: {
  prisma: PrismaServiceV2;
  formApplicationScopeService: FormApplicationScopeService;
  formApplicationId: string;
  accessCompanyId: string;
  hierarchyId: string;
}): Promise<string> {
  const scope = await params.formApplicationScopeService.resolve({
    formApplicationId: params.formApplicationId,
    accessCompanyId: params.accessCompanyId,
  });

  const allowedCompanyIds =
    params.formApplicationScopeService.participantCompanyIdsForScope(scope);

  const hierarchy = await params.prisma.hierarchy.findFirst({
    where: { id: params.hierarchyId },
    select: { id: true, companyId: true },
  });

  if (!hierarchy) {
    throw new NotFoundException('Hierarquia não encontrada');
  }

  if (!allowedCompanyIds.includes(hierarchy.companyId)) {
    throw new BadRequestException('Setor fora do recorte do formulário');
  }

  return hierarchy.companyId;
}
