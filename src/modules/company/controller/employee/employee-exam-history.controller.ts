import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../../../shared/decorators/public.decorator';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import {
  CreateEmployeeExamHistoryDto,
  FindClinicEmployeeExamHistoryDto,
  FindClinicScheduleTimeDto,
  FindCompanyEmployeeExamHistoryDto,
  FindEmployeeExamHistoryDto,
  UpdateEmployeeExamHistoryDto,
  UpdateFileExamDto,
  UpdateManyScheduleExamDto,
} from '../../dto/employee-exam-history';
import { CreateEmployeeExamHistoryService } from '../../services/employee/0-history/exams/create/create.service';
import { DeleteExamFileService } from '../../services/employee/0-history/exams/delete-exam-file/delete-exam-file.service';
import { DeleteEmployeeExamHistoryService } from '../../services/employee/0-history/exams/delete/delete.service';
import { DownloadExamService } from '../../services/employee/0-history/exams/download-exam/download-exam.service';
import { FindByIdEmployeeExamHistoryService } from '../../services/employee/0-history/exams/find-by-id/find-by-id.service';
import { FindClinicScheduleEmployeeExamHistoryService } from '../../services/employee/0-history/exams/find-clinic-schedules/find-clinic-schedules.service';
import { FindClinicScheduleTimeService } from '../../services/employee/0-history/exams/find-clinic-time/find-clinic-time.service';
import { FindCompanyScheduleEmployeeExamHistoryService } from '../../services/employee/0-history/exams/find-company-schedules/find-company-schedules.service';
import { FindScheduleEmployeeExamHistoryService } from '../../services/employee/0-history/exams/find-schedule/find-schedule.service';
import { FindEmployeeExamHistoryService } from '../../services/employee/0-history/exams/find/find.service';
import { UpdateManyScheduleExamHistoryService } from '../../services/employee/0-history/exams/update-many/update-many.service';
import { UpdateEmployeeExamHistoryService } from '../../services/employee/0-history/exams/update/update.service';
import { UploadExamFileService } from '../../services/employee/0-history/exams/upload-exam-file/upload-exam-file.service';

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
    private readonly downloadExamService: DownloadExamService,
    private readonly uploadExamFileService: UploadExamFileService,
    private readonly deleteExamFileService: DeleteExamFileService,
    private readonly findClinicScheduleTimeService: FindClinicScheduleTimeService,
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
  find(@User() userPayloadDto: UserPayloadDto, @Query() query: FindEmployeeExamHistoryDto) {
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
  findSchedule(@User() userPayloadDto: UserPayloadDto, @Query() query: FindEmployeeExamHistoryDto) {
    return this.findAskEmployeeExamHistoryService.execute(query, userPayloadDto);
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
  findCompanySchedule(@User() userPayloadDto: UserPayloadDto, @Query() query: FindCompanyEmployeeExamHistoryDto) {
    return this.findCompanyScheduleEmployeeExamHistoryService.execute(query, userPayloadDto);
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
  findClinicSchedule(@User() userPayloadDto: UserPayloadDto, @Query() query: FindClinicEmployeeExamHistoryDto) {
    return this.findClinicScheduleEmployeeExamHistoryService.execute(query, userPayloadDto);
  }

  @Public()
  @Get('/schedule/clinic/time')
  findScheduleTime(@Query() query: FindClinicScheduleTimeDto) {
    return this.findClinicScheduleTimeService.execute(query);
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
  findById(@User() userPayloadDto: UserPayloadDto, @Param('id', ParseIntPipe) id: number) {
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
  create(@Body() upsertAccessGroupDto: CreateEmployeeExamHistoryDto, @User() userPayloadDto: UserPayloadDto) {
    return this.createEmployeeExamHistoryService.execute(upsertAccessGroupDto, userPayloadDto);
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
  createSchedule(@Body() upsertAccessGroupDto: CreateEmployeeExamHistoryDto, @User() userPayloadDto: UserPayloadDto) {
    return this.createEmployeeExamHistoryService.execute(upsertAccessGroupDto, userPayloadDto);
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
      isContract: true,
      isMember: true,
      crud: true,
    },
  )
  @Post('/update-many-schedule/:companyId?')
  updateSchedule(@Body() upsertAccessGroupDto: UpdateManyScheduleExamDto, @User() userPayloadDto: UserPayloadDto) {
    return this.updateManyScheduleExamHistoryService.execute(upsertAccessGroupDto, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.EMPLOYEE_HISTORY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Patch('/:id/:companyId?')
  update(@Body() upsertAccessGroupDto: UpdateEmployeeExamHistoryDto, @User() userPayloadDto: UserPayloadDto, @Param('id', ParseIntPipe) id: number) {
    return this.updateEmployeeExamHistoryService.execute({ ...upsertAccessGroupDto, id }, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.EMPLOYEE_HISTORY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Delete('/:employeeId/:id/:companyId?')
  delete(@User() userPayloadDto: UserPayloadDto, @Param('id', ParseIntPipe) id: number, @Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.deleteEmployeeExamHistoryService.execute(id, employeeId, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.EMPLOYEE_HISTORY_FILE,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Get('/:id/download/:companyId')
  async download(@Res() res, @User() userPayloadDto: UserPayloadDto, @Param('id', ParseIntPipe) id: number) {
    const { fileKey, fileStream } = await this.downloadExamService.execute(id, userPayloadDto);

    res.setHeader('Content-Disposition', `attachment; filename=${fileKey.split('/')[fileKey.split('/').length - 1]}`);

    fileStream.on('error', function (e) {
      res.status(500).send(e);
    });

    fileStream.pipe(res);
  }

  @Permissions({
    code: PermissionEnum.EMPLOYEE_HISTORY_FILE,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Post('upload/:companyId')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 100000000 } }))
  upload(@UploadedFile() file: Express.Multer.File, @Body() createDto: UpdateFileExamDto, @User() userPayloadDto: UserPayloadDto) {
    createDto.ids = createDto.ids.map((id) => Number(id));
    return this.uploadExamFileService.execute(createDto, userPayloadDto, file);
  }

  @Permissions({
    code: PermissionEnum.EMPLOYEE_HISTORY_FILE,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Delete('/file/:id')
  deleteFile(@User() userPayloadDto: UserPayloadDto, @Param('id', ParseIntPipe) id: number) {
    return this.deleteExamFileService.execute(id, userPayloadDto);
  }
}
