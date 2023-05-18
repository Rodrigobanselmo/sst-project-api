import { CompanyRepository } from './../../../../company/repositories/implementations/CompanyRepository';
import { IExamOrigins } from './../../../entities/exam.entity';
import { EmployeeEntity } from './../../../../company/entities/employee.entity';
import { standardDate } from './../../../../company/services/report/update-all-companies/update-all-companies.service';
import { Injectable } from '@nestjs/common';

import { asyncBatch } from '../../../../../shared/utils/asyncBatch';
import { EmployeeRepository } from '../../../../company/repositories/implementations/EmployeeRepository';
import { CheckEmployeeExamDto } from '../../../dto/exam.dto';
import { FindExamByHierarchyService } from '../find-by-hierarchy /find-exam-by-hierarchy.service';
import { ReloadEmployeeExamTimeService } from '../reload-employee-exam-time/reload-employee-exam-time.service';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { dismissalDate, riskAllId } from '../../../../../shared/constants/ids';
import { isShouldDemissionBlock } from '../../../../../shared/utils/demissionalBlockCalc';
import { ExamHistoryTypeEnum, ExamTypeEnum } from '@prisma/client';
import { StatusEmployeeStepEnum } from '../../../../../shared/constants/enum/statusEmployeeStep.enum';

@Injectable()
export class CheckEmployeeExamService {
  constructor(
    private readonly findExamByHierarchyService: FindExamByHierarchyService,
    private readonly employeeRepository: EmployeeRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly reloadEmployeeExamTimeService: ReloadEmployeeExamTimeService,
    private readonly dayjs: DayJSProvider,
  ) { }

  async execute(body: CheckEmployeeExamDto) {
    const homogeneousGroupId = body.homogeneousGroupId;
    const hierarchyId = body.hierarchyId;
    const employeeId = body.employeeId;
    const companyId = body.companyId;
    const riskId = riskAllId == body.riskId ? undefined : body.riskId;

    const riskIds = body.riskIds;
    const skipRiskIds = body.riskIds?.find((riskId) => riskAllId == riskId);
    const homogeneousGroupIds = body.homogeneousGroupIds;

    const allEmployeesPromise = this.employeeRepository.findNude({
      where: {
        status: { not: 'CANCELED' },
        OR: [
          {
            skippedDismissalExam: false,
          },
          {
            skippedDismissalExam: null,
          },
        ],
        ...(hierarchyId && { hierarchyId }),
        ...(employeeId && { id: employeeId }),
        ...(homogeneousGroupId && { hierarchy: { hierarchyOnHomogeneous: { some: { homogeneousGroupId: homogeneousGroupId } } } }),
        ...(homogeneousGroupIds && { hierarchy: { hierarchyOnHomogeneous: { some: { homogeneousGroupId: { in: homogeneousGroupIds } } } } }),
        ...(companyId && { companyId }),
        ...(companyId &&
          riskId && { companyId, hierarchy: { hierarchyOnHomogeneous: { some: { homogeneousGroup: { riskFactorData: { some: { riskId: riskId } } } } } } }),
        ...(companyId &&
          !skipRiskIds &&
          riskIds && { companyId, hierarchy: { hierarchyOnHomogeneous: { some: { homogeneousGroup: { riskFactorData: { some: { riskId: { in: riskIds } } } } } } } }),
      },
      select: {
        id: true,
        companyId: true,
        hierarchyId: true,
        lastExam: true,
        status: true,
        hierarchy: {
          select: {
            id: true,
            parent: {
              select: {
                id: true,
                parent: {
                  select: {
                    id: true,
                    parent: {
                      select: {
                        id: true,
                        parent: { select: { id: true } },
                      },
                    },
                  },
                },
              },
            },
          },
        },

        expiredDateExam: true,
        hierarchyHistory: {
          take: 2,
          select: { startDate: true, motive: true, hierarchyId: true },
          orderBy: { startDate: 'desc' },
        },

        birthday: true,
        sex: true,
        subOffices: { select: { id: true } },
        examsHistory: {
          select: {
            doneDate: true,
            expiredDate: true,
            status: true,
            examType: true,
            evaluationType: true,
            hierarchyId: true,
            validityInMonths: true,
            examId: true,
            exam: {
              select: { isAttendance: true },
            },
          },
          orderBy: { doneDate: 'desc' },
          distinct: ['examId', 'status'],
          where: {
            exam: { isAvaliation: false },
            status: { in: ['DONE'] },
            // OR: [
            //   {
            //     status: { in: ['DONE'] },
            //   },
            // {
            //   status: { in: ['PROCESSING', 'PENDING'] },
            //   doneDate: { gte: this.dayjs.dateNow() },
            // },
            // ],
          },
        },
      },
    });

    const allEmployee = await allEmployeesPromise;

    if (allEmployee.length == 0) return;

    const onlyOne = allEmployee.length == 1;
    const companyIdFound = companyId || allEmployee[0].companyId;

    const exams = await this.findExamByHierarchyService.execute(
      { targetCompanyId: companyIdFound },
      { ...(onlyOne ? { employeeId: allEmployee[0].id, hierarchyId: allEmployee[0].hierarchyId } : { getAllExamToRiskWithoutHierarchy: true }) },
      { ...(onlyOne && { employee: allEmployee[0] }) },
    );

    await asyncBatch(allEmployee, 10, async (employee) => {
      let expiredDate: Date | null;

      const { expiredDateExam: expiredDateExamDismissal } = await this.handleMissingHierarchy(employee, exams.data);

      if (expiredDateExamDismissal !== undefined) {
        expiredDate = expiredDateExamDismissal;
      } else {
        const { expiredDateExam } = this.checkExpiredExam(employee, exams.data, { onlyOne });
        expiredDate = expiredDateExam || null;
      }

      const isBothNull = expiredDate == null && employee.expiredDateExam == null;
      const isSameDate = expiredDate && employee.expiredDateExam && expiredDate.getTime() == employee.expiredDateExam.getTime();
      const isEqual = isSameDate || isBothNull;

      if (!isEqual) {
        await this.employeeRepository.updateNude({
          where: { id: employee.id },
          data: { expiredDateExam: expiredDate, skippedDismissalExam: null },
          select: null,
        });
      }
    });

    return;
  }

