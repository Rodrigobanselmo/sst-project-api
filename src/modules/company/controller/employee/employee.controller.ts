import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from '../../../../shared/decorators/user.decorator';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { CreateEmployeeDto } from '../../dto/employee.dto';
import { CreateEmployeeService } from '../../services/employee/create-employee/create-employee.service';
import { FindAllAvailableEmployeesService } from '../../services/employee/find-all-available-employees/find-all-available-employees.service';
import { FindEmployeeService } from '../../services/employee/find-employee/find-employee.service';

@Controller('employee')
export class EmployeeController {
  constructor(
    private readonly createEmployeeService: CreateEmployeeService,
    private readonly findEmployeeService: FindEmployeeService,
    private readonly findAllAvailableEmployeesService: FindAllAvailableEmployeesService,
  ) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.createEmployeeService.execute(createEmployeeDto);
  }

  @Get('/:companyId?')
  FindAllAvailable(@User() userPayloadDto: UserPayloadDto) {
    return this.findAllAvailableEmployeesService.execute(userPayloadDto);
  }

  @Get('/:employeeId/:companyId?')
  findOne(
    @User() userPayloadDto: UserPayloadDto,
    @Param('employeeId') employeeId: number,
  ) {
    return this.findEmployeeService.execute(employeeId, userPayloadDto);
  }
}
