import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorCompanyEnum } from '../../../../../shared/constants/enum/errorMessage';
import { EmployeeRepository } from '../../../../../modules/company/repositories/implementations/EmployeeRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class FindEmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(id: number, user: UserPayloadDto) {
    const employee = await this.employeeRepository.findById(id, user.targetCompanyId);

    if (!employee?.id) throw new BadRequestException(ErrorCompanyEnum.EMPLOYEE_NOT_FOUND);

    return employee;
  }
}
