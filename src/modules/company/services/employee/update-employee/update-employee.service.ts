import { Injectable } from '@nestjs/common';
import { UpdateEmployeeDto } from '../../../../../modules/company/dto/employee.dto';
import { EmployeeRepository } from '../../../../../modules/company/repositories/implementations/EmployeeRepository';

@Injectable()
export class UpdateEmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(updateEmployeeDto: UpdateEmployeeDto) {
    let removeSubOffices = false;
    if (updateEmployeeDto.hierarchyId) {
      const employeeFound = await this.employeeRepository.findById(updateEmployeeDto.id, updateEmployeeDto.companyId);

      if (employeeFound.hierarchyId !== updateEmployeeDto.hierarchyId) {
        removeSubOffices = true;
      }
    }

    const employee = await this.employeeRepository.update(
      {
        ...updateEmployeeDto,
      },
      removeSubOffices,
    );

    return employee;
  }
}
