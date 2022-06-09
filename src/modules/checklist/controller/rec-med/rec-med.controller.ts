import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';

import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateRecMedDto, UpdateRecMedDto } from '../../dto/rec-med.dto';
import { CreateRecMedService } from '../../services/rec-med/create-rec-med/create-rec-med.service';
import { DeleteSoftRecMedService } from '../../services/rec-med/delete-soft-rec-med/delete-soft-rec-med.service';
import { UpdateRecMedService } from '../../services/rec-med/update-rec-med/update-rec-med.service';

@Controller('rec-med')
export class RecMedController {
  constructor(
    private readonly createRecMedService: CreateRecMedService,
    private readonly updateRecMedService: UpdateRecMedService,
    private readonly deleteSoftRecMedService: DeleteSoftRecMedService,
  ) {}

  @Post()
  create(
    @User() userPayloadDto: UserPayloadDto,
    @Body() createRecMedDto: CreateRecMedDto,
  ) {
    return this.createRecMedService.execute(createRecMedDto, userPayloadDto);
  }

  @Patch('/:recMedId')
  async update(
    @Param('recMedId') recMedId: string,
    @User() userPayloadDto: UserPayloadDto,
    @Body() updateRiskDto: UpdateRecMedDto,
  ) {
    return this.updateRecMedService.execute(
      recMedId,
      updateRiskDto,
      userPayloadDto,
    );
  }

  @Delete('/:recMedId')
  async deleteSoft(
    @Param('recMedId') recMedId: string,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.deleteSoftRecMedService.execute(recMedId, userPayloadDto);
  }
}
