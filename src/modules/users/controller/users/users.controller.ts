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
import { instanceToInstance } from 'class-transformer';

import { Public } from '../../../../shared/decorators/public.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { ValidateEmailPipe } from '../../../../shared/pipes/validate-email.pipe';
import { CreateUserDto } from '../../dto/create-user.dto';
import { ResetPasswordDto } from '../../dto/reset-pass';
import { UpdateUserCompanyDto } from '../../dto/update-user-company.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { CreateUserService } from '../../services/users/create-user/create-user.service';
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
    private readonly findByIdService: FindByIdService,
    private readonly updatePermissionsRolesService: UpdatePermissionsRolesService,
  ) {}

  @Get('me')
  findMe(@User() userPayloadDto: UserPayloadDto) {
    return instanceToInstance(
      this.findMeService.execute(
        userPayloadDto.userId,
        userPayloadDto.companyId,
      ),
    );
  }

  @Get(':id')
  findId(@Param('id', ParseIntPipe) id: number) {
    return instanceToInstance(this.findByIdService.execute(+id));
  }

  @Get()
  findEmail(@Query('email', ValidateEmailPipe) email: string) {
    return instanceToInstance(this.findByEmailService.execute(email));
  }

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return instanceToInstance(this.createUserService.execute(createUserDto));
  }

  @Patch('update')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @User() { userId }: UserPayloadDto,
  ) {
    return instanceToInstance(
      this.updateUserService.execute(+userId, updateUserDto),
    );
  }

  @Patch('update/authorization')
  async updatePermissionsRoles(
    @Body() updateUserCompanyDto: UpdateUserCompanyDto,
  ) {
    return instanceToInstance(
      this.updatePermissionsRolesService.execute(updateUserCompanyDto),
    );
  }

  @Public()
  @Patch('reset-password')
  async reset(@Body() resetPasswordDto: ResetPasswordDto) {
    return instanceToInstance(
      this.resetPasswordService.execute(resetPasswordDto),
    );
  }
}
