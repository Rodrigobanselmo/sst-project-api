import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { classToClass } from 'class-transformer';
import { User } from 'src/shared/decorators/user.decorator';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { InviteUserDto } from '../../dto/invite-user.dto';
import { DeleteExpiredInvitesService } from '../../services/invites/delete-expired-invites/delete-expired-invites.service';
import { DeleteInvitesService } from '../../services/invites/delete-invites/delete-invites.service';
import { FindAllByCompanyIdService } from '../../services/invites/find-by-companyId/find-by-companyId.service';
import { InviteUsersService } from '../../services/invites/invite-users/invite-users.service';
import { DeleteInviteDto } from './../../dto/delete-invite.dto';

@ApiTags('invites')
@Controller('invites')
export class InvitesController {
  constructor(
    private readonly inviteUsersService: InviteUsersService,
    private readonly findAllByCompanyIdService: FindAllByCompanyIdService,
    private readonly deleteInvitesService: DeleteInvitesService,
    private readonly deleteExpiredInvitesService: DeleteExpiredInvitesService,
  ) {}

  @Get('/:companyId?')
  async findAllByCompany(@User() user: UserPayloadDto) {
    return classToClass(
      this.findAllByCompanyIdService.execute(user.targetCompanyId),
    );
  }

  @Post()
  @Permissions({
    code: PermissionEnum.INVITE_USER,
    isMember: true,
    isContract: true,
  })
  async invite(@Body() inviteUserDto: InviteUserDto) {
    return classToClass(this.inviteUsersService.execute(inviteUserDto));
  }

  @Delete()
  @Permissions({
    code: PermissionEnum.INVITE_USER,
    isMember: true,
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
