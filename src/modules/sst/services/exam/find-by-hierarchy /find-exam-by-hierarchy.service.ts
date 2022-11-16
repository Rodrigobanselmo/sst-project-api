import { EmployeeExamsHistoryEntity } from '../../../../company/entities/employee-exam-history.entity';
import { getRiskDoc } from '../../../../documents/services/pgr/document/upload-pgr-doc.service';
import { RiskFactorDataEntity } from '../../../entities/riskData.entity';
import { FindExamHierarchyDto } from '../../../dto/exam.dto';
import { ExamRiskEntity } from '../../../entities/examRisk.entity';
import { EmployeeEntity } from '../../../../company/entities/employee.entity';
import { EmployeeRepository } from '../../../../company/repositories/implementations/EmployeeRepository';
import { IExamOriginData } from '../../../entities/exam.entity';
import { Injectable } from '@nestjs/common';
import { HomoTypeEnum, SexTypeEnum, StatusEnum } from '@prisma/client';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { ExamRepository } from '../../../repositories/implementations/ExamRepository';
import { originRiskMap } from '../../../../../shared/constants/maps/origin-risk';
import { RiskDataRepository } from '../../../repositories/implementations/RiskDataRepository';
import { sortNumber } from '../../../../../shared/utils/sorts/number.sort';
import { sortString } from '../../../../../shared/utils/sorts/string.sort';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';

export const getValidityInMonths = (employee: EmployeeEntity, examRisk: { validityInMonths?: number; lowValidityInMonths?: number }) => {
  return employee.isComorbidity ? examRisk.lowValidityInMonths || examRisk.validityInMonths : examRisk.validityInMonths;
};
@Injectable()
export class FindExamByHierarchyService {
  private employee: EmployeeEntity;
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

    const hierarchies = [hierarchy, ...(hierarchy?.parents || [])].filter((h) => h);

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
      this.employee = await this.employeeRepository.findById(query.employeeId, companyId, {
        include: {
          subOffices: { select: { id: true } },
          examsHistory: {
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
      if (this.employee && !query.isOffice) {
        hierarchies.push(...(this.employee?.subOffices || []));
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
                  where: { homogeneousGroup: { type: 'HIERARCHY' } },
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
          companyId,
          ...(hierarchyIds.length > 0 && {
            homogeneousGroup: {
              hierarchyOnHomogeneous: {
                some: { hierarchyId: { in: hierarchyIds } },
              },
            },
          }),
          OR: [
            {
              examsToRiskFactorData: {
                some: {
                  examId: { gt: 0 },
                  ...(query.onlyAttendance && { exam: { isAttendance: true } }),
                },
              },
            },
            // ...(hierarchyIds.length > 0
            // ? [
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
            // ]
            // : []),
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
      rd.examsToRiskFactorData.forEach((examData) => {
        if (!exams[examData.examId]) exams[examData.examId] = [];
        exams[examData.examId].push({
          ...examData,
          origin: examData.isStandard ? 'Padrão' : rd.origin,
          prioritization: (examData.isStandard ? 100 : rd.prioritization) || 3,
          homogeneousGroup: rd.homogeneousGroup,
          skipEmployee: this.checkIfSkipEmployee(examData, this.employee),
          risk: rd.riskFactor,
          ...this.checkExpiredDate(examData, this.employee),
        });
      });
      // exams
    });

    const examRepresentAll =
      // hierarchyIds.length > 0
      // ?
      await this.examRepository.findNude({
        select: {
          examToRisk: {
            where: { companyId, ...examType },
            distinct: ['isMale', 'isAdmission', 'isDismissal', 'isPeriodic', 'isReturn', 'isMale', 'isFemale', 'fromAge', 'toAge', 'validityInMonths'],
          },
          name: true,
          id: true,
          isAttendance: true,
        },
        where: {
          AND: [
            {
              //tenant
              OR: [
                { system: true },
                { companyId },
                {
                  company: {
                    applyingServiceContracts: {
                      some: { receivingServiceCompanyId: companyId },
                    },
                  },
                },
                {
                  company: {
                    receivingServiceContracts: {
                      some: { applyingServiceCompanyId: companyId },
                    },
                  },
                },
              ],
            },
            {
              // rules
              OR: [
                {
                  examToRisk: {
                    some: {
                      companyId: companyId,
                      risk: { representAll: true },
                    },
                  },
                  ...(query.onlyAttendance && {
                    isAttendance: true,
                  }),
                },
              ],
            },
          ],
        },
      });
    // : { data: [] };

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
          skipEmployee: this.checkIfSkipEmployee(examToRisk, this.employee),
          risk: examToRisk.risk,
          ...this.checkExpiredDate({ ...examToRisk, exam }, this.employee),
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
    };
  }

  checkIfSkipEmployee(examRisk: IExamOriginData, employee: EmployeeEntity) {
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
