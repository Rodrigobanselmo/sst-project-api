import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { PermissionEnum } from '../../../../shared/constants/enum/authorization';
import { Permissions } from '../../../../shared/decorators/permissions.decorator';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateEmployeeDto, FindEmployeeDto, FindOneEmployeeDto, UpdateEmployeeDto } from '../../dto/employee.dto';
import { CreateEmployeeService } from '../../services/employee/create-employee/create-employee.service';
import { DeleteSubOfficeEmployeeService } from '../../services/employee/delete-sub-office-employee/delete-sub-office-employee.service';
import { FindAllAvailableEmployeesService } from '../../services/employee/find-all-available-employees/find-all-available-employees.service';
import { FindEmployeeService } from '../../services/employee/find-employee/find-employee.service';
import { SoftDeleteEmployeeService } from '../../services/employee/soft-delete-employee/soft-delete-employee.service';
import { UpdateEmployeeService } from '../../services/employee/update-employee/update-employee.service';

@Controller('employee')
export class EmployeeController {
  constructor(
    private readonly createEmployeeService: CreateEmployeeService,
    private readonly updateEmployeeService: UpdateEmployeeService,
    private readonly findEmployeeService: FindEmployeeService,
    private readonly findAllAvailableEmployeesService: FindAllAvailableEmployeesService,
    private readonly deleteSubOfficeEmployeeService: DeleteSubOfficeEmployeeService,
    private readonly softDeleteEmployeeService: SoftDeleteEmployeeService,
  ) {}

  @Permissions({
    code: PermissionEnum.EMPLOYEE,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.createEmployeeService.execute(createEmployeeDto);
  }

  @Permissions({
    code: PermissionEnum.EMPLOYEE,
    isContract: true,
    isMember: true,
    crud: 'u',
  })
  @Post('/:employeeId/sub-office/:subOfficeId/:companyId')
  deleteSubOffice(
    @Param('employeeId') employeeId: number,
    @Param('companyId') companyId: string,
    @Param('subOfficeId') subOfficeId: string,
  ) {
    return this.deleteSubOfficeEmployeeService.execute({
      id: employeeId,
      subOfficeId,
      companyId,
    });
  }

  /**
   * Mesmo contexto de empresa que `GET /employee/:companyId` (`getCompanyId` → `targetCompanyId`).
   * Sem `:companyId` na URL, o PATCH herdava só `user.companyId` do JWT e falhava com 404 na listagem por workspace.
   */
  @Permissions({
    code: PermissionEnum.EMPLOYEE,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Patch(':companyId/:employeeId/soft-delete')
  softDeleteWithCompanyContext(
    @Param('companyId') companyId: string,
    @Param('employeeId') employeeId: string,
  ) {
    return this.softDeleteEmployeeService.execute(Number(employeeId), companyId);
  }

  /** Legado: só funciona se `companyId` vier em query/body (vide `getCompanyId`). Preferir rota com `:companyId`. */
  @Permissions({
    code: PermissionEnum.EMPLOYEE,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Patch(':employeeId/soft-delete')
  softDelete(
    @User() userPayloadDto: UserPayloadDto,
    @Param('employeeId') employeeId: string,
  ) {
    return this.softDeleteEmployeeService.execute(Number(employeeId), userPayloadDto.targetCompanyId);
  }

  @Permissions({
    code: PermissionEnum.EMPLOYEE,
    isContract: true,
    isMember: true,
    crud: true,
  })
  @Patch('/:companyId?')
  update(@Body() updateEmployee: UpdateEmployeeDto) {
    return this.updateEmployeeService.execute(updateEmployee);
  }

  @Permissions({
    code: PermissionEnum.EMPLOYEE,
    isContract: true,
    isMember: true,
  })
  @Get('/:companyId?')
  FindAllAvailable(@User() userPayloadDto: UserPayloadDto, @Query() query: FindEmployeeDto) {
    return this.findAllAvailableEmployeesService.execute(query, userPayloadDto);
  }

  @Permissions({
    code: PermissionEnum.EMPLOYEE,
    isContract: true,
    isMember: true,
  })
  @Get('/id/:employeeId/:companyId?')
  findOne(
    @User() userPayloadDto: UserPayloadDto,
    @Query() query: FindOneEmployeeDto,
    @Param('employeeId') employeeId: number,
  ) {
    return this.findEmployeeService.execute(employeeId, query, userPayloadDto);
  }
}
