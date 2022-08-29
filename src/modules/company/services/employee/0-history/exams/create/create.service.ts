import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorMessageEnum } from 'src/shared/constants/enum/errorMessage';

import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { EmployeeRepository } from '../../../../../repositories/implementations/EmployeeRepository';
import { CreateEmployeeExamHistoryDto } from './../../../../../dto/employee-exam-history';
import { EmployeeExamsHistoryRepository } from './../../../../../repositories/implementations/EmployeeExamsHistoryRepository';

@Injectable()
export class CreateEmployeeExamHistoryService {
  constructor(
    private readonly employeeExamHistoryRepository: EmployeeExamsHistoryRepository,
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(dataDto: CreateEmployeeExamHistoryDto, user: UserPayloadDto) {
    const found = await this.employeeRepository.findById(
      dataDto.employeeId,
      user.targetCompanyId,
    );

    if (!found?.id)
      throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_NOT_FOUND);

    const history = await this.employeeExamHistoryRepository.create({
      ...dataDto,
      userDoneId: user.userId,
    });

    return history;
  }
}
