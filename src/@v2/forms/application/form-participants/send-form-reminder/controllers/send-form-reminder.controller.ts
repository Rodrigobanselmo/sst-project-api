import { Controller, Post, Param, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { PermissionEnum } from '@/shared/constants/enum/authorization';
import { Permissions } from '@/shared/decorators/permissions.decorator';
import { SendFormReminderUseCase } from '../use-cases/send-form-reminder.usecase';
import { SendFormReminderPath } from './send-form-reminder.path';
import { FormRoutes } from '@/@v2/forms/constants/routes';

@Controller(FormRoutes.FORM_PARTICIPANTS.SEND_REMINDER)
@UseGuards(JwtAuthGuard)
export class SendFormReminderController {
  constructor(private readonly sendFormReminderUseCase: SendFormReminderUseCase) {}

  @Post()
  @Permissions({
    code: PermissionEnum.FORM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  async execute(@Param() path: SendFormReminderPath) {
    return this.sendFormReminderUseCase.execute({
      companyId: path.companyId,
      applicationId: path.applicationId,
    });
  }
}
