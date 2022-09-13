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
    { skip, take, ...query }: FindEmployeeExamHistoryDto,
    user: UserPayloadDto,
  ) {
    const companyId = user.targetCompanyId;

    const access = await this.employeeExamHistoryRepository.find(
      {
        companyId: companyId,
        status: [StatusEnum.PENDING],
        ...query,
      },
      { skip, take },
      {
        orderBy: { created_at: 'asc' },
        distinct: ['employeeId'],
        select: {
          created_at: true,
          doneDate: true,
          status: true,
          time: true,
          examType: true,
          userSchedule: { select: { name: true, email: true, id: true } },
          employee: {
            select: {
              name: true,
              cpf: true,
              company: {
                select: {
                  cnpj: true,
                  name: true,
                  fantasy: true,
                  initials: true,
                  address: { select: { state: true } },
                },
              },
            },
          },
        },
      },
    );

    return access;
  }
}
