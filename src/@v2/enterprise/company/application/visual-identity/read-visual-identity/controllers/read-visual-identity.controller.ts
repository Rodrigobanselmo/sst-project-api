import { Controller, Get, Param, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard'
import { PermissionEnum } from '@/shared/constants/enum/authorization'
import { Permissions } from '@/shared/decorators/permissions.decorator'
import { ReadVisualIdentityUseCase } from '../use-cases/read-visual-identity.usecase'
import { ReadVisualIdentityPath } from './read-visual-identity.path'
import { CompanyRoutes } from '@/@v2/enterprise/company/constants/routes'

@Controller(CompanyRoutes.VISUAL_IDENTITY.READ)
@UseGuards(JwtAuthGuard)
export class ReadVisualIdentityController {
  constructor(private readonly readVisualIdentityUseCase: ReadVisualIdentityUseCase) {}

  @Get()
  @Permissions({
    code: PermissionEnum.COMPANY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async read(@Param() path: ReadVisualIdentityPath) {
    return this.readVisualIdentityUseCase.execute({
      companyId: path.companyId,
    })
  }
}

