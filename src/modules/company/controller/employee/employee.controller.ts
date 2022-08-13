import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import {
  CreateEmployeeDto,
  FindEmployeeDto,
  UpdateEmployeeDto,
} from '../../dto/employee.dto';
import { CreateEmployeeService } from '../../services/employee/create-employee/create-employee.service';
import { DeleteSubOfficeEmployeeService } from '../../services/employee/delete-sub-office-employee/delete-sub-office-employee.service';
import { FindAllAvailableEmployeesService } from '../../services/employee/find-all-available-employees/find-all-available-employees.service';
import { FindEmployeeService } from '../../services/employee/find-employee/find-employee.service';
import { UpdateEmployeeService } from '../../services/employee/update-employee/update-employee.service';

@Controller('employee')
export class EmployeeController {
  constructor(
    private readonly createEmployeeService: CreateEmployeeService,
    private readonly updateEmployeeService: UpdateEmployeeService,
    private readonly findEmployeeService: FindEmployeeService,
    private readonly findAllAvailableEmployeesService: FindAllAvailableEmployeesService,
    private readonly deleteSubOfficeEmployeeService: DeleteSubOfficeEmployeeService,
  ) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.createEmployeeService.execute(createEmployeeDto);
  }

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

  @Patch('/:companyId?')
  update(@Body() updateEmployee: UpdateEmployeeDto) {
    return this.updateEmployeeService.execute(updateEmployee);
  }

  @Get('/:companyId?')
  FindAllAvailable(
    @User() userPayloadDto: UserPayloadDto,
    @Query() query: FindEmployeeDto,
  ) {
    return this.findAllAvailableEmployeesService.execute(query, userPayloadDto);
  }

  @Get('/:employeeId/:companyId?')
  findOne(
    @User() userPayloadDto: UserPayloadDto,
    @Param('employeeId') employeeId: number,
  ) {
    return this.findEmployeeService.execute(employeeId, userPayloadDto);
  }
}
