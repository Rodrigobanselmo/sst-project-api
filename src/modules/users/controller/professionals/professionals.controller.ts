import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { classToClass } from 'class-transformer';

import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { FindAllProfessionalsByCompanyService } from '../../services/professionals/find-all/find-all.service';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import {
  PermissionEnum,
  RoleEnum,
} from '../../../../shared/constants/enum/authorization';
import { Roles } from '../../../../shared/decorators/roles.decorator';

@ApiTags('professionals')
@Controller('professionals')
export class ProfessionalsController {
  constructor(
    private readonly findAllByCompanyService: FindAllProfessionalsByCompanyService,
  ) {}

  @Permissions({
    code: PermissionEnum.USER,
    isMember: true,
    isContract: true,
  })
  @Get('/company/:companyId?')
  findAllByCompany(@User() user: UserPayloadDto) {
    return classToClass(this.findAllByCompanyService.execute(user));
  }

  // @Public()
  // @Post()
  // async create(@Body() createUserDto: CreateUserDto) {
  //   await this.createUserService.execute(createUserDto);

  //   return this.sessionService.execute(createUserDto);
  // }
}
