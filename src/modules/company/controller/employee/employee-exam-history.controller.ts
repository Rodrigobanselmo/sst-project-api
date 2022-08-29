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
  FindEmployeeExamHistoryDto,
  UpdateEmployeeExamHistoryDto,
} from '../../dto/employee-exam-history';

import { CreateEmployeeExamHistoryService } from '../../services/employee/0-history/exams/create/create.service';
import { DeleteEmployeeExamHistoryService } from '../../services/employee/0-history/exams/delete/delete.service';
import { FindEmployeeExamHistoryService } from '../../services/employee/0-history/exams/find/find.service';
import { UpdateEmployeeExamHistoryService } from '../../services/employee/0-history/exams/update/update.service';

@ApiTags('employee-history-exam')
@Controller('employee-history/exam')
export class EmployeeExamHistoryController {
  constructor(
    private readonly createEmployeeExamHistoryService: CreateEmployeeExamHistoryService,
    private readonly updateEmployeeExamHistoryService: UpdateEmployeeExamHistoryService,
    private readonly findEmployeeExamHistoryService: FindEmployeeExamHistoryService,
    private readonly deleteEmployeeExamHistoryService: DeleteEmployeeExamHistoryService,
  ) {}

  @Get()
  find(
    @User() userPayloadDto: UserPayloadDto,
    @Query() query: FindEmployeeExamHistoryDto,
  ) {
    return this.findEmployeeExamHistoryService.execute(query, userPayloadDto);
  }

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
