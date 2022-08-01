import { Injectable } from '@nestjs/common';
import { DeleteSubOfficeEmployeeDto } from '../../../dto/employee.dto';
import { EmployeeRepository } from '../../../repositories/implementations/EmployeeRepository';

@Injectable()
export class DeleteSubOfficeEmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute({ companyId, id, subOfficeId }: DeleteSubOfficeEmployeeDto) {
    const employee = await this.employeeRepository.disconnectUniqueSubOffice(
      id,
      subOfficeId,
      companyId,
    );

    return employee;
  }
}
