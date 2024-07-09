import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateScheduleBlockDto, FindScheduleBlockDto, UpdateScheduleBlockDto } from '../../dto/schedule-block';
import { CreateScheduleBlocksService } from '../../services/scheduleBlock/create-schedule-block/create-schedule-block.service';
import { DeleteScheduleBlocksService } from '../../services/scheduleBlock/delete-schedule-block/delete-schedule-block.service';
import { FindOneScheduleBlocksService } from '../../services/scheduleBlock/find-one-schedule-block/find-one-schedule-block.service';
import { FindScheduleBlocksService } from '../../services/scheduleBlock/find-schedule-block/find-schedule-block.service';
import { UpdateScheduleBlocksService } from '../../services/scheduleBlock/update-schedule-block/update-schedule-block.service';

@Controller('schedule-block')
export class ScheduleBlockController {
  constructor(
    private readonly updateScheduleBlocksService: UpdateScheduleBlocksService,
    private readonly createScheduleBlocksService: CreateScheduleBlocksService,
    private readonly findAvailableScheduleBlocksService: FindScheduleBlocksService,
    private readonly findOneScheduleBlocksService: FindOneScheduleBlocksService,
    private readonly deleteScheduleBlocksService: DeleteScheduleBlocksService,
  ) {}

  @Permissions({
    code: PermissionEnum.SCHEDULE_BLOCK,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Get('/:companyId/:id')
  findOne(@User() userPayloadDto: UserPayloadDto, @Param('id', ParseIntPipe) id: number) {
    return this.findOneScheduleBlocksService.execute(id, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.SCHEDULE_BLOCK,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Get('/:companyId')
  find(@User() userPayloadDto: UserPayloadDto, @Query() query: FindScheduleBlockDto) {
    return this.findAvailableScheduleBlocksService.execute(query, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.SCHEDULE_BLOCK,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Post('/:companyId')
  create(@Body() upsertAccessGroupDto: CreateScheduleBlockDto, @User() userPayloadDto: UserPayloadDto) {
    return this.createScheduleBlocksService.execute(upsertAccessGroupDto, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.SCHEDULE_BLOCK,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Patch('/:companyId/:id')
  update(@Body() upsertAccessGroupDto: UpdateScheduleBlockDto, @User() userPayloadDto: UserPayloadDto, @Param('id', ParseIntPipe) id: number) {
    return this.updateScheduleBlocksService.execute({ ...upsertAccessGroupDto, id }, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.SCHEDULE_BLOCK,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Delete('/:companyId/:id')
  delete(@User() userPayloadDto: UserPayloadDto, @Param('id', ParseIntPipe) id: number) {
    return this.deleteScheduleBlocksService.execute(id, userPayloadDto);
  }
}
