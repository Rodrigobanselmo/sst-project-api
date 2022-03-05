import { Controller, Get, Param } from '@nestjs/common';
import { User } from 'src/shared/decorators/user.decorator';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';
import { FindAllAvailableEmployeesService } from '../../services/employee/find-all-available-employees/find-all-available-employees.service';
import { FindEmployeeService } from '../../services/employee/find-employee/find-employee.service';

@Controller('employee')
export class EmployeeController {
  constructor(
    private readonly findEmployeeService: FindEmployeeService,
    private readonly findAllAvailableEmployeesService: FindAllAvailableEmployeesService,
  ) {}

  @Get('/all/:companyId?')
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
