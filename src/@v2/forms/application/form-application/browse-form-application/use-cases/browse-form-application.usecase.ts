import { BadRequestException, Injectable } from '@nestjs/common';

import { AccessibleGroupCompaniesService } from '@/@v2/enterprise/company/application/shared/services/accessible-group-companies.service';
import { FormApplicationDAO } from '@/@v2/forms/database/dao/form-application/form-application.dao';

import { IFormApplicationUseCase } from './browse-form-application.types';

@Injectable()
export class BrowseFormApplicationUseCase {
  constructor(
    private readonly formApplicationDAO: FormApplicationDAO,
    private readonly accessibleGroupCompaniesService: AccessibleGroupCompaniesService,
  ) {}

  async execute(params: IFormApplicationUseCase.Params) {
    const isConsolidatedGroupScope = params.companyGroupScope === 'consolidated';

    if (isConsolidatedGroupScope) {
      if (!params.companyGroupId) {
        throw new BadRequestException('companyGroupId é obrigatório no modo consolidado');
      }

      if (!params.user) {
        throw new BadRequestException('Usuário é obrigatório no modo consolidado');
      }

      const { includedCompanyIds } =
        await this.accessibleGroupCompaniesService.resolveAccessibleGroupMembers({
          companyGroupId: params.companyGroupId,
          user: params.user,
        });

      return this.formApplicationDAO.browse({
        page: params.pagination.page,
        limit: params.pagination.limit,
        orderBy: params.orderBy,
        filters: {
          companyId: params.companyId,
          search: params.search,
          status: params.status,
          companyGroupScope: 'consolidated',
          accessibleCompanyIds: includedCompanyIds,
        },
      });
    }

    return this.formApplicationDAO.browse({
      page: params.pagination.page,
      limit: params.pagination.limit,
      orderBy: params.orderBy,
      filters: {
        companyId: params.companyId,
        search: params.search,
        status: params.status,
      },
    });
  }
}
