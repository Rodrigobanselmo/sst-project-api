import { Injectable } from '@nestjs/common';
import { UpdateEmployeeDto } from '../../../../../modules/company/dto/employee.dto';
import { EmployeeRepository } from '../../../../../modules/company/repositories/implementations/EmployeeRepository';

@Injectable()
export class UpdateEmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(updateEmployeeDto: UpdateEmployeeDto) {
    const company = await this.employeeRepository.update({
      ...updateEmployeeDto,
    });

    return company;
  }
}
