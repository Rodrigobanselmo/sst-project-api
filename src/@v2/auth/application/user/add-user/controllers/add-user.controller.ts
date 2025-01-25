import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { AddUserPath } from './add-user.path';
import { AddUserPayload } from './add-user.payload';
import { AuthRoutes } from '@/@v2/auth/constants/routes';
import { AddUserUseCase } from '../use-cases/add-user.usecase';

@Controller(AuthRoutes.USER.ADD)
@UseGuards(JwtAuthGuard)
export class AddUserController {
  constructor(private readonly addUserUseCase: AddUserUseCase) {}

  @Post()
  @Permissions({
    code: PermissionEnum.USER,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async add(@Param() path: AddUserPath, @Body() body: AddUserPayload) {
    return this.addUserUseCase.execute({
      companyId: path.companyId,
      name: body.name,
      email: body.email || undefined,
      groupId: body.groupId,
      phone: body.phone || undefined,
      cpf: body.cpf || undefined,
    });
  }
}
