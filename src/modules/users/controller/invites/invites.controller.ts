import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { classToClass } from 'class-transformer';
import { ErrorInvitesEnum } from '../../../../shared/constants/enum/errorMessage';
import { ValidateEmailPipe } from '../../../../shared/pipes/validate-email.pipe';

import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { InviteUserDto } from '../../dto/invite-user.dto';
import { DeleteExpiredInvitesService } from '../../services/invites/delete-expired-invites/delete-expired-invites.service';
import { DeleteInvitesService } from '../../services/invites/delete-invites/delete-invites.service';
import { FindAllByCompanyIdService } from '../../services/invites/find-by-companyId/find-by-companyId.service';
import { FindAllByEmailService } from '../../services/invites/find-by-email/find-by-email.service';
import { InviteUsersService } from '../../services/invites/invite-users/invite-users.service';

@ApiTags('invites')
@Controller('invites')
export class InvitesController {
  constructor(
    private readonly inviteUsersService: InviteUsersService,
    private readonly findAllByCompanyIdService: FindAllByCompanyIdService,
    private readonly findAllByEmailService: FindAllByEmailService,
    private readonly deleteInvitesService: DeleteInvitesService,
    private readonly deleteExpiredInvitesService: DeleteExpiredInvitesService,
  ) {}

  @Get('/:companyId?')
  async findAllByCompany(@User() user: UserPayloadDto) {
    return classToClass(
      this.findAllByCompanyIdService.execute(user.targetCompanyId),
    );
  }

  @Get('/me/:email')
  async findAllByEmail(
    @Param('email', ValidateEmailPipe) email: string,
    @User() user: UserPayloadDto,
  ) {
    if (user.email !== email)
      throw new ForbiddenException(
        ErrorInvitesEnum.FORBIDDEN_ACCESS_USER_INVITE_LIST,
      );
    return classToClass(this.findAllByEmailService.execute(email));
  }

  @Post()
  async invite(@Body() inviteUserDto: InviteUserDto) {
    return classToClass(this.inviteUsersService.execute(inviteUserDto));
  }

  @Delete('/:id/:companyId?')
  async delete(@Param('id') id: string, @User() user: UserPayloadDto) {
    await this.deleteInvitesService.execute({
      id,
      companyId: user.targetCompanyId,
    });

    return id;
  }

  @Delete('expired')
  @ApiBearerAuth()
  deleteAll() {
    return this.deleteExpiredInvitesService.execute();
  }
}
