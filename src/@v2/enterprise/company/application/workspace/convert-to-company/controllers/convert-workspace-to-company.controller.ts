import { Controller, Get, Param, Post, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { RoleEnum } from '@/shared/constants/enum/authorization';
import { Roles } from '@/shared/decorators/roles.decorator';
import { User } from '@/shared/decorators/user.decorator';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';
import { CompanyRoutes } from '@/@v2/enterprise/company/constants/routes';
import { PreviewConvertWorkspaceToCompanyUseCase } from '../use-cases/preview-convert-workspace-to-company.usecase';
import { ConvertWorkspaceToCompanyUseCase } from '../use-cases/convert-workspace-to-company.usecase';
import { WorkspaceConvertService } from '../services/workspace-convert.service';
import {
  ConvertWorkspaceToCompanyPath,
  ConvertWorkspaceToCompanyPayload,
  ConvertWorkspaceToCompanyPreviewQuery,
} from './convert-workspace-to-company.dto';

@Controller(CompanyRoutes.WORKSPACE.CONVERT_TO_COMPANY.BASE)
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.MASTER)
export class ConvertWorkspaceToCompanyController {
  constructor(
    private readonly previewUseCase: PreviewConvertWorkspaceToCompanyUseCase,
    private readonly convertUseCase: ConvertWorkspaceToCompanyUseCase,
    private readonly workspaceConvertService: WorkspaceConvertService,
  ) {}

  @Get('company-groups')
  listCompanyGroups(
    @Param() path: ConvertWorkspaceToCompanyPath,
    @User() user: UserPayloadDto,
  ) {
    return this.workspaceConvertService.listCompanyGroups(path.companyId, user);
  }

  @Get('preview')
  preview(
    @Param() path: ConvertWorkspaceToCompanyPath,
    @Query() query: ConvertWorkspaceToCompanyPreviewQuery,
    @User() user: UserPayloadDto,
  ) {
    return this.previewUseCase.execute({
      companyId: path.companyId,
      workspaceId: path.workspaceId,
      companyGroupId: query.companyGroupId,
      user,
    });
  }

  @Post()
  convert(
    @Param() path: ConvertWorkspaceToCompanyPath,
    @Body() body: ConvertWorkspaceToCompanyPayload,
    @User() user: UserPayloadDto,
  ) {
    return this.convertUseCase.execute({
      companyId: path.companyId,
      workspaceId: path.workspaceId,
      companyGroupId: body.companyGroupId,
      confirmationText: body.confirmationText,
      user,
    });
  }
}
