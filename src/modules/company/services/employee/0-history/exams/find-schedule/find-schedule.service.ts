import { Injectable } from '@nestjs/common';
import { StatusEnum } from '@prisma/client';

import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { FindEmployeeExamHistoryDto } from '../../../../../dto/employee-exam-history';
import { EmployeeExamsHistoryRepository } from '../../../../../repositories/implementations/EmployeeExamsHistoryRepository';

@Injectable()
export class FindScheduleEmployeeExamHistoryService {
  constructor(
    private readonly employeeExamHistoryRepository: EmployeeExamsHistoryRepository,
  ) {}

  async execute(
    { skip, take, allExams, ...query }: FindEmployeeExamHistoryDto,
    user: UserPayloadDto,
  ) {
    const companyId = user.targetCompanyId;
    const status: StatusEnum[] = [StatusEnum.PENDING];
    if (allExams) status.push(StatusEnum.PROCESSING);

    const access = await this.employeeExamHistoryRepository.find(
      {
        companyId: companyId,
        status,
        ...query,
      },
      { skip, take },
      {
        orderBy: { created_at: 'asc' },
        ...(!allExams && { distinct: ['employeeId'] }),
        select: {
          id: true,
          status: true,
          created_at: true,
          fileUrl: true,
          ...(allExams && {
            exam: { select: { name: true, id: true, isAttendance: true } },
            hierarchy: { select: { id: true, name: true } },
            subOffice: { select: { id: true, name: true } },
            time: true,
            doneDate: true,
            clinicId: true,
            clinicObs: true,
            scheduleType: true,
          }),
          examType: true,
          ...(!allExams && {
            userSchedule: { select: { name: true, email: true, id: true } },
            employee: {
              select: {
                name: true,
                id: true,
                cpf: true,
                company: {
                  select: {
                    cnpj: true,
                    name: true,
                    id: true,
                    fantasy: true,
                    initials: true,
                    address: { select: { state: true } },
                  },
                },
              },
            },
          }),
        },
      },
    );

    return access;
  }
}
