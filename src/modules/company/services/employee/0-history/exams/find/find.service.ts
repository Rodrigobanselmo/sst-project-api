import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { FindEmployeeExamHistoryDto } from '../../../../../dto/employee-exam-history';
import { EmployeeExamsHistoryRepository } from '../../../../../repositories/implementations/EmployeeExamsHistoryRepository';

@Injectable()
export class FindEmployeeExamHistoryService {
  constructor(
    private readonly employeeExamHistoryRepository: EmployeeExamsHistoryRepository,
  ) {}

  async execute(
    { skip, take, ...query }: FindEmployeeExamHistoryDto,
    user: UserPayloadDto,
  ) {
    const access = await this.employeeExamHistoryRepository.find(
      { companyId: user.targetCompanyId, ...query },
      { skip, take },
      {
        include: {
          exam: { select: { isAttendance: true, id: true, name: true } },
          userDone: { select: { email: true, name: true } },
          userSchedule: { select: { email: true, name: true } },
        },
      },
    );

    return access;
  }
}
