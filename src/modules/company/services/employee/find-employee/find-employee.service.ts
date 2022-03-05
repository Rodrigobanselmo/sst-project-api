import { BadRequestException, Injectable } from '@nestjs/common';
import { EmployeeRepository } from 'src/modules/company/repositories/implementations/EmployeeRepository';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';

@Injectable()
export class FindEmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(id: number, user: UserPayloadDto) {
    const employee = await this.employeeRepository.findById(
      id,
      user.targetCompanyId,
    );

    if (!employee)
      throw new BadRequestException(`employee with id ${id} not found`);

    return employee;
  }
}
