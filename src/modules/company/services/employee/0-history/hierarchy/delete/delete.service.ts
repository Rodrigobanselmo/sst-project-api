import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorMessageEnum } from 'src/shared/constants/enum/errorMessage';

import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { EmployeeHierarchyHistoryRepository } from './../../../../../repositories/implementations/EmployeeHierarchyHistoryRepository';
import { EmployeeRepository } from './../../../../../repositories/implementations/EmployeeRepository';

@Injectable()
export class DeleteEmployeeHierarchyHistoryService {
  constructor(
    private readonly employeeHierarchyHistoryRepository: EmployeeHierarchyHistoryRepository,
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(id: number, user: UserPayloadDto) {
    const found = await this.employeeRepository.findById(
      id,
      user.targetCompanyId,
    );

    if (!found?.id)
      throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_NOT_FOUND);

    const history = await this.employeeHierarchyHistoryRepository.delete(id);

    return history;
  }
}
