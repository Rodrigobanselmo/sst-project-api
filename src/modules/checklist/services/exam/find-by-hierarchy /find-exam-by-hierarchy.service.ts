import { IExamOriginData } from './../../../entities/exam.entity';
import { Injectable } from '@nestjs/common';
import { HomoTypeEnum } from '@prisma/client';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { ExamRepository } from '../../../repositories/implementations/ExamRepository';
import { originRiskMap } from './../../../../../shared/constants/maps/origin-risk';
import { RiskDataRepository } from './../../../repositories/implementations/RiskDataRepository';
import { sortNumber } from '../../../../../shared/utils/sorts/number.sort';
import { sortString } from '../../../../../shared/utils/sorts/string.sort';

@Injectable()
export class FindExamByHierarchyService {
  constructor(
    private readonly examRepository: ExamRepository,
    private readonly riskDataRepository: RiskDataRepository,
    private readonly hierarchyRepository: HierarchyRepository,
  ) {}

  async execute(hierarchyId: string, user: UserPayloadDto) {
    const companyId = user.targetCompanyId;
    const hierarchy = await this.hierarchyRepository.findByIdWithParent(
      hierarchyId,
      companyId,
    );

    const hierarchies = [hierarchy, ...(hierarchy?.parents || [])];
    const hierarchyIds = hierarchies.map(({ id }) => id);

    const riskData = await this.riskDataRepository.findNude({
      include: {
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
              where: { companyId, exam: { isAttendance: false } },
            },
          },
        },
        homogeneousGroup: {
          include: {
            characterization: { select: { name: true, type: true } },
            environment: { select: { name: true, type: true } },
          },
        },
        examsToRiskFactorData: {
          include: {
            exam: { select: { name: true, id: true, isAttendance: true } },
          },
        },
      },
      where: {
        companyId,
        homogeneousGroup: {
          hierarchyOnHomogeneous: {
            some: { hierarchyId: { in: hierarchyIds } },
          },
        },
        examsToRiskFactorData: { some: { examId: { gt: 0 } } },
      },
    });

    const riskDataOrigin = riskData.map((rd) => {
      let prioritization: number;
      if (rd.homogeneousGroup.type === HomoTypeEnum.HIERARCHY) {
        const hierarchyFound = hierarchies?.find(
          (hierarchy) => hierarchy.id === rd.homogeneousGroupId,
        ) || { name: '', type: '' };
        rd.origin = `${hierarchyFound.name} (${
          originRiskMap[hierarchyFound.type]?.name || ''
        })`;
        prioritization = originRiskMap[hierarchyFound.type]?.prioritization;
      }

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
          risk: rd.riskFactor,
        });
      });
      // exams
    });

    const examRepresentAll = await this.examRepository.findNude({
      select: {
        examToRisk: { where: { companyId } },
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
    });

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
          risk: examToRisk.risk,
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

    return { data: examsDataReturn };
  }
}
