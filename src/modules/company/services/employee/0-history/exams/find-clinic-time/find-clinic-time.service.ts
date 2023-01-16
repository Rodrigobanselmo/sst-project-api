import { Injectable } from '@nestjs/common';
import { StatusEnum } from '@prisma/client';

import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { FindClinicScheduleTimeDto, FindEmployeeExamHistoryDto } from '../../../../../dto/employee-exam-history';
import { EmployeeExamsHistoryRepository } from '../../../../../repositories/implementations/EmployeeExamsHistoryRepository';

@Injectable()
export class FindClinicScheduleTimeService {
  constructor(private readonly employeeExamHistoryRepository: EmployeeExamsHistoryRepository) {}

  async execute({ date, clinicId, examId }: FindClinicScheduleTimeDto) {
    const access = await this.employeeExamHistoryRepository.findNude({
      where: {
        clinicId: clinicId,
        doneDate: date,
        examId: examId,
        status: { in: ['DONE', 'PROCESSING', 'PROGRESS'] },
      },
      select: {
        id: true,
        time: true,
      },
    });

    return access;
  }
}
