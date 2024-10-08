import { UserAgent } from './../../../../shared/decorators/userAgent.decorator';
import { Body, Controller, Get, Ip, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { instanceToInstance } from 'class-transformer';
import { SessionService } from '../../../auth/services/session/session/session.service';

import { Public } from '../../../../shared/decorators/public.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { ValidateEmailPipe } from '../../../../shared/pipes/validate-email.pipe';
import { CreateUserDto } from '../../dto/create-user.dto';
import { ResetPasswordDto } from '../../dto/reset-pass';
import { UpdateUserCompanyDto } from '../../dto/update-user-company.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { CreateUserService } from '../../services/users/create-user/create-user.service';
import { FindAllByCompanyService } from '../../services/users/find-all/find-all.service';
import { FindByEmailService } from '../../services/users/find-by-email/find-by-email.service';
import { FindByIdService } from '../../services/users/find-by-id/find-by-id.service';
import { FindMeService } from '../../services/users/find-me/find-me.service';
import { ResetPasswordService } from '../../services/users/reset-password/reset-password.service';
import { UpdatePermissionsRolesService } from '../../services/users/update-permissions-roles/update-permissions-roles.service';
import { UpdateUserService } from '../../services/users/update-user/update-user.service';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { v4 } from 'uuid';
import { FindUserHistoryDto } from '../../dto/user-history.dto';
import { FindUserHistorysService } from '../../services/user-history/find-user-history/find-user-history.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly resetPasswordService: ResetPasswordService,
    private readonly updateUserService: UpdateUserService,
    private readonly findMeService: FindMeService,
    private readonly findByEmailService: FindByEmailService,
    private readonly findAllByCompanyService: FindAllByCompanyService,
    private readonly findByIdService: FindByIdService,
    private readonly sessionService: SessionService,
    private readonly updatePermissionsRolesService: UpdatePermissionsRolesService,
    private readonly findUserHistorysService: FindUserHistorysService,
  ) {}

  @Get('me')
  async findMe(@User() userPayloadDto: UserPayloadDto) {
    return instanceToInstance(this.findMeService.execute(userPayloadDto.userId, userPayloadDto.companyId));
  }

  @Permissions({
    code: PermissionEnum.USER,
    isMember: true,
    isContract: true,
    crud: true,
  })
  @Get('/company/:companyId/:id')
  findId(@Param('id', ParseIntPipe) id: number, @User() user: UserPayloadDto) {
    return instanceToInstance(this.findByIdService.execute(+id, user.targetCompanyId));
  }

  @Permissions({
    code: PermissionEnum.USER,
  })
  @Get()
  findEmail(@Query('email', ValidateEmailPipe) email: string) {
    return instanceToInstance(this.findByEmailService.execute(email));
  }

  @Permissions({
    code: PermissionEnum.USER,
    isMember: true,
    isContract: true,
  })
  @Get('/company/:companyId?')
  findAllByCompany(@User() user: UserPayloadDto) {
    return instanceToInstance(this.findAllByCompanyService.execute(user));
  }

  @Permissions({
    code: PermissionEnum.USER,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Get('/history/:companyId')
  @Get()
  find(@User() userPayloadDto: UserPayloadDto, @Query() query: FindUserHistoryDto) {
    return this.findUserHistorysService.execute(
      { ...query, companyId: userPayloadDto.targetCompanyId },
      userPayloadDto,
    );
  }

  @Get('me/history')
  async findMeHistory(@User() userPayloadDto: UserPayloadDto, @Query() query: FindUserHistoryDto) {
    return this.findUserHistorysService.execute(
      {
        ...query,
        companyId: userPayloadDto.targetCompanyId,
        userId: userPayloadDto.userId,
      },
      userPayloadDto,
    );
  }

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Ip() ip: string, @UserAgent() userAgent: string) {
    if (!createUserDto.password) createUserDto.password = v4();

    await this.createUserService.execute(createUserDto);

    return this.sessionService.execute(createUserDto, ip, userAgent);
  }

  @Patch()
  update(@Body() updateUserDto: UpdateUserDto, @User() { userId }: UserPayloadDto) {
    return instanceToInstance(this.updateUserService.execute(+userId, updateUserDto));
  }

  @Permissions({
    code: PermissionEnum.USER,
    isMember: true,
    isContract: true,
    crud: true,
  })
  @Patch('/company/:companyId/:id')
  async updateAll(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: UserPayloadDto,
  ) {
    return instanceToInstance(
      this.updateUserService.execute(id, {
        ...updateUserDto,
        skipPassCheck: true,
        companyId: user.targetCompanyId,
      }),
    );
  }

  @Permissions({
    code: PermissionEnum.USER,
    isMember: true,
    isContract: true,
    crud: true,
  })
  @Patch('/company')
  async updatePermissionsRoles(@Body() updateUserCompanyDto: UpdateUserCompanyDto, @User() user: UserPayloadDto) {
    return instanceToInstance(this.updatePermissionsRolesService.execute(updateUserCompanyDto, user));
  }

  @Public()
  @Patch('reset-password')
  async reset(@Body() resetPasswordDto: ResetPasswordDto) {
    return instanceToInstance(this.resetPasswordService.execute(resetPasswordDto));
  }
}
