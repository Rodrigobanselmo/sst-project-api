import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateAbsenteeismDto, FindAbsenteeismDto, UpdateAbsenteeismDto } from '../../dto/absenteeism.dto';
import { CreateAbsenteeismsService } from '../../services/absenteeism/create-absenteeism/create-absenteeism.service';
import { DeleteAbsenteeismsService } from '../../services/absenteeism/delete-absenteeism/delete-absenteeism.service';
import { FindAbsenteeismsService } from '../../services/absenteeism/find-absenteeism/find-absenteeism.service';
import { FindOneAbsenteeismsService } from '../../services/absenteeism/find-one-absenteeism/find-one-absenteeism.service';
import { UpdateAbsenteeismsService } from '../../services/absenteeism/update-absenteeism/update-absenteeism.service';

@Controller('absenteeism')
export class AbsenteeismController {
  constructor(
    private readonly updateAbsenteeismsService: UpdateAbsenteeismsService,
    private readonly createAbsenteeismsService: CreateAbsenteeismsService,
    private readonly findAvailableAbsenteeismsService: FindAbsenteeismsService,
    private readonly findOneAbsenteeismsService: FindOneAbsenteeismsService,
    private readonly deleteAbsenteeismsService: DeleteAbsenteeismsService,
  ) {}

  @Permissions({
    code: PermissionEnum.ABSENTEEISM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Get('/:companyId/:id')
  findOne(@User() userPayloadDto: UserPayloadDto, @Param('id', ParseIntPipe) id: number) {
    return this.findOneAbsenteeismsService.execute(id, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.ABSENTEEISM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Get('/:companyId')
  find(@User() userPayloadDto: UserPayloadDto, @Query() query: FindAbsenteeismDto) {
    return this.findAvailableAbsenteeismsService.execute(query, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.ABSENTEEISM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Post('/:companyId')
  create(@Body() upsertAccessGroupDto: CreateAbsenteeismDto, @User() userPayloadDto: UserPayloadDto) {
    return this.createAbsenteeismsService.execute(upsertAccessGroupDto, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.ABSENTEEISM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Patch('/:companyId/:id')
  update(
    @Body() upsertAccessGroupDto: UpdateAbsenteeismDto,
    @User() userPayloadDto: UserPayloadDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.updateAbsenteeismsService.execute({ ...upsertAccessGroupDto, id }, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.ABSENTEEISM,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Delete('/:companyId/:id')
  delete(@User() userPayloadDto: UserPayloadDto, @Param('id', ParseIntPipe) id: number) {
    return this.deleteAbsenteeismsService.execute(id, userPayloadDto);
  }
}
