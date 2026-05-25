import { FormApplicationScopeTypeEnum } from '@/@v2/forms/domain/enums/form-application-scope-type.enum';
import { PrismaServiceV2 } from '@/@v2/shared/adapters/database/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

export type FormApplicationCompanyScopeItem = {
  id: string;
  name: string;
};

export type ResolvedFormApplicationScope =
  | {
      scopeType: FormApplicationScopeTypeEnum.COMPANY_WORKSPACES;
      anchorCompanyId: string;
      participantCompanyIds: [string];
      /** Empresas já convertidas (FormApplicationCompany), exceto a âncora. */
      convertedCompanyIds: string[];
      /** Workspaces ainda vinculados ao participante (recorte da matriz no híbrido). */
      participantWorkspaceIds: string[];
    }
  | {
      scopeType: FormApplicationScopeTypeEnum.BUSINESS_GROUP_COMPANIES;
      anchorCompanyId: string;
      companyGroupId: number;
      participantCompanyIds: string[];
      companies: FormApplicationCompanyScopeItem[];
      participantWorkspaceIds: string[];
    };

@Injectable()
export class FormApplicationScopeService {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async resolve(params: {
    formApplicationId: string;
    accessCompanyId: string;
  }): Promise<ResolvedFormApplicationScope> {
    const application = await this.prisma.formApplication.findFirst({
      where: {
        id: params.formApplicationId,
        deleted_at: null,
        OR: [
          { company_id: params.accessCompanyId },
          {
            applicationCompanies: {
              some: { company_id: params.accessCompanyId },
            },
          },
        ],
      },
      select: {
        scope_type: true,
        company_group_id: true,
        company_id: true,
        participants: {
          select: {
            workspaces: { select: { workspace_id: true } },
          },
        },
        applicationCompanies: {
          select: {
            company_id: true,
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException('Formulário aplicado não encontrado');
    }

    const participantWorkspaceIds =
      application.participants?.workspaces.map(
        (workspace) => workspace.workspace_id,
      ) ?? [];

    if (
      application.scope_type ===
      FormApplicationScopeTypeEnum.BUSINESS_GROUP_COMPANIES
    ) {
      const companies = application.applicationCompanies.map((row) => ({
        id: row.company.id,
        name: row.company.name,
      }));

      return {
        scopeType: FormApplicationScopeTypeEnum.BUSINESS_GROUP_COMPANIES,
        anchorCompanyId: application.company_id,
        companyGroupId: application.company_group_id!,
        participantCompanyIds: companies.map((company) => company.id),
        companies,
        participantWorkspaceIds,
      };
    }

    const convertedCompanyIds = application.applicationCompanies
      .map((row) => row.company_id)
      .filter((companyId) => companyId !== application.company_id);

    return {
      scopeType: FormApplicationScopeTypeEnum.COMPANY_WORKSPACES,
      anchorCompanyId: application.company_id,
      participantCompanyIds: [application.company_id],
      convertedCompanyIds,
      participantWorkspaceIds,
    };
  }

  hasConvertedCompanies(
    scope: ResolvedFormApplicationScope,
  ): scope is Extract<
    ResolvedFormApplicationScope,
    { scopeType: FormApplicationScopeTypeEnum.COMPANY_WORKSPACES }
  > {
    return (
      scope.scopeType === FormApplicationScopeTypeEnum.COMPANY_WORKSPACES &&
      scope.convertedCompanyIds.length > 0
    );
  }

  isBusinessGroupScope(scope: ResolvedFormApplicationScope): boolean {
    return (
      scope.scopeType ===
      FormApplicationScopeTypeEnum.BUSINESS_GROUP_COMPANIES
    );
  }

  /**
   * Híbrido pós-conversão: filiais em FormApplicationCompany e matriz sem workspaces
   * no participante — recorte = todas as empresas do FAC (âncora + convertidas).
   */
  usesConsolidatedApplicationCompaniesParticipantScope(
    scope: ResolvedFormApplicationScope,
  ): boolean {
    return (
      scope.scopeType === FormApplicationScopeTypeEnum.COMPANY_WORKSPACES &&
      scope.convertedCompanyIds.length > 0 &&
      scope.participantWorkspaceIds.length === 0
    );
  }

  /** Empresas cujos dados entram no recorte consolidado (âncora + convertidas ou grupo). */
  participantCompanyIdsForScope(scope: ResolvedFormApplicationScope): string[] {
    if (
      scope.scopeType ===
      FormApplicationScopeTypeEnum.BUSINESS_GROUP_COMPANIES
    ) {
      return scope.participantCompanyIds;
    }

    return Array.from(
      new Set([scope.anchorCompanyId, ...scope.convertedCompanyIds]),
    );
  }
}
