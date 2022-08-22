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
  CreateEmployeeHierarchyHistoryDto,
  FindEmployeeHierarchyHistoryDto,
  UpdateEmployeeHierarchyHistoryDto,
} from '../../dto/employee-hierarchy-history';

import { CreateEmployeeHierarchyHistoryService } from '../../services/employee/0-history/hierarchy/create/create.service';
import { DeleteEmployeeHierarchyHistoryService } from '../../services/employee/0-history/hierarchy/delete/delete.service';
import { FindEmployeeHierarchyHistoryService } from '../../services/employee/0-history/hierarchy/find/find.service';
import { UpdateEmployeeHierarchyHistoryService } from '../../services/employee/0-history/hierarchy/update/update.service';

@ApiTags('employee-history-hierarchy')
@Controller('employee-history/hierarchy')
export class EmployeeHierarchyHistoryController {
  constructor(
    private readonly createEmployeeHierarchyHistoryService: CreateEmployeeHierarchyHistoryService,
    private readonly updateEmployeeHierarchyHistoryService: UpdateEmployeeHierarchyHistoryService,
    private readonly findEmployeeHierarchyHistoryService: FindEmployeeHierarchyHistoryService,
    private readonly deleteEmployeeHierarchyHistoryService: DeleteEmployeeHierarchyHistoryService,
  ) {}

  @Get()
  find(
    @User() userPayloadDto: UserPayloadDto,
    @Query() query: FindEmployeeHierarchyHistoryDto,
  ) {
    return this.findEmployeeHierarchyHistoryService.execute(
      query,
      userPayloadDto,
    );
  }

  @Post('/:companyId?')
  create(
    @Body() upsertAccessGroupDto: CreateEmployeeHierarchyHistoryDto,
    @User() userPayloadDto: UserPayloadDto,
  ) {
    return this.createEmployeeHierarchyHistoryService.execute(
      upsertAccessGroupDto,
      userPayloadDto,
    );
  }

  @Patch('/:id/:companyId?')
  update(
    @Body() upsertAccessGroupDto: UpdateEmployeeHierarchyHistoryDto,
    @User() userPayloadDto: UserPayloadDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.updateEmployeeHierarchyHistoryService.execute(
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
    return this.deleteEmployeeHierarchyHistoryService.execute(
      id,
      employeeId,
      userPayloadDto,
    );
  }
}
