import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { classToClass } from 'class-transformer';
import { ValidateEmailPipe } from 'src/shared/pipes/validate-email.pipe';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { InviteUserDto } from '../../dto/invite-user.dto';
import { DeleteExpiredInvitesService } from '../../services/invites/delete-expired-invites/delete-expired-invites.service';
import { DeleteInvitesService } from '../../services/invites/delete-invites/delete-invites.service';
import { FindAllByCompanyIdService } from '../../services/invites/find-by-companyId/find-by-companyId.service';
import { FindAllByEmailService } from '../../services/invites/find-by-email/find-by-email.service';
import { InviteUsersService } from '../../services/invites/invite-users/invite-users.service';
import { DeleteInviteDto } from './../../dto/delete-invite.dto';

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

  @Get('/:email')
  async findAllByEmail(@Param('email', ValidateEmailPipe) email: string) {
    return classToClass(this.findAllByEmailService.execute(email));
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
