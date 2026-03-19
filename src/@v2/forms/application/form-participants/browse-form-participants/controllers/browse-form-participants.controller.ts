import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { BrowseFormParticipantsUseCase } from '../use-cases/browse-form-participants.usecase';
import { BrowseFormParticipantsPath } from './browse-form-participants.path';
import { BrowseFormParticipantsQuery } from './browse-form-participants.query';
import { FormRoutes } from '@/@v2/forms/constants/routes';

@Controller(FormRoutes.FORM_PARTICIPANTS.PATH)
@UseGuards(JwtAuthGuard)
export class BrowseFormParticipantsController {
  constructor(private readonly browseFormParticipantsUseCase: BrowseFormParticipantsUseCase) {}

  @Get()
  @Permissions({
    code: PermissionEnum.FORM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async execute(@Param() path: BrowseFormParticipantsPath, @Query() query: BrowseFormParticipantsQuery) {
    const q = query as any;
    return this.browseFormParticipantsUseCase.execute({
      companyId: path.companyId,
      applicationId: path.applicationId,
      orderBy: query.orderBy,
      search: query.search,
      hierarchyIds: query.hierarchyIds,
      onlyWithEmail: query.onlyWithEmail,
      pagination: {
        // A paginação pode vir como `page/limit` ou como `pagination[page]/pagination[limit]`
        // (o front v2 usa bindUrlParams que serializa objetos aninhados).
        page: query.page ?? q?.pagination?.page,
        limit: query.limit ?? q?.pagination?.limit,
      },
    });
  }
}
