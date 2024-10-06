import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common'

import { SecurityRoutes } from '@/@v2/security/constants/routes'
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard'
import { PermissionEnum } from '@/shared/constants/enum/authorization'
import { Permissions } from '@/shared/decorators/permissions.decorator'
import { AddStatusUseCase } from '../use-cases/add-status.usecase'
import { AddStatusPath } from './add-status.path'
import { AddStatusPayload } from './add-status.payload'

@Controller(SecurityRoutes.STATUS.ADD)
@UseGuards(JwtAuthGuard)
export class AddStatusController {
  constructor(
    private readonly addStatusUseCase: AddStatusUseCase
  ) { }

  @Post()
  @Permissions({
    code: PermissionEnum.CHARACTERIZATION,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async browse(@Param() path: AddStatusPath, @Body() body: AddStatusPayload) {
    return this.addStatusUseCase.execute({
      companyId: path.companyId,
      name: body.name,
      type: body.type,
      color: body.color,
    })
  }
}
