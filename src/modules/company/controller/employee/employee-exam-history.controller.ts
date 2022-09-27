import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import {
  CreateEmployeeExamHistoryDto,
  FindClinicEmployeeExamHistoryDto,
  FindCompanyEmployeeExamHistoryDto,
  FindEmployeeExamHistoryDto,
  UpdateEmployeeExamHistoryDto,
  UpdateManyScheduleExamDto,
} from '../../dto/employee-exam-history';

import { CreateEmployeeExamHistoryService } from '../../services/employee/0-history/exams/create/create.service';
import { DeleteEmployeeExamHistoryService } from '../../services/employee/0-history/exams/delete/delete.service';
import { FindScheduleEmployeeExamHistoryService } from '../../services/employee/0-history/exams/find-schedule/find-schedule.service';
import { FindByIdEmployeeExamHistoryService } from '../../services/employee/0-history/exams/find-by-id/find-by-id.service';
import { FindEmployeeExamHistoryService } from '../../services/employee/0-history/exams/find/find.service';
import { UpdateEmployeeExamHistoryService } from '../../services/employee/0-history/exams/update/update.service';
import { UpdateManyScheduleExamHistoryService } from '../../services/employee/0-history/exams/update-many/update-many.service';
import { FindClinicScheduleEmployeeExamHistoryService } from '../../services/employee/0-history/exams/find-clinic-schedules/find-clinic-schedules.service';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import {
  PermissionEnum,
  RoleEnum,
} from '../../../../shared/constants/enum/authorization';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { FindCompanyScheduleEmployeeExamHistoryService } from '../../services/employee/0-history/exams/find-company-schedules/find-company-schedules.service';

@ApiTags('employee-history-exam')
@Controller('employee-history/exam')
export class EmployeeExamHistoryController {
  constructor(
    private readonly createEmployeeExamHistoryService: CreateEmployeeExamHistoryService,
    private readonly updateEmployeeExamHistoryService: UpdateEmployeeExamHistoryService,
    private readonly findEmployeeExamHistoryService: FindEmployeeExamHistoryService,
    private readonly findAskEmployeeExamHistoryService: FindScheduleEmployeeExamHistoryService,
    private readonly findClinicScheduleEmployeeExamHistoryService: FindClinicScheduleEmployeeExamHistoryService,
    private readonly findCompanyScheduleEmployeeExamHistoryService: FindCompanyScheduleEmployeeExamHistoryService,
    private readonly findByIdEmployeeExamHistoryService: FindByIdEmployeeExamHistoryService,
    private readonly deleteEmployeeExamHistoryService: DeleteEmployeeExamHistoryService,
    private readonly updateManyScheduleExamHistoryService: UpdateManyScheduleExamHistoryService,
  ) {}

  @Permissions(
    {
      code: PermissionEnum.EMPLOYEE_HISTORY,
      isContract: true,
      isMember: true,
      crud: true,
    },
    {
      code: PermissionEnum.COMPANY_SCHEDULE,
      isContract: true,
      isMember: true,
      crud: true,
    },
  )
  @Get()
  find(
    @User() userPayloadDto: UserPayloadDto,
    @Query() query: FindEmployeeExamHistoryDto,
  ) {
    return this.findEmployeeExamHistoryService.execute(query, userPayloadDto);
  }

  @Permissions(
    {
      code: PermissionEnum.EMPLOYEE_HISTORY,
      isContract: true,
      isMember: true,
      crud: true,
    },
    {
      code: PermissionEnum.COMPANY_SCHEDULE,
      isContract: true,
      isMember: true,
      crud: true,
    },
  )
  @Get('schedule')
  findSchedule(
    @User() userPayloadDto: UserPayloadDto,
    @Query() query: FindEmployeeExamHistoryDto,
  ) {
    return this.findAskEmployeeExamHistoryService.execute(
      query,
      userPayloadDto,
    );
  }

