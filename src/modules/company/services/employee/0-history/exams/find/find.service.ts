import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { FindEmployeeExamHistoryDto } from '../../../../../dto/employee-exam-history';
import { EmployeeExamsHistoryRepository } from '../../../../../repositories/implementations/EmployeeExamsHistoryRepository';

@Injectable()
export class FindEmployeeExamHistoryService {
  constructor(private readonly employeeExamHistoryRepository: EmployeeExamsHistoryRepository) {}

  async execute(
    { skip, take, includeClinic, orderByCreation, ...query }: FindEmployeeExamHistoryDto,
    user: UserPayloadDto,
  ) {
    const access = await this.employeeExamHistoryRepository.find(
      { companyId: user.targetCompanyId, ...query },
      { skip, take },
      {
        include: {
          exam: {
            select: {
              isAvaliation: true,
              isAttendance: true,
              id: true,
              name: true,
            },
          },
          userDone: { select: { email: true, name: true } },
          userSchedule: { select: { email: true, name: true } },
          ...(!query.employeeId && {
            employee: {
              select: {
                email: true,
                name: true,
                id: true,
                phone: true,
                cpf: true,
                companyId: true,
                ...(query.allCompanies && {
                  company: {
                    select: {
                      cnpj: true,
                      name: true,
                      id: true,
                      fantasy: true,
                      initials: true,
                    },
                  },
                }),
              },
            },
          }),
          ...(includeClinic && {
            clinic: { select: { id: true, fantasy: true, address: true } },
          }),
        },
        ...(orderByCreation && {
          orderBy: { created_at: 'desc' },
        }),
      },
    );

    return access;
  }
}
