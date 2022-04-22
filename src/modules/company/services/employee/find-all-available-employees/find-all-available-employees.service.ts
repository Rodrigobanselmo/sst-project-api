import { Injectable } from '@nestjs/common';
import { EmployeeRepository } from '../../../../../modules/company/repositories/implementations/EmployeeRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

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
