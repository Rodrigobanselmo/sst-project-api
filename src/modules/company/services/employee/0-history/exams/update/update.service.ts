import { UpdateEmployeeExamHistoryDto } from './../../../../../dto/employee-exam-history';
import { EmployeeExamsHistoryRepository } from './../../../../../repositories/implementations/EmployeeExamsHistoryRepository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorMessageEnum } from 'src/shared/constants/enum/errorMessage';

import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { EmployeeRepository } from '../../../../../repositories/implementations/EmployeeRepository';
import { CreateEmployeeExamHistoryService } from '../create/create.service';

@Injectable()
export class UpdateEmployeeExamHistoryService {
  constructor(
    private readonly employeeExamHistoryRepository: EmployeeExamsHistoryRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly createEmployeeExamHistoryService: CreateEmployeeExamHistoryService,
  ) {}

  async execute(dataDto: UpdateEmployeeExamHistoryDto, user: UserPayloadDto) {
    const found = await this.employeeRepository.findById(
      dataDto.employeeId,
      user.targetCompanyId,
    );

    if (!found?.id)
      throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_NOT_FOUND);

    const history = await this.employeeExamHistoryRepository.update({
      ...dataDto,
    });

    return history;
  }
}
