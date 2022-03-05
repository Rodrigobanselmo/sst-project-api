import { Injectable } from '@nestjs/common';
import { EmployeeRepository } from 'src/modules/company/repositories/implementations/EmployeeRepository';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';

@Injectable()
export class FindAllAvailableEmployeesService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(user: UserPayloadDto) {
    const employees = await this.employeeRepository.findAllByCompany(
      user.targetCompanyId,
    );

    return employees;
  }
}
