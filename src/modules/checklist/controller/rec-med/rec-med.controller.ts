import { Body, Controller, Post } from '@nestjs/common';
import { Permission } from 'src/shared/constants/enum/authorization';
import { User } from 'src/shared/decorators/user.decorator';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';

import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { CreateRecMedService } from '../../services/rec-med/create-rec-med/create-rec-med.service';
import { CreateRecMedDto } from './../../dto/create-rec-med.dto';

@Controller('rec-med')
export class RecMedController {
  constructor(private readonly createRecMedService: CreateRecMedService) {}

  @Post()
  @Permissions({
    code: Permission.CREATE_RISK,
    isMember: true,
    isContract: true,
  })
  create(
    @User() userPayloadDto: UserPayloadDto,
    @Body() createRecMedDto: CreateRecMedDto,
  ) {
    return this.createRecMedService.execute(createRecMedDto, userPayloadDto);
  }
}
