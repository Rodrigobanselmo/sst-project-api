import { HierarchyEntity } from './../../../../company/entities/hierarchy.entity';
import { Injectable } from '@nestjs/common';
import { HomoTypeEnum, Prisma, SexTypeEnum, StatusEnum } from '@prisma/client';

import { originRiskMap } from '../../../../../shared/constants/maps/origin-risk';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { sortNumber } from '../../../../../shared/utils/sorts/number.sort';
import { sortString } from '../../../../../shared/utils/sorts/string.sort';
import { EmployeeExamsHistoryEntity } from '../../../../company/entities/employee-exam-history.entity';
import { EmployeeEntity } from '../../../../company/entities/employee.entity';
import { EmployeeRepository } from '../../../../company/repositories/implementations/EmployeeRepository';
import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { getRiskDoc } from '../../../../documents/services/pgr/document/upload-pgr-doc.service';
import { FindExamHierarchyDto } from '../../../dto/exam.dto';
import { IExamOriginData, IExamEmployeeCheck } from '../../../entities/exam.entity';
import { ExamRepository } from '../../../repositories/implementations/ExamRepository';
import { RiskDataRepository } from '../../../repositories/implementations/RiskDataRepository';

export const getValidityInMonths = (employee: EmployeeEntity, examRisk: { validityInMonths?: number; lowValidityInMonths?: number }) => {
  return employee.isComorbidity ? examRisk.lowValidityInMonths || examRisk.validityInMonths : examRisk.validityInMonths;
};
@Injectable()
export class FindExamByHierarchyService {
  private clinicExamCloseToExpire = 45;

  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly examRepository: ExamRepository,
    private readonly riskDataRepository: RiskDataRepository,
    private readonly hierarchyRepository: HierarchyRepository,
    private readonly dayjs: DayJSProvider,
  ) {}

  async execute(user: Pick<UserPayloadDto, 'targetCompanyId'>, query: FindExamHierarchyDto) {
    const hierarchyId = query.hierarchyId;
    const companyId = user.targetCompanyId;
    const hierarchy = hierarchyId ? await this.hierarchyRepository.findByIdWithParent(hierarchyId, companyId) : undefined;
    let employee: EmployeeEntity;

    const hierarchies: Partial<HierarchyEntity>[] = [hierarchy, ...(hierarchy?.parents || [])].filter((h) => h);
    const date = new Date();

    const examType = {
      ...('isPeriodic' in query && {
        isPeriodic: query?.isPeriodic,
      }),
      ...('isChange' in query && { isChange: query?.isChange }),
      ...('isAdmission' in query && {
        isAdmission: query?.isAdmission,
      }),
      ...('isReturn' in query && { isReturn: query?.isReturn }),
      ...('isDismissal' in query && {
        isDismissal: query?.isDismissal,
      }),
    };

    if (query.employeeId) {
      employee = await this.employeeRepository.findById(query.employeeId, companyId, {
        include: {
          subOffices: { select: { id: true } },
          examsHistory: {
            orderBy: { doneDate: 'desc' },
            where: {
              AND: [
                { expiredDate: { gte: new Date() } },
                {
                  status: query.isPendingExams ? { in: ['PENDING', 'PROCESSING'] } : 'DONE',
                },
              ],
            },
          },
        },
      });
      if (employee && !query.isOffice) {
        hierarchies.push(...(employee?.subOffices || []));
      }
    }

    const hierarchyIds = hierarchies.map(({ id }) => id);

    const riskData = (
      await this.riskDataRepository.findNude({
        select: {
          examsToRiskFactorData: {
            include: {
              exam: { select: { name: true, id: true, isAttendance: true } },
            },
            where: { ...examType },
          },
          riskFactor: {
            select: {
              name: true,
              severity: true,
              type: true,
              representAll: true,
              id: true,
              isAso: true,
              isPCMSO: true,
              docInfo: {
                where: {
                  OR: [
                    { companyId },
                    {
                      company: {
                        applyingServiceContracts: {
                          some: { receivingServiceCompanyId: companyId },
                        },
                      },
                    },
                  ],
                },
              },
              examToRisk: {
                include: {
                  exam: {
                    select: { name: true, id: true, isAttendance: true },
                  },
                },
                where: {
                  companyId,
                  exam: { isAttendance: false },
                  ...examType,
                },
              },
            },
          },
          homogeneousGroup: {
            include: {
              hierarchyOnHomogeneous: {
                select: {
                  hierarchy: { select: { id: true, type: true, name: true } },
                },
                ...(hierarchyId && {
                  where: {
                    homogeneousGroup: { type: 'HIERARCHY' },
                    ...(date && { AND: [{ OR: [{ startDate: { lte: date } }, { startDate: null }] }, { OR: [{ endDate: { gt: date } }, { endDate: null }] }] }),
                  },
                }),
              },
              characterization: { select: { name: true, type: true } },
              environment: { select: { name: true, type: true } },
            },
          },
          id: true,
          probability: true,
          probabilityAfter: true,
          companyId: true,
          hierarchyId: true,
          homogeneousGroupId: true,
          riskId: true,
          dataRecs: true,
          level: true,
          json: true,
          standardExams: true,
          riskFactorGroupDataId: true,
        },
        where: {
          ...(date && { AND: [{ OR: [{ startDate: { lte: date } }, { startDate: null }] }, { OR: [{ endDate: { gt: date } }, { endDate: null }] }] }),
          companyId,
          ...(hierarchyIds.length > 0 && {
            homogeneousGroup: {
              hierarchyOnHomogeneous: {
                some: {
                  ...(date && { AND: [{ OR: [{ startDate: { lte: date } }, { startDate: null }] }, { OR: [{ endDate: { gt: date } }, { endDate: null }] }] }),
                  hierarchyId: { in: hierarchyIds },
                },
              },
            },
          }),
          // here we check if has standard exam and is check OR if exam is directly add to risk
          OR: [
            {
              examsToRiskFactorData: {
                some: {
                  examId: { gt: 0 },
                  ...(query.onlyAttendance && { exam: { isAttendance: true } }),
                },
              },
            },
            ...(hierarchyIds.length > 0
              ? [
                  {
                    riskFactor: {
                      examToRisk: {
                        some: {
                          examId: { gt: 0 },
                          ...(query.onlyAttendance && {
                            exam: { isAttendance: true },
                          }),
                        },
                      },
                    },
                    standardExams: true,
                  },
                ]
              : []),
          ],
        },
      })
    ).filter((riskData) => {
      return getRiskDoc(riskData.riskFactor, { companyId, hierarchyId })?.isAso;
    });

    const riskDataOrigin = riskData.map((rd) => {
      let prioritization: number;

      if (rd.homogeneousGroup.type === HomoTypeEnum.HIERARCHY && rd.homogeneousGroup.hierarchy) {
        prioritization = originRiskMap[rd.homogeneousGroup.hierarchy.type]?.prioritization;
      }

      rd.examsToRiskFactorData = rd.examsToRiskFactorData.filter(
        (item, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.examId == item.examId &&
              t.isMale == item.isMale &&
              t.isAdmission == item.isAdmission &&
              t.isDismissal == item.isDismissal &&
              t.isPeriodic == item.isPeriodic &&
              t.isReturn == item.isReturn &&
              t.isMale == item.isMale &&
              t.isFemale == item.isFemale &&
              t.fromAge == item.fromAge &&
              t.toAge == item.toAge &&
              t.validityInMonths == item.validityInMonths &&
              t.riskFactorDataId == item.riskFactorDataId,
          ),
      );

      return { ...rd, prioritization };
    });
    const exams: Record<string, IExamOriginData[]> = {};

    riskDataOrigin.forEach((rd) => {
      [...rd.examsToRiskFactorData, ...rd.riskFactor.examToRisk].forEach((examData) => {
        const isStandard = !('isStandard' in examData) || (examData as any)?.isStandard;

        if (!exams[examData.examId]) exams[examData.examId] = [];
        exams[examData.examId].push({
          ...examData,
          origin: isStandard ? `Padrão (${rd.origin && rd.origin})` : rd.origin,
          prioritization: (isStandard ? 100 : rd.prioritization) || 3,
          homogeneousGroup: rd.homogeneousGroup,
          skipEmployee: this.checkIfSkipEmployee(examData, employee),
          risk: rd.riskFactor,
          ...this.checkExpiredDate(examData, employee),
        });
      });
      // exams
    });

    // const examRepresentAll = hierarchyIds.length > 0 ? await this.onGetAllExams(companyId, { examsTypes: examType, onlyAttendance: query.onlyAttendance }) : { data: [] };
    const examRepresentAll = await this.onGetAllExams(companyId, { examsTypes: examType, onlyAttendance: query.onlyAttendance });

    examRepresentAll.data.map((exam) => {
      exam.examToRisk.map((examToRisk) => {
        if (!exams[examToRisk.examId]) exams[examToRisk.examId] = [];
        exams[examToRisk.examId].push({
          ...examToRisk,
          origin: 'Padrão',
          isStandard: true,
          exam: {
            name: exam.name,
            id: exam.id,
            isAttendance: !!exam?.isAttendance,
          } as any,
          prioritization: 100,
          skipEmployee: this.checkIfSkipEmployee(examToRisk, employee),
          risk: examToRisk.risk,
          ...this.checkExpiredDate({ ...examToRisk, exam }, employee),
        });
      });
    });

    const lastClinicExam = {
      expiredDate: new Date(),
      closeToExpired: true,
    };

    const examsDataReturn = (
      Object.entries(exams)
        .map(([examId, examData]) => {
          const origins = examData.sort((a, b) => sortNumber(a, b, 'validityInMonths')).sort((a, b) => sortNumber(a, b, 'prioritization')) as IExamOriginData[];

          const isAttendance = examData[0]?.exam?.isAttendance;

          if (isAttendance) {
            const origin = origins.find((a) => !a.skipEmployee);
            if (origin) {
              lastClinicExam.expiredDate = origin.expiredDate;
              lastClinicExam.closeToExpired = origin.closeToExpired;
            }
          }

          return {
            exam: {
              id: examId,
              name: examData[0]?.exam?.name,
              isAttendance,
            },
            origins,
          };
        })
        .sort((a, b) => sortString(a.exam, b.exam, 'name'))
        .sort((a, b) => sortNumber(b.exam.isAttendance ? 1 : 0, a.exam.isAttendance ? 1 : 0)) as any
    ).map((data) => {
      data.origins = data.origins.map((origin) => {
        if (origin.status == StatusEnum.ACTIVE) {
          origin.status = StatusEnum.DONE;
          origin.closeToExpired = lastClinicExam.closeToExpired;
          origin.expiredDate = lastClinicExam.expiredDate;
        }
        return origin;
      });

      return data;
    });

    return {
      data: examsDataReturn as {
        exam: {
          id: string;
          name: string;
          isAttendance: boolean;
        };
        origins: IExamOriginData[];
      }[],
      // employee,
    };
  }

  checkIfSkipEmployee(examRisk: IExamEmployeeCheck, employee: EmployeeEntity) {
    if (!employee) return null;

    // if (employee.lastExam) {
    // const lastExamValid = this.dayjs
    //   .dayjs(employee.lastExam)
    //   .add(getValidityInMonths(employee, examRisk), 'month')
    //   .isAfter(this.dayjs.dayjs());

    // if (lastExamValid) return true;
    // }

    const age = this.dayjs.dayjs().diff(employee.birthday, 'years');
    const isOutOfAgeRange = (examRisk.fromAge && examRisk.fromAge > age) || (examRisk.toAge && examRisk.toAge < age);

    if (isOutOfAgeRange) return true;

    const isMale = employee.sex === SexTypeEnum.M;
    const isNotIncludeMale = employee.sex && isMale && !examRisk.isMale;
    const isNotIncludeFemale = employee.sex && !isMale && !examRisk.isFemale;

    if (isNotIncludeMale) return true;
    if (isNotIncludeFemale) return true;

    // const isExamValid = employee.examsHistory.some(
    //   (exam) =>
    //     exam.examId === examRisk.examId &&
    //     this.dayjs.compareTime(
    //       this.dayjs.dateNow(),
    //       exam.expiredDate,
    //       'days',
    //     ) >= examRisk.considerBetweenDays,
    // );

    // if (isExamValid) return true;

    return false;
  }

  checkExpiredDate(examRisk: IExamOriginData, employee: EmployeeEntity) {
    if (!employee) return null;

    const foundExamHistory = employee?.examsHistory?.find((exam) => exam.examId === examRisk.examId) || ({} as EmployeeExamsHistoryEntity);

    if (!foundExamHistory?.expiredDate && employee.lastExam) {
      foundExamHistory.expiredDate = this.dayjs.dayjs(employee.lastExam).add(getValidityInMonths(employee, examRisk), 'month').toDate();

      foundExamHistory.status = StatusEnum.ACTIVE;
    }

    if (!foundExamHistory?.expiredDate) return {};

    const closeValidated = examRisk.considerBetweenDays || (examRisk.exam.isAttendance ? this.clinicExamCloseToExpire : null);

    const closeToExpired = closeValidated !== null && this.dayjs.compareTime(this.dayjs.dateNow(), foundExamHistory.expiredDate, 'days') <= closeValidated;

    return {
      closeToExpired,
      expiredDate: foundExamHistory.expiredDate,
      status: foundExamHistory.status,
    };
  }

  checkCloseToExpiredDate(
    examsDataReturn: {
      exam: {
        id: string;
        name: string;
        isAttendance: boolean;
      };
      origins: IExamOriginData[];
    }[],
  ) {
    const foundExam = examsDataReturn.find((exam) => exam?.exam?.isAttendance);
    if (!foundExam) return examsDataReturn;

    const clinicValidityInMonths = foundExam.origins.find((exam) => !exam.skipEmployee)?.validityInMonths;

    return examsDataReturn.map((examsData) => {
      examsData.origins = examsData.origins.map((origin) => {
        // const closeToExpired =
        //   considerBetweenDays !== null &&
        //   this.dayjs.compareTime(
        //     this.dayjs.dateNow(),
        //     origin.expiredDate,
        //     'days',
        //   ) >= considerBetweenDays;

        // if (closeToExpired) origin.closeToExpired = closeToExpired;

        return origin;
      });

      return examsData;
    });
  }

  async onGetAllExams(companyId: string, options?: { examsTypes?: Prisma.ExamToRiskWhereInput; onlyAttendance?: boolean }) {
    const examRepresentAll = await this.examRepository.findNude({
      select: {
        examToRisk: {
          where: {
            companyId,
            risk: { representAll: true },
            ...options?.examsTypes,
          },
        },
        name: true,
        id: true,
        isAttendance: true,
      },
      where: {
        examToRisk: {
          some: {
            companyId: companyId,
            risk: { representAll: true },
          },
        },
        ...(options?.onlyAttendance && {
          isAttendance: true,
        }),
      },
    });

    return examRepresentAll;
  }
}

