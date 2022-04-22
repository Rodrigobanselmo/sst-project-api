import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from '../../../../../modules/company/dto/employee.dto';
import { EmployeeRepository } from '../../../../../modules/company/repositories/implementations/EmployeeRepository';

@Injectable()
export class CreateEmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(createEmployeeDto: CreateEmployeeDto) {
    const company = await this.employeeRepository.create({
      ...createEmployeeDto,
    });

    return company;
  }
}
