import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { SendFormEmailUseCase } from '../use-cases/send-form-email.usecase';
import { SendFormEmailPath } from './send-form-email.path';
import { SendFormEmailPayload } from './send-form-email.payload';
import { FormRoutes } from '@/@v2/forms/constants/routes';

@Controller(FormRoutes.FORM_PARTICIPANTS.SEND_EMAIL)
@UseGuards(JwtAuthGuard)
export class SendFormEmailController {
  constructor(private readonly sendFormEmailUseCase: SendFormEmailUseCase) {}

  @Post()
  @Permissions({
    code: PermissionEnum.FORM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async execute(@Param() path: SendFormEmailPath, @Body() body: SendFormEmailPayload) {
    return this.sendFormEmailUseCase.execute({
      companyId: path.companyId,
      applicationId: path.applicationId,
      participantIds: body.participantIds,
    });
  }
}