  async handleMissingHierarchy(employee: EmployeeEntity, examData: IExamOrigins[]) {
    const { dismissalStart, isDismissal } = this.getIsDismissal(employee);
    if (isDismissal) {
      let expiredDateExam = dismissalStart;

      const allClinicExams = employee.examsHistory.filter((examHis) => examHis.status == 'DONE');
      const isDismissalLastExam = allClinicExams?.[0]?.examType == 'DEMI';

      if (isDismissalLastExam) {
        expiredDateExam = this.dayjs.dayjs(dismissalDate).toDate();
      } else {
        const { isExpiredExam } = this.checkExpiredExam(employee, examData, { isDismissal: true });
        const lastDoneClinicExam = employee.examsHistory?.find((examHist) => examHist.status == 'DONE' && examHist.exam.isAttendance);

        if (!isExpiredExam && lastDoneClinicExam?.doneDate) {
          const company = await this.companyRepository.findFirstNude({
            where: { id: employee.companyId },
            select: {
              primary_activity: true,
              blockResignationExam: true,
            },
          });

          if (company.blockResignationExam) {
            const isBlock = isShouldDemissionBlock(company, {
              doneDate: lastDoneClinicExam.doneDate,
              dismissalDate: dismissalStart,
            });

            if (isBlock) {
              expiredDateExam = this.dayjs.dayjs(dismissalDate).toDate();
            }
          }
        }
      }

      return { expiredDateExam };
    }

    return { expiredDateExam: undefined };
  }

  getIsDismissal(employee: EmployeeEntity) {
    if (!employee.hierarchyId) {
      const dismissalStart = employee.hierarchyHistory.find((h) => h.motive == 'DEM')?.startDate;
      const dismissal = employee.status == 'INACTIVE';

      return { isDismissal: !!(dismissal && dismissalStart), dismissalStart };
    }

    return { isDismissal: false, dismissalStart: undefined };
  }

