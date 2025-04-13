import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { BrowseFormUseCase } from '../use-cases/browse-form.usecase';
import { BrowseFormPath } from './browse-form.path';
import { BrowseFormQuery } from './browse-form.query';
import { FormRoutes } from '@/@v2/forms/constants/routes';

@Controller(FormRoutes.FORM.PATH)
@UseGuards(JwtAuthGuard)
export class BrowseFormController {
  constructor(private readonly browseFormUseCase: BrowseFormUseCase) {}

  @Get()
  @Permissions({
    code: PermissionEnum.FORM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async execute(@Param() path: BrowseFormPath, @Query() query: BrowseFormQuery) {
    return this.browseFormUseCase.execute({
      companyId: path.companyId,
      orderBy: query.orderBy,
      search: query.search,
      types: query.types,
      pagination: {
        page: query.page,
        limit: query.limit,
      },
    });
  }
}
