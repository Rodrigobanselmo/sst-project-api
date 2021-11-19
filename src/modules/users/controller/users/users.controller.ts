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
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';

import { Public } from '../../../../shared/decorators/public.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { ValidateEmailPipe } from '../../../../shared/pipes/validate-email.pipe';
import { CreateUserDto } from '../../dto/create-user.dto';
import { ResetPasswordDto } from '../../dto/reset-pass';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { CreateUserService } from '../../services/users/create-user/create-user.service';
import { FindByEmailService } from '../../services/users/find-by-email/find-by-email.service';
import { FindByIdService } from '../../services/users/find-by-id/find-by-id.service';
import { FindMeService } from '../../services/users/find-me/find-me.service';
import { ResetPasswordService } from '../../services/users/reset-password/reset-password.service';
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
  ) {}

  @Get('me')
  findMe(@User() userPayloadDto: UserPayloadDto) {
    return classToClass(this.findMeService.execute(userPayloadDto.userId));
  }

  @Get(':id')
  findId(@Param('id', ParseIntPipe) id: number) {
    return classToClass(this.findByIdService.execute(+id));
  }

  @Get()
  findEmail(@Query('email', ValidateEmailPipe) email: string) {
    return classToClass(this.findByEmailService.execute(email));
  }

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return classToClass(this.createUserService.execute(createUserDto));
  }

  @Patch()
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @User() { userId }: UserPayloadDto,
  ) {
    return classToClass(this.updateUserService.execute(+userId, updateUserDto));
  }

  @Public()
  @Patch('reset-password')
  async reset(@Body() resetPasswordDto: ResetPasswordDto) {
    return classToClass(this.resetPasswordService.execute(resetPasswordDto));
  }
}
