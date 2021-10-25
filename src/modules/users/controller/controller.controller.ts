import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { classToClass } from 'class-transformer';
import { Public } from 'src/shared/decorators/public.decorator';

import { CreateUserDto } from '../dto/create-user.dto';
import { CreateUserService } from '../services/create-user/create-user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Public()
  @ApiTags('users')
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return classToClass(this.createUserService.execute(createUserDto));
  }
}
