import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { classToClass } from 'class-transformer';
import { SessionService } from '../../../../modules/auth/services/session/session.service';

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

@ApiTags('users')
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
  ) {}

  @Get('me')
  findMe(@User() userPayloadDto: UserPayloadDto) {
    return classToClass(
      this.findMeService.execute(
        userPayloadDto.userId,
        userPayloadDto.companyId,
      ),
    );
  }

  @Get(':id')
  findId(@Param('id', ParseIntPipe) id: number) {
    return classToClass(this.findByIdService.execute(+id));
  }

  @Get()
  findEmail(@Query('email', ValidateEmailPipe) email: string) {
    return classToClass(this.findByEmailService.execute(email));
  }

  @Get('/company/:companyId?')
  findAllByCompany(@User() user: UserPayloadDto) {
    return classToClass(this.findAllByCompanyService.execute(user));
  }

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    await this.createUserService.execute(createUserDto);

    return this.sessionService.execute(createUserDto);
  }

  @Patch()
  update(
    @Body() updateUserDto: UpdateUserDto,
    @User() { userId }: UserPayloadDto,
  ) {
    return classToClass(this.updateUserService.execute(+userId, updateUserDto));
  }

  @Patch('/company')
  async updatePermissionsRoles(
    @Body() updateUserCompanyDto: UpdateUserCompanyDto,
  ) {
    return classToClass(
      this.updatePermissionsRolesService.execute(updateUserCompanyDto),
    );
  }

  @Public()
  @Patch('reset-password')
  async reset(@Body() resetPasswordDto: ResetPasswordDto) {
    return classToClass(this.resetPasswordService.execute(resetPasswordDto));
  }
}
