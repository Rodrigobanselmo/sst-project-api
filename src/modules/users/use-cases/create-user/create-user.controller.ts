import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { classToClass } from 'class-transformer';
import { Public } from '../../../../shared/decorators/public.decorator';

import { CreateUserDto } from '../../dto/create-user.dto';
import { UserEntity } from '../../entities/user.entity';
import { CreateUserService } from './create-user.service';

@Controller('users')
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Public()
  @ApiTags('users')
  @ApiCreatedResponse({ type: classToClass(UserEntity) })
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return classToClass(this.createUserService.execute(createUserDto));
  }
}
