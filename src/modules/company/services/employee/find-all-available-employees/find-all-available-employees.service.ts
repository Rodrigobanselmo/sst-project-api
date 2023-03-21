import { Injectable } from '@nestjs/common';
import { FindEmployeeDto } from '../../../../../modules/company/dto/employee.dto';
import { EmployeeRepository } from '../../../../../modules/company/repositories/implementations/EmployeeRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class FindAllAvailableEmployeesService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute({ skip, take, ...query }: FindEmployeeDto, user: UserPayloadDto) {
    console.log(query);
    const employees = await this.employeeRepository.find({ ...query, companyId: user.targetCompanyId }, { skip, take });

    return employees;
  }
}
