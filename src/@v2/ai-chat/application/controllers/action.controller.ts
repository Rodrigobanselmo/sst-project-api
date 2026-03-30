import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { ConfirmActionUseCase } from '../use-cases/confirm-action.usecase';

@Controller('ai-chat/actions')
@UseGuards(JwtAuthGuard)
export class ActionController {
  constructor(private readonly confirmActionUseCase: ConfirmActionUseCase) {}

  @Post(':actionId/confirm')
  async confirmAction(@User() user: UserPayloadDto, @Param('actionId') actionId: string) {
    return this.confirmActionUseCase.execute(user, actionId);
  }

  @Post(':actionId/cancel')
  async cancelAction(@User() user: UserPayloadDto, @Param('actionId') actionId: string) {
    return this.confirmActionUseCase.cancel(user, actionId);
  }
}

