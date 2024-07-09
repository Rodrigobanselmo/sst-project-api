import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Query } from '@nestjs/common';
import { instanceToInstance } from 'class-transformer';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { ErrorInvitesEnum } from '../../../../shared/constants/enum/errorMessage';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { ValidateEmailPipe } from '../../../../shared/pipes/validate-email.pipe';
import { FindInvitesDto, InviteUserDto } from '../../dto/invite-user.dto';
import { DeleteExpiredInvitesService } from '../../services/invites/delete-expired-invites/delete-expired-invites.service';
import { DeleteInvitesService } from '../../services/invites/delete-invites/delete-invites.service';
import { FindAvailableService } from '../../services/invites/find-available/find-available.service';
import { FindAllByCompanyIdService } from '../../services/invites/find-by-companyId/find-by-companyId.service';
import { FindAllByEmailService } from '../../services/invites/find-by-email/find-by-email.service';
import { FindByTokenService } from '../../services/invites/find-by-token/find-by-token.service';
import { InviteUsersService } from '../../services/invites/invite-users/invite-users.service';

@Controller('invites')
export class InvitesController {
  constructor(
    private readonly inviteUsersService: InviteUsersService,
    private readonly findAllByCompanyIdService: FindAllByCompanyIdService,
    private readonly findAllByEmailService: FindAllByEmailService,
    private readonly findAvailableService: FindAvailableService,
    private readonly findByTokenService: FindByTokenService,
    private readonly deleteInvitesService: DeleteInvitesService,
    private readonly deleteExpiredInvitesService: DeleteExpiredInvitesService,
  ) {}

  @Permissions({
    code: PermissionEnum.USER,
    isMember: true,
    isContract: true,
  })
  @Get('/:companyId?')
  async findAllByCompany(@User() user: UserPayloadDto) {
    return instanceToInstance(this.findAllByCompanyIdService.execute(user.targetCompanyId));
  }

  @Get('/me/:email')
  async findAllByEmail(@Param('email', ValidateEmailPipe) email: string, @User() user: UserPayloadDto) {
    if (user.email !== email) throw new ForbiddenException(ErrorInvitesEnum.FORBIDDEN_ACCESS_USER_INVITE_LIST);
    return instanceToInstance(this.findAllByEmailService.execute(email));
  }

  @Get('/token/:tokenId')
  async findByToken(@Param('tokenId') tokenId: string) {
    return instanceToInstance(this.findByTokenService.execute(tokenId));
  }

  @Get()
  async find(@User() user: UserPayloadDto, @Query() query: FindInvitesDto) {
    return instanceToInstance(this.findAvailableService.execute(query, user));
  }

  @Permissions({
    code: PermissionEnum.USER,
    isMember: true,
    isContract: true,
    crud: true,
  })
  @Post()
  async invite(@Body() inviteUserDto: InviteUserDto, @User() user: UserPayloadDto) {
    return instanceToInstance(this.inviteUsersService.execute(inviteUserDto, user));
  }

  @Permissions({
    code: PermissionEnum.USER,
    isMember: true,
    crud: true,
    isContract: true,
  })
  @Delete('/:id/:companyId?')
  async delete(@Param('id') id: string, @User() user: UserPayloadDto) {
    await this.deleteInvitesService.execute({
      id,
      companyId: user.targetCompanyId,
    });

    return id;
  }

  @Delete('expired')
  deleteAll() {
    return this.deleteExpiredInvitesService.execute();
  }
}