  checkExpiredExam(employee: EmployeeEntity, examsData: IExamOrigins[], options?: { onlyOne?: boolean; isDismissal?: boolean }) {
    let expiredComplementaryDate: Date;
    let expiredClinicDate: Date;
    let isExpiredExam = false;
    let employeeExamType: ExamHistoryTypeEnum = options?.isDismissal ? ExamHistoryTypeEnum.DEMI : ExamHistoryTypeEnum.PERI;

    let hasComplementary = false;

    const hierarchyIds = [...employee?.subOffices?.map(({ id }) => id)];

    if (employee.hierarchyId) {
      hierarchyIds.push(employee.hierarchyId);

      const hierarchyParentIds = employee?.hierarchy?.parents?.map((parent) => parent.id);
      if (hierarchyParentIds) {
        hierarchyIds.push(...hierarchyParentIds);
      }
    }

    let examFilteredOrigins: IExamOrigins[] = [];

    if (options.onlyOne) {
      examFilteredOrigins = this.findExamByHierarchyService.filterOrigins(examsData);
    } else {
      examFilteredOrigins = this.findExamByHierarchyService.filterOriginsByEmployee(examsData, employee, hierarchyIds);
    }

    const { examType: typeOfExam, examPossibleType } = this.getExamType(employee, examFilteredOrigins);

    const originsExams = examFilteredOrigins
      .map(({ exam, origins }) => {
        const isClinic = exam.isAttendance;

        return origins?.find((origin) => {
          let expiredOrigin = origin?.expiredDate;

          const examType = options?.isDismissal ? 'isDismissal' : typeOfExam;

          if (!origin?.[examType as any]) return false; // examType can not be isOffice, nao aceita esse valor somente isPer.., isAdm..

          // if is in_admission will add expired date as admission date
          if (['isAdmission'].includes(examType)) {
            const actualHierarchyHistory = employee.hierarchyHistory[0];
            const startDate = actualHierarchyHistory?.startDate;

            if (startDate) {
              employeeExamType = ExamHistoryTypeEnum.ADMI;
              expiredOrigin = startDate;
            }
          }

          if (!isClinic && ['isOffice'].includes(examPossibleType)) {
            const actualHierarchyHistory = employee.hierarchyHistory[0];
            const startDate = actualHierarchyHistory?.startDate;

            const beforeHierarchyHistory = employee.hierarchyHistory[1];
            const beforeStartDate = beforeHierarchyHistory?.startDate;

            const newExamInHierarchy = !expiredOrigin || (beforeStartDate && beforeStartDate > origin.doneDate);

            if (newExamInHierarchy && startDate) {
              employeeExamType = ExamHistoryTypeEnum.OFFI;
              expiredOrigin = startDate;
            }
          }

          const isExpiredNull = expiredOrigin === null;
          const replaceExpiredDateComp =
            isExpiredNull || expiredComplementaryDate === undefined || (expiredComplementaryDate && expiredComplementaryDate > expiredOrigin);
          const replaceExpiredDateClinic = isExpiredNull || expiredClinicDate === undefined || (expiredClinicDate && expiredClinicDate > expiredOrigin);

          if (!isClinic && replaceExpiredDateComp) expiredComplementaryDate = expiredOrigin;
          if (isClinic && replaceExpiredDateClinic) expiredClinicDate = expiredOrigin;

          const isExpired = !expiredOrigin || (expiredOrigin && expiredOrigin <= new Date());

          if (isExpired) isExpiredExam = true;
          if (!isClinic) hasComplementary = true;

          return true;
        });
      })
      .filter((origin) => origin);

    let expiredDate: Date | null = null;

    if (hasComplementary && expiredClinicDate && expiredComplementaryDate) {
      const isComplementaryBeforeClinic = expiredComplementaryDate < expiredClinicDate;

      if (isComplementaryBeforeClinic) {
        const isComplementaryCloseToClinic = Math.abs(this.dayjs.compareTime(expiredClinicDate, expiredComplementaryDate, 'days')) <= 75;

        if (isComplementaryCloseToClinic) {
          expiredDate = expiredClinicDate;
        } else {
          expiredDate = expiredComplementaryDate;
        }
      } else {
        expiredDate = expiredClinicDate;
      }
    }

    if (!hasComplementary && expiredClinicDate) {
      expiredDate = expiredClinicDate;
    }

    return { isExpiredExam, expiredDateExam: expiredDate, originsExams, employeeExamType };
  }

  getExamType(employee: EmployeeEntity, examFilteredOrigins: IExamOrigins[]) {
    let examPossibleType: string;
    let examType = 'isPeriodic';

    const actualHierarchyHistory = employee.hierarchyHistory[0];
    const beforeHierarchyHistory = employee.hierarchyHistory[1];

    const isBeforeHierarchyDem = beforeHierarchyHistory?.motive == 'DEM';

    const lastDoneClinicExam = employee.examsHistory.find((examHist) => examHist.status == 'DONE' && examHist.exam.isAttendance);

    const isLastExamBeforeActualHierarchyStartDate = lastDoneClinicExam?.doneDate && lastDoneClinicExam.doneDate < actualHierarchyHistory?.startDate;
    const isLastExamNotActualHierarchy = lastDoneClinicExam?.hierarchyId && lastDoneClinicExam.hierarchyId != actualHierarchyHistory?.hierarchyId;

    if (isLastExamBeforeActualHierarchyStartDate && (isLastExamNotActualHierarchy || !lastDoneClinicExam.hierarchyId)) {
      if (beforeHierarchyHistory && !isBeforeHierarchyDem) {
        examPossibleType = 'isOffice';
      }
    }

    const isInAdmission = employee.statusStep == StatusEmployeeStepEnum.IN_ADMISSION;
    if (isInAdmission) {
      examType = 'isAdmission';
    }

    return { examPossibleType, examType };
  }
}
