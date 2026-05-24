import { FormApplicationScopeTypeEnum } from '@/@v2/forms/domain/enums/form-application-scope-type.enum';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { BadRequestException } from '@nestjs/common';

export async function validateFormApplicationCompanies(params: {
  prisma: PrismaServiceV2;
  scopeType: FormApplicationScopeTypeEnum;
  companyGroupId?: number | null;
  companyIds?: string[];
  workspaceIds?: string[];
  hierarchyIds?: string[];
}) {
  if (params.scopeType === FormApplicationScopeTypeEnum.BUSINESS_GROUP_COMPANIES) {
    if (!params.companyGroupId) {
      throw new BadRequestException('Grupo empresarial é obrigatório');
    }

    if (!params.companyIds?.length) {
      throw new BadRequestException(
        'Selecione ao menos uma empresa do grupo empresarial',
      );
    }

    const companiesInGroup = await params.prisma.company.count({
      where: {
        id: { in: params.companyIds },
        groupId: params.companyGroupId,
        deleted_at: null,
        status: 'ACTIVE',
      },
    });

    if (companiesInGroup !== params.companyIds.length) {
      throw new BadRequestException(
        'Uma ou mais empresas não pertencem ao grupo selecionado',
      );
    }

    return;
  }

  if (
    (params.hierarchyIds?.length ?? 0) === 0 &&
    (params.workspaceIds?.length ?? 0) === 0
  ) {
    throw new BadRequestException(
      'É necessário informar pelo menos um estabelecimento ou setor',
    );
  }
}