// const Exam = await this.examRepository.findNude({
//   include: {
//     examToRisk: {
//       include: {
//         risk: {
//           select: {
//             name: true,
//             id: true,
//             representAll: true,
//             riskFactorData: {
//               // include: {
//               //   homogeneousGroup: { include: { characterization: true } },
//               // },
//               where: {
//                 companyId,
//                 homogeneousGroup: {
//                   hierarchyOnHomogeneous: {
//                     some: {
//                       hierarchyId: { in: hierarchyIds },
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//       where: { companyId },
//     },
//     examToRiskData: {
//       include: {
//         risk: {
//           include: {
//             riskFactor: {
//               select: { name: true, id: true },
//             },
//           },
//         },
//       },
//     },
//   },
//   where: {
//     AND: [
//       {
//         //tenant
//         OR: [
//           { system: true },
//           { companyId },
//           {
//             company: {
//               applyingServiceContracts: {
//                 some: { receivingServiceCompanyId: companyId },
//               },
//             },
//           },
//           {
//             company: {
//               receivingServiceContracts: {
//                 some: { applyingServiceCompanyId: companyId },
//               },
//             },
//           },
//         ],
//       },
//       {
//         // rules
//         OR: [
//           {
//             examToRisk: {
//               some: {
//                 companyId: companyId,
//                 risk: {
//                   riskFactorData: {
//                     some: {
//                       examsToRiskFactorData: {
//                         some: {
//                           risk: {
//                             companyId: companyId,
//                             homogeneousGroup: {
//                               hierarchyOnHomogeneous: {
//                                 some: {
//                                   hierarchyId: { in: hierarchyIds },
//                                 },
//                               },
//                             },
//                           },
//                         },
//                       },
//                     },
//                   },
//                 },
//               },
//             },
//           },
//           {
//             examToRisk: {
//               some: {
//                 companyId: companyId,
//                 risk: { representAll: true },
//               },
//             },
//           },
//           {
//             examToRiskData: {
//               some: {
//                 risk: {
//                   companyId: companyId,
//                   examsToRiskFactorData: { some: { examId: { gt: 0 } } },
//                   homogeneousGroup: {
//                     hierarchyOnHomogeneous: {
//                       some: { hierarchyId: { in: hierarchyIds } },
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         ],
//       },
//     ],
//   },
// });
