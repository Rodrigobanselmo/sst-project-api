import { EmployeeEntity } from './../../../../../entities/employee.entity';
import { UserPayloadDto } from './../../../../../../../shared/dto/user-payload.dto';
import { ErrorMessageEnum } from './../../../../../../../shared/constants/enum/errorMessage';
import { BadRequestException, Injectable } from '@nestjs/common';

import { UpdateManyScheduleExamDto } from '../../../../../dto/employee-exam-history';
import { EmployeeExamsHistoryRepository } from '../../../../../repositories/implementations/EmployeeExamsHistoryRepository';
import { EmployeeRepository } from '../../../../../repositories/implementations/EmployeeRepository';

@Injectable()
export class UpdateManyScheduleExamHistoryService {
  constructor(
    private readonly employeeExamHistoryRepository: EmployeeExamsHistoryRepository,
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(
    { data, isClinic, ...dataDto }: UpdateManyScheduleExamDto,
    user: UserPayloadDto,
  ) {
    const employeeId = data.every(
      (dt) => data?.[0]?.employeeId === dt?.employeeId,
    )
      ? data[0]?.employeeId
      : 0;

    let found: EmployeeEntity;
    if (!isClinic)
      found = await this.employeeRepository.findFirstNude({
        select: { id: true, companyId: true },
        where: {
          companyId: user.targetCompanyId,
          id: employeeId,
        },
      });

    if (isClinic)
      found = await this.employeeRepository.findFirstNude({
        select: { id: true, companyId: true },
        where: {
          examsHistory: { some: { clinicId: user.targetCompanyId } },
          id: employeeId,
        },
      });

    //tenant
    if (!found?.id)
      throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_NOT_FOUND);

    await this.employeeRepository.update({
      companyId: found.companyId,
      id: employeeId,
      ...dataDto,
    });

    const history = await this.employeeExamHistoryRepository.updateMany({
      data,
    });

    return history;
  }
}
