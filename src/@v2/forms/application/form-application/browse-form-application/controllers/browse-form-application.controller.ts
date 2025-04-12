import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { BrowseFormApplicationUseCase } from '../use-cases/browse-form-application.usecase';
import { BrowseFormApplicationPath } from './browse-form-application.path';
import { BrowseFormApplicationQuery } from './browse-form-application.query';
import { FormRoutes } from '@/@v2/forms/constants/routes';

@Controller(FormRoutes.FORM_APPLICATION.PATH)
@UseGuards(JwtAuthGuard)
export class BrowseFormApplicationController {
  constructor(private readonly browseFormApplicationUseCase: BrowseFormApplicationUseCase) {}

  @Get()
  @Permissions({
    code: PermissionEnum.FORM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async execute(@Param() path: BrowseFormApplicationPath, @Query() query: BrowseFormApplicationQuery) {
    return this.browseFormApplicationUseCase.execute({
      companyId: path.companyId,
      orderBy: query.orderBy,
      search: query.search,
      status: query.status,
      pagination: {
        page: query.page,
        limit: query.limit,
      },
    });
  }
}
