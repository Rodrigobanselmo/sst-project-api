import { ErrorMessageEnum } from './../../../../../../../shared/constants/enum/errorMessage';
import { BadRequestException, Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { EmployeeRepository } from '../../../../../repositories/implementations/EmployeeRepository';
import { UpdateEmployeeExamHistoryDto } from './../../../../../dto/employee-exam-history';
import { EmployeeExamsHistoryRepository } from './../../../../../repositories/implementations/EmployeeExamsHistoryRepository';

@Injectable()
export class UpdateEmployeeExamHistoryService {
  constructor(
    private readonly employeeExamHistoryRepository: EmployeeExamsHistoryRepository,
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(dataDto: UpdateEmployeeExamHistoryDto, user: UserPayloadDto) {
    const found = await this.employeeRepository.findById(
      dataDto.employeeId,
      user.targetCompanyId,
    );

    //tenant
    if (!found?.id)
      throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_NOT_FOUND);

    const history = await this.employeeExamHistoryRepository.update({
      ...dataDto,
    });

    return history;
  }
}
