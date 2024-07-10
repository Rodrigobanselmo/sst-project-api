import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';

import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { PermissionEnum, RoleEnum } from '../../../../shared/constants/enum/authorization';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { UpdateScheduleMedicalVisitsService } from '../../services/scheduleMedicalVisit/update-schedule-medical-visit/update-schedule-medical-visit.service';
import { CreateScheduleMedicalVisitsService } from '../../services/scheduleMedicalVisit/create-schedule-medical-visit/create-schedule-medical-visit.service';
import { FindScheduleMedicalVisitsService } from '../../services/scheduleMedicalVisit/find-schedule-medical-visit/find-schedule-medical-visit.service';
import { DeleteScheduleMedicalVisitsService } from '../../services/scheduleMedicalVisit/delete-schedule-medical-visit/delete-schedule-medical-visit.service';
import {
  CreateScheduleMedicalVisitDto,
  FindScheduleMedicalVisitDto,
  UpdateScheduleMedicalVisitDto,
} from '../../dto/scheduleMedicalVisit.dto';
import { FindOneScheduleMedicalVisitsService } from '../../services/scheduleMedicalVisit/find-one-schedule-medical-visit/find-one-schedule-medical-visit.service';

@Controller('company/:companyId/schedule-medical-visit')
export class ScheduleMedicalVisitController {
  constructor(
    private readonly updateScheduleMedicalVisitsService: UpdateScheduleMedicalVisitsService,
    private readonly createScheduleMedicalVisitsService: CreateScheduleMedicalVisitsService,
    private readonly findAvailableScheduleMedicalVisitsService: FindScheduleMedicalVisitsService,
    private readonly deleteScheduleMedicalVisitsService: DeleteScheduleMedicalVisitsService,
    private readonly findOneScheduleMedicalVisitsService: FindOneScheduleMedicalVisitsService,
  ) {}

  @Permissions({
    code: PermissionEnum.SCHEDULE_MEDICAL_VISIT,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Get()
  find(@User() userPayloadDto: UserPayloadDto, @Query() query: FindScheduleMedicalVisitDto) {
    return this.findAvailableScheduleMedicalVisitsService.execute(query, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.SCHEDULE_MEDICAL_VISIT,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Get('/:id')
  findOne(@User() userPayloadDto: UserPayloadDto, @Param('id', ParseIntPipe) id: number) {
    return this.findOneScheduleMedicalVisitsService.execute(id, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.SCHEDULE_MEDICAL_VISIT,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Post()
  create(@Body() upsertAccessGroupDto: CreateScheduleMedicalVisitDto, @User() userPayloadDto: UserPayloadDto) {
    return this.createScheduleMedicalVisitsService.execute(upsertAccessGroupDto, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.SCHEDULE_MEDICAL_VISIT,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Patch('/:id')
  update(
    @Body() upsertAccessGroupDto: UpdateScheduleMedicalVisitDto,
    @User() userPayloadDto: UserPayloadDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.updateScheduleMedicalVisitsService.execute({ ...upsertAccessGroupDto, id }, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.SCHEDULE_MEDICAL_VISIT,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Delete('/:id')
  delete(@User() userPayloadDto: UserPayloadDto, @Param('id', ParseIntPipe) id: number) {
    return this.deleteScheduleMedicalVisitsService.execute(id, userPayloadDto);
  }
}
