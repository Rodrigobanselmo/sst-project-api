import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';

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
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { PermissionEnum, RoleEnum } from '../../../../shared/constants/enum/authorization';
import { Roles } from '../../../../shared/decorators/roles.decorator';

@Controller('employee-history/hierarchy')
export class EmployeeHierarchyHistoryController {
  constructor(
    private readonly createEmployeeHierarchyHistoryService: CreateEmployeeHierarchyHistoryService,
    private readonly updateEmployeeHierarchyHistoryService: UpdateEmployeeHierarchyHistoryService,
    private readonly findEmployeeHierarchyHistoryService: FindEmployeeHierarchyHistoryService,
    private readonly deleteEmployeeHierarchyHistoryService: DeleteEmployeeHierarchyHistoryService,
  ) {}

  @Permissions({
    code: PermissionEnum.EMPLOYEE,
    isContract: true,
    isMember: true,
  })
  @Get()
  find(@User() userPayloadDto: UserPayloadDto, @Query() query: FindEmployeeHierarchyHistoryDto) {
    return this.findEmployeeHierarchyHistoryService.execute(query, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.EMPLOYEE_HISTORY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Post('/:companyId?')
  create(@Body() upsertAccessGroupDto: CreateEmployeeHierarchyHistoryDto, @User() userPayloadDto: UserPayloadDto) {
    return this.createEmployeeHierarchyHistoryService.execute(upsertAccessGroupDto, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.EMPLOYEE_HISTORY,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Patch('/:id/:companyId?')
  update(
    @Body() upsertAccessGroupDto: UpdateEmployeeHierarchyHistoryDto,
    @User() userPayloadDto: UserPayloadDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.updateEmployeeHierarchyHistoryService.execute({ ...upsertAccessGroupDto, id }, userPayloadDto);
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
    return this.deleteEmployeeHierarchyHistoryService.execute(id, employeeId, userPayloadDto);
  }
}