  @Permissions(
    {
      code: PermissionEnum.EMPLOYEE_HISTORY,
      isContract: true,
      isMember: true,
      crud: true,
    },
    {
      code: PermissionEnum.COMPANY_SCHEDULE,
      isContract: true,
      isMember: true,
      crud: true,
    },
  )
  @Get('schedule/company')
  findCompanySchedule(
    @User() userPayloadDto: UserPayloadDto,
    @Query() query: FindCompanyEmployeeExamHistoryDto,
  ) {
    return this.findCompanyScheduleEmployeeExamHistoryService.execute(
      query,
      userPayloadDto,
    );
  }

  @Permissions(
    {
      code: PermissionEnum.EMPLOYEE_HISTORY,
      isContract: true,
      isMember: true,
      crud: true,
    },
    {
      code: PermissionEnum.COMPANY_SCHEDULE,
      isContract: true,
      isMember: true,
      crud: true,
    },
    {
      code: PermissionEnum.CLINIC_SCHEDULE,
      isContract: true,
      isMember: true,
      crud: true,
    },
  )
  @Get('schedule/clinic')
  findClinicSchedule(
    @User() userPayloadDto: UserPayloadDto,
    @Query() query: FindClinicEmployeeExamHistoryDto,
  ) {
    return this.findClinicScheduleEmployeeExamHistoryService.execute(
      query,
      userPayloadDto,
    );
  }

  @Permissions(
    {
      code: PermissionEnum.EMPLOYEE_HISTORY,
      isContract: true,
      isMember: true,
      crud: true,
    },
    {
      code: PermissionEnum.COMPANY_SCHEDULE,
      isContract: true,
      isMember: true,
      crud: true,
    },
  )
  @Get('/:id/:companyId')
  findById(
    @User() userPayloadDto: UserPayloadDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.findByIdEmployeeExamHistoryService.execute(id, userPayloadDto);
  }

  @Permissions(
    {
      code: PermissionEnum.EMPLOYEE_HISTORY,
      isContract: true,
      isMember: true,
      crud: true,
    },
    {
      code: PermissionEnum.COMPANY_SCHEDULE,
      isContract: true,
      isMember: true,
      crud: true,
    },
  )
  @Post('/:companyId?')
  create(
    @Body() upsertAccessGroupDto: CreateEmployeeExamHistoryDto,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.createEmployeeExamHistoryService.execute(
      upsertAccessGroupDto,
      userPayloadDto,
    );
  }

  @Permissions(
    {
      code: PermissionEnum.EMPLOYEE_HISTORY,
      isContract: true,
      isMember: true,
      crud: true,
    },
    {
      code: PermissionEnum.COMPANY_SCHEDULE,
      isContract: true,
      isMember: true,
      crud: true,
    },
  )
  @Post('/schedule/:companyId?')
  createSchedule(
    @Body() upsertAccessGroupDto: CreateEmployeeExamHistoryDto,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.createEmployeeExamHistoryService.execute(
      upsertAccessGroupDto,
      userPayloadDto,
    );
  }

  @Permissions(
    {
      code: PermissionEnum.EMPLOYEE_HISTORY,
      isContract: true,
      isMember: true,
      crud: true,
    },
    {
      code: PermissionEnum.CLINIC_SCHEDULE,
      isMember: true,
    },
  )
  @Post('/update-many-schedule/:companyId?')
  updateSchedule(
    @Body() upsertAccessGroupDto: UpdateManyScheduleExamDto,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.updateManyScheduleExamHistoryService.execute(
      upsertAccessGroupDto,
      userPayloadDto,
    );
  }

  @Permissions({
    code: PermissionEnum.EMPLOYEE_HISTORY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Patch('/:id/:companyId?')
  update(
    @Body() upsertAccessGroupDto: UpdateEmployeeExamHistoryDto,
    @User() userPayloadDto: UserPayloadDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.updateEmployeeExamHistoryService.execute(
      { ...upsertAccessGroupDto, id },
      userPayloadDto,
    );
  }

  @Permissions({
    code: PermissionEnum.EMPLOYEE_HISTORY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Delete('/:employeeId/:id/:companyId?')
  delete(
    @User() userPayloadDto: UserPayloadDto,
    @Param('id', ParseIntPipe) id: number,
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ) {
    return this.deleteEmployeeExamHistoryService.execute(
      id,
      employeeId,
      userPayloadDto,
    );
  }
}
