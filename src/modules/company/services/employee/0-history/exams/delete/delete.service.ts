import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorMessageEnum } from 'src/shared/constants/enum/errorMessage';

import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { EmployeeExamsHistoryRepository } from './../../../../../repositories/implementations/EmployeeExamsHistoryRepository';
import { EmployeeRepository } from './../../../../../repositories/implementations/EmployeeRepository';

@Injectable()
export class DeleteEmployeeExamHistoryService {
  constructor(
    private readonly employeeExamHistoryRepository: EmployeeExamsHistoryRepository,
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(id: number, employeeId: number, user: UserPayloadDto) {
    const found = await this.employeeRepository.findById(
      employeeId,
      user.targetCompanyId,
    );

    if (!found?.id)
      throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_NOT_FOUND);

    const history = await this.employeeExamHistoryRepository.delete(id);

    return history;
  }
}
