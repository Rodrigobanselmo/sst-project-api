import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { Permission } from '../../../../shared/constants/enum/authorization';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';

import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { CreateRecMedService } from '../../services/rec-med/create-rec-med/create-rec-med.service';
import { CreateRecMedDto, UpdateRecMedDto } from '../../dto/rec-med.dto';
import { UpdateRecMedService } from '../../services/rec-med/update-rec-med/update-rec-med.service';

@Controller('rec-med')
export class RecMedController {
  constructor(
    private readonly createRecMedService: CreateRecMedService,
    private readonly updateRecMedService: UpdateRecMedService,
  ) {}

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

  @Patch('/:recMedId')
  async update(
    @Param('recMedId') recMedId: number,
    @User() userPayloadDto: UserPayloadDto,
    @Body() updateRiskDto: UpdateRecMedDto,
  ) {
    return this.updateRecMedService.execute(
      recMedId,
      updateRiskDto,
      userPayloadDto,
    );
  }
}
