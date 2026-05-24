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
    }
  | {
      scopeType: FormApplicationScopeTypeEnum.BUSINESS_GROUP_COMPANIES;
      anchorCompanyId: string;
      companyGroupId: number;
      participantCompanyIds: string[];
      companies: FormApplicationCompanyScopeItem[];
    };

@Injectable()
export class FormApplicationScopeService {
  constructor(private readonly prisma: PrismaServiceV2) {}

  async resolve(params: {
    formApplicationId: string;
    anchorCompanyId: string;
  }): Promise<ResolvedFormApplicationScope> {
    const application = await this.prisma.formApplication.findFirst({
      where: {
        id: params.formApplicationId,
        company_id: params.anchorCompanyId,
        deleted_at: null,
      },
      select: {
        scope_type: true,
        company_group_id: true,
        company_id: true,
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
      };
    }

    return {
      scopeType: FormApplicationScopeTypeEnum.COMPANY_WORKSPACES,
      anchorCompanyId: application.company_id,
      participantCompanyIds: [application.company_id],
    };
  }

  isBusinessGroupScope(scope: ResolvedFormApplicationScope): boolean {
    return (
      scope.scopeType ===
      FormApplicationScopeTypeEnum.BUSINESS_GROUP_COMPANIES
    );
  }
}
