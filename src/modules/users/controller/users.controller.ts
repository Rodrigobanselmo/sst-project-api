import { ValidateEmailPipe } from './../../../shared/pipes/validate-email.pipe';
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
import { Public } from '../../../shared/decorators/public.decorator';

import { CreateUserDto } from '../dto/create-user.dto';
import { ResetPasswordDto } from '../dto/reset-pass';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUserService } from '../services/create-user/create-user.service';
import { FindByEmailService } from '../services/find-by-email/find-by-email.service';
import { FindByIdService } from '../services/find-by-id/find-by-id.service';
import { ResetPasswordService } from '../services/reset-password/reset-password.service';
import { UpdateUserService } from '../services/update-user/update-user.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly resetPasswordService: ResetPasswordService,
    private readonly updateUserService: UpdateUserService,
    private readonly findByEmailService: FindByEmailService,
    private readonly findByIdService: FindByIdService,
  ) {}

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

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return classToClass(this.updateUserService.execute(+id, updateUserDto));
  }

  @Public()
  @Patch('reset-password')
  async reset(@Body() resetPasswordDto: ResetPasswordDto) {
    return classToClass(this.resetPasswordService.execute(resetPasswordDto));
  }
}
