import { Injectable } from '@nestjs/common';
import { StatusEnum } from '@prisma/client';

import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { FindClinicEmployeeExamHistoryDto } from '../../../../../dto/employee-exam-history';
import { EmployeeExamsHistoryRepository } from '../../../../../repositories/implementations/EmployeeExamsHistoryRepository';
import { EmployeeRepository } from './../../../../../repositories/implementations/EmployeeRepository';

@Injectable()
export class FindClinicScheduleEmployeeExamHistoryService {
  constructor(
    private readonly employeeExamHistoryRepository: EmployeeExamsHistoryRepository,
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(query: FindClinicEmployeeExamHistoryDto, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;
    const status: StatusEnum[] = [
      StatusEnum.DONE,
      StatusEnum.PROCESSING,
      StatusEnum.INACTIVE,
    ];

    const employees = await this.employeeRepository.findNude({
      select: {
        name: true,
        id: true,
        cpf: true,
        birthday: true,
        phone: true,
        sex: true,
        company: {
          select: {
            name: true,
            initials: true,
            fantasy: true,
            id: true,
            cnpj: true,
          },
        },
        examsHistory: {
          select: {
            id: true,
            doneDate: true,
            fileUrl: true,
            conclusion: true,
            examType: true,
            doctor: { select: { id: true, name: true } },
            exam: { select: { id: true, name: true, isAttendance: true } },
            time: true,
            evaluationType: true,
            status: true,
          },
          where: {
            status: { in: status },
            ...(query.date && { doneDate: query.date }),
          },
          orderBy: { doneDate: 'desc' },
          distinct: ['examId'],
        },
      },
      where: {
        ...(query.employeeId && { id: query.employeeId }),
        examsHistory: {
          some: {
            clinicId: companyId,
            status: { in: status },
            ...(query.date && { doneDate: query.date }),
          },
        },
      },
    });

    return employees;
  }
}
