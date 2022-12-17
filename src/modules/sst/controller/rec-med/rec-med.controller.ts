import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateRecMedDto, FindRecMedDto, UpdateRecMedDto } from '../../dto/rec-med.dto';
import { CreateRecMedService } from '../../services/rec-med/create-rec-med/create-rec-med.service';
import { DeleteSoftRecMedService } from '../../services/rec-med/delete-soft-rec-med/delete-soft-rec-med.service';
import { UpdateRecMedService } from '../../services/rec-med/update-rec-med/update-rec-med.service';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { FindRecMedService } from '../../services/rec-med/find-rec-med/find-rec-med.service';
@Controller('rec-med')
export class RecMedController {
  constructor(
    private readonly createRecMedService: CreateRecMedService,
    private readonly updateRecMedService: UpdateRecMedService,
    private readonly deleteSoftRecMedService: DeleteSoftRecMedService,
    private readonly findRecMedService: FindRecMedService,
  ) {}

  @Permissions({
    code: PermissionEnum.REC_MED,
    crud: true,
    isMember: true,
  })
  @Post()
  create(@User() userPayloadDto: UserPayloadDto, @Body() createRecMedDto: CreateRecMedDto) {
    return this.createRecMedService.execute(createRecMedDto, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.REC_MED,
    crud: true,
    isMember: true,
    isContract: true,
  })
  @Get('/:companyId?')
  find(@User() userPayloadDto: UserPayloadDto, @Query() query: FindRecMedDto) {
    return this.findRecMedService.execute(query, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.REC_MED,
    crud: true,
    isMember: true,
  })
  @Patch('/:recMedId')
  async update(@Param('recMedId') recMedId: string, @User() userPayloadDto: UserPayloadDto, @Body() updateRiskDto: UpdateRecMedDto) {
    return this.updateRecMedService.execute(recMedId, updateRiskDto, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.REC_MED,
    crud: true,
    isMember: true,
  })
  @Delete('/:recMedId')
  async deleteSoft(@Param('recMedId') recMedId: string, @User() userPayloadDto: UserPayloadDto) {
    return this.deleteSoftRecMedService.execute(recMedId, userPayloadDto);
  }
}
