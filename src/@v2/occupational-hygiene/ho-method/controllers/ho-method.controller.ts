import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { OccupationalHygieneRoutes } from '@/@v2/occupational-hygiene/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';

import { User } from '@/shared/decorators/user.decorator';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import {
  HoMethodBrowseQuery,
  HoMethodPath,
  HoMethodRiskSearchQuery,
  HoMethodWritePayload,
} from './ho-method.dto';
import { HoMethodRiskSearchService } from '../ho-method-risk-search.service';
import { HoMethodService } from '../ho-method.service';
import { HoMethodWriteInput } from '../ho-method.types';

const mapPayload = (body: HoMethodWritePayload): HoMethodWriteInput => ({
  ...body,
  displayName: body.displayName ?? '',
  originalDocumentUploadedAt: body.originalDocumentUploadedAt
    ? new Date(body.originalDocumentUploadedAt)
    : null,
  evaluationConditions: body.evaluationConditions ?? [],
  agents: (body.agents ?? []).map((agent) => ({
    ...agent,
    evaluationConditions: agent.evaluationConditions ?? [],
  })),
  laboratories: (body.laboratories ?? []).map((lab) => ({
    ...lab,
    lastConfirmationDate: lab.lastConfirmationDate
      ? new Date(lab.lastConfirmationDate)
      : null,
  })),
});

@Controller(OccupationalHygieneRoutes.HO_METHOD.BASE)
@UseGuards(JwtAuthGuard)
export class HoMethodController {
  constructor(
    private readonly hoMethodService: HoMethodService,
    private readonly hoMethodRiskSearchService: HoMethodRiskSearchService,
  ) {}

  @Get('risk-factors/search')
  @Permissions({
    code: PermissionEnum.RISK,
    crud: 'r',
    isMember: true,
    isContract: true,
  })
  searchRiskFactors(
    @Query() query: HoMethodRiskSearchQuery,
    @User() user: UserPayloadDto,
  ) {
    return this.hoMethodRiskSearchService.search({
      search: query.search,
      companyId: user.targetCompanyId || query.companyId || user.companyId,
      limit: 50,
    });
  }

  @Get()
  @Permissions({
    code: PermissionEnum.RISK,
    crud: 'r',
  })
  browse(@Query() query: HoMethodBrowseQuery) {
    return this.hoMethodService.browse({
      page: query.page,
      limit: query.limit,
      filters: {
        search: query.search,
        agentName: query.agentName,
        cas: query.cas,
        institution: query.institution,
        methodCode: query.methodCode,
        analyticalMethod: query.analyticalMethod,
        evaluationType: query.evaluationType,
        status: query.status,
        prioritized: query.prioritized,
      },
    });
  }

  @Post()
  @Permissions({
    code: PermissionEnum.RISK,
    crud: 'c',
  })
  create(@Body() body: HoMethodWritePayload) {
    return this.hoMethodService.create(mapPayload(body));
  }
}

@Controller(OccupationalHygieneRoutes.HO_METHOD.BY_ID)
@UseGuards(JwtAuthGuard)
export class HoMethodByIdController {
  constructor(private readonly hoMethodService: HoMethodService) {}

  @Get()
  @Permissions({
    code: PermissionEnum.RISK,
    crud: 'r',
  })
  read(@Param() path: HoMethodPath) {
    return this.hoMethodService.read(path.id);
  }

  @Get('original-document')
  @Permissions({
    code: PermissionEnum.RISK,
    crud: 'r',
  })
  downloadOriginalDocument(
    @Param() path: HoMethodPath,
    @Res() res: Response,
  ) {
    return this.hoMethodService.streamOriginalDocument(path.id, res);
  }

  @Patch()
  @Permissions({
    code: PermissionEnum.RISK,
    crud: 'u',
  })
  update(@Param() path: HoMethodPath, @Body() body: HoMethodWritePayload, @User() user: UserPayloadDto) {
    return this.hoMethodService.update(path.id, mapPayload(body), user);
  }

  @Delete()
  @Permissions({
    code: PermissionEnum.RISK,
    crud: 'd',
  })
  remove(@Param() path: HoMethodPath) {
    return this.hoMethodService.remove(path.id);
  }
}
