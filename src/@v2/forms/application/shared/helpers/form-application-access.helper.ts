import { Prisma } from '@prisma/client';

/**
 * Empresa da rota pode ser a âncora (company_id) ou participante convertida
 * (FormApplicationCompany) enquanto scope_type = COMPANY_WORKSPACES.
 */
export function formApplicationAccessWhere(params: {
  formApplicationId?: string;
  accessCompanyId: string;
}): Prisma.FormApplicationWhereInput {
  return {
    ...(params.formApplicationId ? { id: params.formApplicationId } : {}),
    deleted_at: null,
    OR: [
      { company_id: params.accessCompanyId },
      {
        applicationCompanies: {
          some: { company_id: params.accessCompanyId },
        },
      },
    ],
  };
}

export function formApplicationNestedAccessWhere(
  accessCompanyId: string,
): Prisma.FormApplicationWhereInput {
  return {
    deleted_at: null,
    OR: [
      { company_id: accessCompanyId },
      {
        applicationCompanies: {
          some: { company_id: accessCompanyId },
        },
      },
    ],
  };
}
