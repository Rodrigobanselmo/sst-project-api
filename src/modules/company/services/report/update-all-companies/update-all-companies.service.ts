import { EmployeeEntity } from 'src/modules/company/entities/employee.entity';
import { CompanyEntity } from './../../../entities/company.entity';
import { CompanyRepository } from '../../../repositories/implementations/CompanyRepository';
import { asyncEach } from '../../../../../shared/utils/asyncEach';
import { DocumentRepository } from '../../../repositories/implementations/DocumentRepository';
import { IExamOriginData } from '../../../../checklist/entities/exam.entity';
import { FindExamByHierarchyService } from '../../../../checklist/services/exam/find-by-hierarchy /find-exam-by-hierarchy.service';
import { FindCompanyDashDto } from '../../../dto/dashboard.dto';
import { EmployeeRepository } from '../../../repositories/implementations/EmployeeRepository';
import { Injectable } from '@nestjs/common';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CreateContactDto } from '../../../dto/contact.dto';
import { ContactRepository } from '../../../repositories/implementations/ContactRepository';
import { TelegramService } from 'nestjs-telegram';

@Injectable()
export class UpdateAllCompaniesService {
  private chatId = 1301254235;
  private errorCompanies = [];
  private error: Error;

  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly findExamByHierarchyService: FindExamByHierarchyService,
    private readonly companyRepository: CompanyRepository,
    private readonly dayjs: DayJSProvider,
    private readonly telegram: TelegramService,
  ) {}

  async execute(user?: UserPayloadDto) {
    const companyId = user.targetCompanyId;

    const allCompanies = await this.companyRepository.findNude({
      select: {
        id: true,
        ...(!companyId && {
          applyingServiceContracts: {
            select: { receivingServiceCompanyId: true },
          },
        }),
      },
      where: {
        status: 'ACTIVE',
        isClinic: false,
        isGroup: false,
        ...(companyId && { id: companyId }),
      },
    });

    const data = await asyncEach(allCompanies, (v) =>
      this.addEmployeeExamTime(v),
    );

    const messageHtml = `
UPDATE ALL COMPANIES EXAMS:

DONE: ${allCompanies.length - this.errorCompanies.length}
ERRORS: ${this.errorCompanies.length}
TOTAL: ${allCompanies.length}
    `;

    try {
      console.log(messageHtml);
      // await this.telegram
      //   .sendMessage({
      //     chat_id: this.chatId,
      //     text: messageHtml,
      //     parse_mode: 'html',
      //   })
      //   .toPromise();
    } catch (e) {
      console.error('TELEGRAM', e);
    }

    return data;
  }

  async addEmployeeExamTime(company: CompanyEntity) {
    const companyId = company.id;
    try {
      const allEmployees = await this.employeeRepository.findNude({
        where: {
          companyId,
        },
        select: {
          id: true,
          lastExam: true,
          hierarchyId: true,
          subOffices: { select: { id: true } },
          examsHistory: {
            select: { expiredDate: true, status: true, evaluationType: true },
            where: {
              exam: { isAttendance: true },
              status: { in: ['DONE', 'PROCESSING', 'PENDING'] },
            },
            distinct: ['status'],
            take: 2,
            orderBy: { doneDate: 'desc' },
          },
        },
      });

      const allWithExam = [] as EmployeeEntity[];
      const allWithExamExpired = [] as EmployeeEntity[];
      const allWithExamSchedule = [] as EmployeeEntity[];

      const missingExam = [] as EmployeeEntity[];

      allEmployees.forEach((employee) => {
        if (employee?.examsHistory?.length > 0) {
          //--> add expired Date
          const doneExamFound = employee.examsHistory.find((exam) => {
            const isDone = exam.status === 'DONE';
            if (isDone) return true;
            return false;
          });

          const scheduleExamFound = employee.examsHistory.find((exam) => {
            const isSchedule = ['PROCESSING', 'PENDING'].includes(exam.status);
            if (!isSchedule) return false;

            const isDoneDateValid = this.dayjs
              .dayjs(exam.doneDate)
              .isAfter(this.dayjs.dateNow());
            if (!isDoneDateValid) return false;

            return true;
          });

          if (doneExamFound)
            employee.expiredDateExam = doneExamFound.expiredDate;
          if (!doneExamFound && scheduleExamFound && employee.lastExam) {
            const expiredDate = this.dayjs
              .dayjs(employee.lastExam)
              .add(scheduleExamFound.validityInMonths, 'month')
              .toDate();
            employee.expiredDateExam = expiredDate;
          }
          //--> add expired Date

          // allWithExam
          {
            allWithExam.push(employee);
          }

          // allWithExamExpired
          {
            if (doneExamFound) {
              const isExpired = this.dayjs
                .dayjs(doneExamFound.expiredDate)
                .isBefore(this.dayjs.dateNow());

              if (isExpired) allWithExamExpired.push(employee);
            } else {
              if (!doneExamFound && scheduleExamFound && employee.lastExam) {
                const isExpired = this.dayjs
                  .dayjs(employee.expiredDateExam)
                  .isBefore(this.dayjs.dateNow());

                if (isExpired) allWithExamExpired.push(employee);
              } else {
                allWithExamExpired.push(employee);
              }
            }
          }

          // allWithExamSchedule
          {
            if (scheduleExamFound) allWithExamSchedule.push(employee);
          }
        }

        // missingExam
        if (employee?.examsHistory?.length == 0) {
          missingExam.push(employee);
        }
      });

      const exams = await this.findExamByHierarchyService.execute(
        { targetCompanyId: companyId },
        {
          onlyAttendance: true,
        },
      );

      const getExpired = missingExam.map((employee) => {
        const ids = [
          ...employee.subOffices.map(({ id }) => id),
          employee.hierarchyId,
        ];

        let expiredDate: Date;
        exams.data.find(({ exam, origins }) => {
          if (!exam.isAttendance) return false;

          origins.find((origin) => {
            const isPartOfHomo = origin?.homogeneousGroup
              ? origin.homogeneousGroup?.hierarchyOnHomogeneous?.find(
                  (homoHier) => ids.includes(homoHier?.hierarchy?.id),
                )
              : true;
            if (!isPartOfHomo) return;

            const skip = this.findExamByHierarchyService.checkIfSkipEmployee(
              origin,
              employee,
            );
            if (skip) return;

            const expired = this.findExamByHierarchyService.checkExpiredDate(
              origin,
              employee,
            );
            if (!expired.expiredDate) return;
            expiredDate = expired.expiredDate;
            return true;
          });
        });

        const expired = expiredDate ? { expiredDate } : {};

        return { ...employee, ...expired };
      });

      const missingExamExpired = getExpired.filter((e) => {
        if (!e.expiredDate) return true;

        const lastExamValid = this.dayjs
          .dayjs(e.expiredDate)
          .isAfter(this.dayjs.dayjs());

        if (!lastExamValid) return true;
        return false;
      });

      //

      const withExamAndExpired = await this.employeeRepository.findNude({
        where: {
          companyId,
          examsHistory: {
            some: { id: { gt: 0 } },
            none: {
              expiredDate: { gt: this.dayjs.dateNow() },
              exam: { isAttendance: true },
              status: 'DONE',
            },
          },
        },
        select: {
          id: true,
        },
      });

      const withSchedule = await this.employeeRepository.findNude({
        where: {
          companyId,
          examsHistory: {
            some: {
              id: { gt: 0 },
              doneDate: { gte: this.dayjs.dateNow() },
              status: { in: ['PENDING', 'PROCESSING'] },
              exam: { isAttendance: true },
            },
          },
        },
        select: {
          id: true,
        },
      });

      const missingExam2 = await this.employeeRepository.findNude({
        where: { companyId, examsHistory: { none: { id: { gte: 0 } } } },
        select: {
          id: true,
          name: true,
          lastExam: true,
          hierarchyId: true,
          subOffices: { select: { id: true } },
        },
      });

      const getExpired2 = missingExam2.map((employee) => {
        const ids = [
          ...employee.subOffices.map(({ id }) => id),
          employee.hierarchyId,
        ];

        let expiredDate: Date;
        exams.data.find(({ exam, origins }) => {
          if (!exam.isAttendance) return false;

          origins.find((origin) => {
            const isPartOfHomo = origin?.homogeneousGroup
              ? origin.homogeneousGroup?.hierarchyOnHomogeneous?.find(
                  (homoHier) => ids.includes(homoHier?.hierarchy?.id),
                )
              : true;
            if (!isPartOfHomo) return;

            const skip = this.findExamByHierarchyService.checkIfSkipEmployee(
              origin,
              employee,
            );
            if (skip) return;

            const expired = this.findExamByHierarchyService.checkExpiredDate(
              origin,
              employee,
            );
            if (!expired.expiredDate) return;
            expiredDate = expired.expiredDate;
            return true;
          });
        });

        const expired = expiredDate ? { expiredDate } : {};

        return { ...employee, ...expired };
      });

      const missingExamExpired2 = getExpired2.filter((e) => {
        if (!e.expiredDate) return true;

        const lastExamValid = this.dayjs
          .dayjs(e.expiredDate)
          .isAfter(this.dayjs.dayjs());

        if (!lastExamValid) return true;
        return false;
      });

      return {
        allWithExam,
        allWithExamExpired,
        allWithExamSchedule,
        missingExamExpired,
        exams: {
          exams: exams.data,
          withSchedule,
          missingExam2,
          expired: { missingExamExpired2, withExamAndExpired },
        },
      };
    } catch (e) {
      this.errorCompanies.push(companyId);
      this.error = e;
    }
  }
}
