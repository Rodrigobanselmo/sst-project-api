import { Injectable } from '@nestjs/common';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { EmployeeEntity } from '../../../../company/entities/employee.entity';
import { EmployeeRepository } from '../../../../company/repositories/implementations/EmployeeRepository';
import { FindExamByHierarchyService } from '../find-by-hierarchy /find-exam-by-hierarchy.service';

import { asyncBatch } from '../../../../../shared/utils/asyncBatch';

export const standardDate = '1900-01-01';
@Injectable()
export class ReloadEmployeeExamTimeService {
  private standardDate = standardDate;

  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly findExamByHierarchyService: FindExamByHierarchyService,
    private readonly dayjs: DayJSProvider,
  ) {}

  async reloadEmployeeExamTime(companyId: string, options?: { employeeIds?: number[] }) {
    const datewww = this.dayjs.dayjs(this.standardDate).toDate();

    const allEmployees = (
      await this.employeeRepository.findReloadEmployeeExamTime(
        { companyId, employeeIds: options.employeeIds },
        {},
        { skipNewExamAdded: true },
      )
    ).map((e) => ({
      ...e,
      expiredDateExamOld: e.expiredDateExam,
    }));

    const allWithMissingExam = [] as EmployeeEntity[];

    allEmployees.forEach((employee) => {
      const hasExam = employee?.examsHistory?.length > 0;
      const missingExam = employee?.examsHistory?.length == 0;

      if (!employee.hierarchyId) {
        const dismissalStart = employee.hierarchyHistory.find((h) => h.motive == 'DEM')?.startDate;
        const dismissal = employee.status == 'INACTIVE';

        if (dismissal && dismissalStart) {
          employee.expiredDateExam = dismissalStart;

          const demExamIndex = employee.examsHistory.findIndex((exam) => {
            if (exam.examType == 'DEMI') return true;
            return false;
          });

          const isDone = employee.examsHistory[demExamIndex]?.status == 'DONE';
          const isDismissalLastExam = demExamIndex != -1 && employee.examsHistory.length - 1 == demExamIndex;

          if (isDismissalLastExam && isDone) {
            employee.expiredDateExam = null;
          }
          return;
        }
      }

      if (hasExam) {
        // > add expired Date
        {
          const doneExamFound = employee.examsHistory.find((exam) => {
            const isDone = exam.status === 'DONE';
            if (isDone) return true;
            return false;
          });

          const scheduleExamFound = employee.examsHistory.find((exam) => {
            const isSchedule = ['PROCESSING', 'PENDING'].includes(exam.status);
            if (!isSchedule) return false;

            const isDoneDateValid = this.dayjs.dayjs(exam.doneDate).isAfter(this.dayjs.dateNow());
            if (!isDoneDateValid) return false;

            return true;
          });

          // >> logic newExamAdded
          {
            if (employee.newExamAdded && doneExamFound) {
              // const doneDateExam = doneExamFound.doneDate;

              // if (this.dayjs.format(doneDateExam, 'YYYY-MM-DD') <= this.dayjs.format(employee.newExamAdded, 'YYYY-MM-DD')) {
              doneExamFound.expiredDate = employee.newExamAdded;
              // }
            }
          }

          if (doneExamFound) employee.expiredDateExam = doneExamFound.expiredDate;
          if (!doneExamFound && scheduleExamFound && employee.lastExam) {
            const expiredDate = this.dayjs
              .dayjs(employee.lastExam)
              .add(scheduleExamFound.validityInMonths, 'month')
              .toDate();
            employee.expiredDateExam = expiredDate;
          }
        }
        // > add expired Date
      }

      if (missingExam) {
        employee.expiredDateExam = null;
        allWithMissingExam.push(employee);
      }
    });

    //TODO qualquer coisa pode ver e mockar isso aqui
    const exams =
      allWithMissingExam.length != 0
        ? await this.findExamByHierarchyService.execute({ targetCompanyId: companyId }, {})
        : undefined;

    const getExpired = allWithMissingExam.map((employee) => {
      const ids = [...employee.subOffices.map(({ id }) => id), employee.hierarchyId];

      let expiredDate: Date;
      if (exams) {
        const examsIds = exams.data.map(({ exam }) => exam.id);
        const examsUniqueIds = [...new Set(examsIds)];

        examsUniqueIds.map((examId) => {
          exams.data.find(({ exam, origins }) => {
            if (examId != exam.id) return false;

            origins.find((origin) => {
              const isPartOfHomo = origin?.homogeneousGroup
                ? origin.homogeneousGroup?.hierarchies?.find((hier) => ids.includes(hier?.id))
                : true;
              if (!isPartOfHomo) return;

              const skip = this.findExamByHierarchyService.checkIfSkipEmployee(origin, employee);
              if (skip) return;

              const expired = this.findExamByHierarchyService.checkExpiredDate(origin, employee);
              if (!expired.expiredDate) return;

              if (!expiredDate || expiredDate > expired.expiredDate) expiredDate = expired.expiredDate;

              return true;
            });
          });
        });
      }

      const expired = expiredDate ? { expiredDate } : {};

      if (expiredDate) employee.expiredDateExam = expiredDate;
      return { ...employee, ...expired };
    });

    const missingExamExpired = getExpired.filter((e) => {
      if (!e.expiredDate) return true;

      const lastExamValid = this.dayjs.dayjs(e.expiredDate).isAfter(this.dayjs.dayjs());

      if (!lastExamValid) return true;
      return false;
    });

    await asyncBatch(allEmployees, 100, async (e) => {
      if (e.expiredDateExam && e.expiredDateExam != e.expiredDateExamOld)
        await this.employeeRepository.updateNude({
          where: { id: e.id },
          data: { expiredDateExam: e.expiredDateExam, skippedDismissalExam: null },
        });
      if (e.expiredDateExam === null && e.expiredDateExamOld != datewww)
        await this.employeeRepository.updateNude({
          where: { id: e.id },
          data: { expiredDateExam: datewww, skippedDismissalExam: null },
        });
    });

    return {
      all: allEmployees,
      allWithMissingExam,
      missingExamExpired,
    };
  }
}
