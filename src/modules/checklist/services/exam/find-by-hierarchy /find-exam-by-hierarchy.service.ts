import { RiskFactorDataEntity } from './../../../entities/riskData.entity';
import { FindExamHierarchyDto } from './../../../dto/exam.dto';
import { ExamRiskEntity } from './../../../entities/examRisk.entity';
import { EmployeeEntity } from './../../../../company/entities/employee.entity';
import { EmployeeRepository } from './../../../../company/repositories/implementations/EmployeeRepository';
import { IExamOriginData } from './../../../entities/exam.entity';
import { Injectable } from '@nestjs/common';
import { HomoTypeEnum, SexTypeEnum } from '@prisma/client';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { ExamRepository } from '../../../repositories/implementations/ExamRepository';
import { originRiskMap } from './../../../../../shared/constants/maps/origin-risk';
import { RiskDataRepository } from './../../../repositories/implementations/RiskDataRepository';
import { sortNumber } from '../../../../../shared/utils/sorts/number.sort';
import { sortString } from '../../../../../shared/utils/sorts/string.sort';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';

@Injectable()
export class FindExamByHierarchyService {
  private employee: EmployeeEntity;

  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly examRepository: ExamRepository,
    private readonly riskDataRepository: RiskDataRepository,
    private readonly hierarchyRepository: HierarchyRepository,
    private readonly dayjs: DayJSProvider,
  ) {}

  async execute(user: UserPayloadDto, query: FindExamHierarchyDto) {
    const hierarchyId = query.hierarchyId;
    const companyId = user.targetCompanyId;
    const hierarchy = hierarchyId
      ? await this.hierarchyRepository.findByIdWithParent(
          hierarchyId,
          companyId,
        )
      : undefined;

    const hierarchies = [hierarchy, ...(hierarchy?.parents || [])].filter(
      (h) => h,
    );

    const hierarchyIds = hierarchies.map(({ id }) => id);
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
      this.employee = await this.employeeRepository.findById(
        query.employeeId,
        companyId,
        {
          include: {
            examsHistory: {
              where: {
                AND: [
                  { expiredDate: { gte: new Date() } },
                  {
                    status: query.isPendingExams
                      ? { in: ['PENDING', 'PROCESSING'] }
                      : 'DONE',
                  },
                ],
              },
            },
          },
        },
      );
    }

    const riskData = await this.riskDataRepository.findNude({
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
            examToRisk: {
              include: {
                exam: { select: { name: true, id: true, isAttendance: true } },
              },
              where: { companyId, exam: { isAttendance: false }, ...examType },
            },
          },
        },
        homogeneousGroup: {
          include: {
            hierarchyOnHomogeneous: {
              select: {
                hierarchy: true,
              },
              where: { homogeneousGroup: { type: 'HIERARCHY' } },
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
            examsToRiskFactorData: { some: { examId: { gt: 0 } } },
          },
          ...(hierarchyIds.length > 0
            ? [
                {
                  riskFactor: {
                    examToRisk: { some: { examId: { gt: 0 } } },
                  },
                  standardExams: true,
                },
              ]
            : []),
        ],
      },
    });

    const riskDataOrigin = riskData.map((rd) => {
      let prioritization: number;

      if (rd.homogeneousGroup.type === HomoTypeEnum.HIERARCHY && rd.hierarchy) {
        prioritization = originRiskMap[rd.hierarchy.type]?.prioritization;
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
          skipEmployee: this.checkIfSkipEmployee(examData),
          risk: rd.riskFactor,
          ...this.checkExpiredDate(examData),
        });
      });
      // exams
    });

    const examRepresentAll =
      hierarchyIds.length > 0
        ? await this.examRepository.findNude({
            select: {
              examToRisk: {
                where: { companyId, ...examType },
                distinct: [
                  'isMale',
                  'isAdmission',
                  'isDismissal',
                  'isPeriodic',
                  'isReturn',
                  'isMale',
                  'isFemale',
                  'fromAge',
                  'toAge',
                  'validityInMonths',
                ],
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
                    },
                  ],
                },
              ],
            },
          })
        : { data: [] };
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
          skipEmployee: this.checkIfSkipEmployee(examToRisk),
          risk: examToRisk.risk,
          ...this.checkExpiredDate({ ...examToRisk, exam }),
        });
      });
    });

    const examsDataReturn = Object.entries(exams)
      .map(([examId, examData]) => {
        return {
          exam: {
            id: examId,
            name: examData[0]?.exam?.name,
            isAttendance: examData[0]?.exam?.isAttendance,
          },
          origins: examData
            .sort((a, b) => sortNumber(a, b, 'validityInMonths'))
            .sort((a, b) => sortNumber(a, b, 'prioritization')),
        };
      })
      .sort((a, b) => sortString(a.exam, b.exam, 'name'))
      .sort((a, b) =>
        sortNumber(b.exam.isAttendance ? 1 : 0, a.exam.isAttendance ? 1 : 0),
      );

    return { data: this.checkCloseToExpiredDate(examsDataReturn) };
  }

  checkIfSkipEmployee(examRisk: IExamOriginData) {
    if (!this.employee) return null;
    const age = this.dayjs.dayjs().diff(this.employee.birthday, 'years');
    const isOutOfAgeRange =
      (examRisk.fromAge && examRisk.fromAge > age) ||
      (examRisk.toAge && examRisk.toAge < age);

    if (isOutOfAgeRange) return true;

    const isMale = this.employee.sex === SexTypeEnum.M;
    const isNotIncludeMale = this.employee.sex && isMale && !examRisk.isMale;
    const isNotIncludeFemale =
      this.employee.sex && !isMale && !examRisk.isFemale;

    if (isNotIncludeMale) return true;
    if (isNotIncludeFemale) return true;

    // const isExamValid = this.employee.examsHistory.some(
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

  checkExpiredDate(examRisk: IExamOriginData) {
    if (!this.employee) return null;

    const foundExamHistory = this.employee.examsHistory.find(
      (exam) => exam.examId === examRisk.examId,
    );
    if (!foundExamHistory) return {};

    const closeToExpired =
      examRisk.considerBetweenDays !== null &&
      this.dayjs.compareTime(
        this.dayjs.dateNow(),
        foundExamHistory.expiredDate,
        'days',
      ) <= examRisk.considerBetweenDays;

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

    const clinicValidityInMonths = foundExam.origins.find(
      (exam) => !exam.skipEmployee,
    )?.validityInMonths;

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
