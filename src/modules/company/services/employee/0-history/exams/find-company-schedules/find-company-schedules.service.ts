import { Injectable } from '@nestjs/common';
import { StatusEnum } from '@prisma/client';

import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { FindCompanyEmployeeExamHistoryDto } from '../../../../../dto/employee-exam-history';
import { EmployeeExamsHistoryRepository } from '../../../../../repositories/implementations/EmployeeExamsHistoryRepository';
import { EmployeeRepository } from '../../../../../repositories/implementations/EmployeeRepository';

@Injectable()
export class FindCompanyScheduleEmployeeExamHistoryService {
  constructor(private readonly employeeExamHistoryRepository: EmployeeExamsHistoryRepository, private readonly employeeRepository: EmployeeRepository) {}

  async execute({ skip, take, ...query }: FindCompanyEmployeeExamHistoryDto, user: UserPayloadDto) {
    // const status: StatusEnum[] = [
    //   StatusEnum.DONE,
    //   StatusEnum.PROCESSING,
    //   StatusEnum.INACTIVE,
    // ];

    const employeesExams = await this.employeeExamHistoryRepository.find(
      {
        ...query,
        companyId: user.targetCompanyId,
        userCompany: user.companyId,
      },
      { skip, take },
      {
        select: {
          id: true,
          doneDate: true,
          examType: true,
          clinicId: true,
          employeeId: true,
          hierarchyId: true,
          subOfficeId: true,
          exam: { select: { id: true, name: true, isAttendance: true } },
          status: true,
          employee: {
            select: {
              name: true,
              id: true,
              cpf: true,
              companyId: true,
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
            },
          },
        },
        where: {
          AND: [
            {
              status: {
                notIn: [StatusEnum.PENDING, StatusEnum.CANCELED],
              },
            },
          ],
          // OR: [
          //   {
          //     status: {
          //       in: [StatusEnum.PROCESSING, StatusEnum.INACTIVE],
          //     },
          //   },
          //   {
          //     status: { in: [StatusEnum.DONE, StatusEnum.CANCELED] },
          //     doneDate: { gte: dayjs().add(-7, 'day').toDate() },
          //   },
          // ],
          // employee: { companyId },
        },
        orderBy: [{ status: 'asc' }, { doneDate: 'desc' }],
        distinct: ['doneDate', 'employeeId'],
      },
    );

    // const employees = await this.employeeRepository.findNude({
    //   select: {
    //     name: true,
    //     id: true,
    //     cpf: true,
    //     birthday: true,
    //     phone: true,
    //     sex: true,
    //     company: {
    //       select: {
    //         name: true,
    //         initials: true,
    //         fantasy: true,
    //         id: true,
    //         cnpj: true,
    //       },
    //     },
    //     examsHistory: {
    //       select: {
    //         id: true,
    //         doneDate: true,
    //         conclusion: true,
    //         examType: true,
    //         doctor: { select: { id: true, name: true } },
    //         exam: { select: { id: true, name: true, isAttendance: true } },
    //         time: true,
    //         evaluationType: true,
    //         status: true,
    //       },
    //       where: {
    //         status: {
    //           in: [
    //             StatusEnum.PROCESSING,
    //             StatusEnum.INACTIVE,
    //             StatusEnum.CANCELED,
    //           ],
    //         },
    //         doneDate: query.date,
    //       },
    //     },
    //   },
    //   orderBy: { name: 'asc' },
    //   where: {
    //     companyId,
    //     examsHistory: {
    //       some: {
    //         OR: [
    //           {
    //             status: {
    //               in: [StatusEnum.PROCESSING, StatusEnum.INACTIVE],
    //             },
    //           },
    //           {
    //             status: { in: [StatusEnum.DONE, StatusEnum.CANCELED] },
    //             doneDate: { gte: dayjs().add(-7, 'day').toDate() },
    //           },
    //         ],
    //       },
    //     },
    //   },
    // });

    return employeesExams;
  }
}
