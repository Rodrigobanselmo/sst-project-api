import { Body, Controller, Delete, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { classToClass } from 'class-transformer';

import { Permission } from '../../../../shared/constants/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { InviteUserDto } from '../../dto/invite-user.dto';
import { DeleteExpiredInvitesService } from '../../services/delete-expired-invites/delete-expired-invites.service';
import { DeleteInvitesService } from '../../services/delete-invites/delete-invites.service';
import { InviteUsersService } from '../../services/invite-users/invite-users.service';
import { DeleteInviteDto } from './../../dto/delete-invite.dto';

@ApiTags('invites')
@Controller('invites')
export class InvitesController {
  constructor(
    private readonly inviteUsersService: InviteUsersService,
    private readonly deleteInvitesService: DeleteInvitesService,
    private readonly deleteExpiredInvitesService: DeleteExpiredInvitesService,
  ) {}

  @Post()
  @Permissions({
    code: Permission.INVITE_USER,
    checkCompany: true,
  })
  async invite(@Body() inviteUserDto: InviteUserDto) {
    return classToClass(this.inviteUsersService.execute(inviteUserDto));
  }

  @Delete()
  @Permissions({
    code: Permission.INVITE_USER,
    checkCompany: true,
  })
  async delete(@Query() deleteInviteDto: DeleteInviteDto) {
    return classToClass(this.deleteInvitesService.execute(deleteInviteDto));
  }

  @Delete('expired')
  @ApiBearerAuth()
  deleteAll() {
    return this.deleteExpiredInvitesService.execute();
  }
}
