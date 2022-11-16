import { Injectable } from '@nestjs/common';
import { FindEmployeeDto } from '../../../dto/employee.dto';
import { EmployeeRepository } from '../../../repositories/implementations/EmployeeRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class FindAllAvailableEmployeesService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute({ skip, take, ...query }: FindEmployeeDto, user: UserPayloadDto) {
    const employees = await this.employeeRepository.find({ ...query, companyId: user.targetCompanyId }, { skip, take });

    return employees;
  }
}
