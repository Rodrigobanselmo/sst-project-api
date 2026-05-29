import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { BrowseFormParticipantsUseCase } from '../use-cases/browse-form-participants.usecase';
import { BrowseFormParticipantsPath } from './browse-form-participants.path';
import { coerceQueryStringParam } from '@/@v2/shared/utils/coerce-query-string-param.util';
import { parseOptionalBoolean } from '@/@v2/shared/utils/parse-optional-boolean.util';
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
  async execute(
    @Param() path: BrowseFormParticipantsPath,
    @Query() query: BrowseFormParticipantsQuery,
    @Query('hasResponded') hasRespondedRaw?: string,
    @Query('onlyWithEmail') onlyWithEmailRaw?: string,
    @Query('search') searchRaw?: string | string[],
  ) {
    const search = coerceQueryStringParam(searchRaw);

    return this.browseFormParticipantsUseCase.execute({
      companyId: path.companyId,
      applicationId: path.applicationId,
      orderBy: query.orderBy,
      search,
      hierarchyIds: query.hierarchyIds,
      workspaceIds: query.workspaceIds,
      hasResponded: parseOptionalBoolean(hasRespondedRaw ?? query.hasResponded),
      onlyWithEmail: parseOptionalBoolean(onlyWithEmailRaw ?? query.onlyWithEmail),
      pagination: {
        // A paginação pode vir como `page/limit` ou como `pagination[page]/pagination[limit]`
        // (o front v2 usa bindUrlParams que serializa objetos aninhados).
        page: query.page ?? query?.pagination?.page,
        limit: query.limit ?? query?.pagination?.limit,
      },
    });
  }
}
