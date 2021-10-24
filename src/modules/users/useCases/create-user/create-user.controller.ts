import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { classToClass } from 'class-transformer';

import { CreateUserDto } from '../../dto/create-user.dto';
import { CreateUserService } from './create-user.service';

@Controller('users')
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @ApiBearerAuth()
  @ApiTags('users')
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return classToClass(this.createUserService.create(createUserDto));
  }
}
