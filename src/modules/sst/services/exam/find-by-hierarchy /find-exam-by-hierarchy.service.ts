import { Injectable } from '@nestjs/common';
import { ExamHistoryTypeEnum, HomoTypeEnum, Prisma, SexTypeEnum, StatusEnum } from '@prisma/client';
import { getRiskDoc, getRiskDocV2 } from './../../../../../shared/utils/getRiskDoc';
import { HierarchyEntity } from './../../../../company/entities/hierarchy.entity';
import { CompanyRepository } from './../../../../company/repositories/implementations/CompanyRepository';
import { EmployeeHierarchyHistoryRepository } from './../../../../company/repositories/implementations/EmployeeHierarchyHistoryRepository';

import { originRiskMap } from '../../../../../shared/constants/maps/origin-risk';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { sortNumber } from '../../../../../shared/utils/sorts/number.sort';
import { sortString } from '../../../../../shared/utils/sorts/string.sort';
import { EmployeeExamsHistoryEntity } from '../../../../company/entities/employee-exam-history.entity';
import { EmployeeEntity } from '../../../../company/entities/employee.entity';
import { EmployeeRepository } from '../../../../company/repositories/implementations/EmployeeRepository';
import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { FindExamHierarchyDto } from '../../../dto/exam.dto';
import { IExamEmployeeCheck, IExamOriginData, IExamOrigins } from '../../../entities/exam.entity';
import { ExamRepository } from '../../../repositories/implementations/ExamRepository';
import { RiskDataRepository } from '../../../repositories/implementations/RiskDataRepository';
import { CompanyEntity } from './../../../../..//modules/company/entities/company.entity';

export const clinicExamCloseToExpire = 45;

export const getValidityInMonths = (
  employee: EmployeeEntity,
  examRisk: { validityInMonths?: number; lowValidityInMonths?: number },
) => {
  return employee.isComorbidity ? examRisk.lowValidityInMonths || examRisk.validityInMonths : examRisk.validityInMonths;
};
@Injectable()
export class FindExamByHierarchyService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly examRepository: ExamRepository,
    private readonly riskDataRepository: RiskDataRepository,
    private readonly employeeHierarchyHistoryRepository: EmployeeHierarchyHistoryRepository,
    private readonly hierarchyRepository: HierarchyRepository,
    private readonly dayjs: DayJSProvider,
  ) {}

  async execute(
    user: Pick<UserPayloadDto, 'targetCompanyId'>,
    query: FindExamHierarchyDto,
    options?: { employee?: EmployeeEntity },
  ) {
    let hierarchyId = query.hierarchyId;
    let employee: EmployeeEntity;
    const companyId = user.targetCompanyId;
    const isGetExamToRisk = query.getAllExamToRiskWithoutHierarchy;

    const hierarchies: Partial<HierarchyEntity>[] = [];
    const date = new Date();

    const examType = {
      ...('isPeriodic' in query && { isPeriodic: query?.isPeriodic }),
      ...('isChange' in query && { isChange: query?.isChange }),
      ...('isAdmission' in query && { isAdmission: query?.isAdmission }),
      ...('isReturn' in query && { isReturn: query?.isReturn }),
    };

    if (query.employeeId) {
      employee =
        options?.employee && !query?.isDismissal && !query.isPendingExams
          ? options.employee
          : await this.employeeRepository.findFirstNude({
              where: { id: query.employeeId, companyId },
              include: {
                hierarchyHistory: {
                  select: {
                    motive: true,
                    startDate: true,
                  },
                  orderBy: { startDate: 'desc' },
                  take: 1,
                },
                subOffices: { select: { id: true } },
                ...(query?.isDismissal &&
                  !hierarchyId && {
                    hierarchyHistory: {
                      where: { motive: { not: 'DEM' } },
                      select: {
                        hierarchyId: true,
                        motive: true,
                        startDate: true,
                        subHierarchies: { select: { id: true } },
                      },
                      take: 1,
                    },
                  }),
                examsHistory: {
                  orderBy: { doneDate: 'desc' },
                  distinct: ['examId', 'status'],
                  where: {
                    status: query.isPendingExams ? { in: ['PENDING', 'PROCESSING'] } : 'DONE',
                  },
                },
              },
            });

      if (query?.isDismissal && !hierarchyId && employee.hierarchyHistory && employee.hierarchyHistory?.length > 0) {
        if (employee.hierarchyHistory[0]) {
          hierarchyId = employee.hierarchyHistory[0].hierarchyId;
          employee.subOffices = employee.hierarchyHistory[0].subHierarchies;
        }
      }

      if (employee && employee.hierarchyId && !hierarchyId) {
        hierarchyId = employee.hierarchyId;
      }

      if (employee && !query.isOffice) {
        hierarchies.push(...(employee?.subOffices || []));
      }
    }

    const consultantCompanies = await this.companyRepository.findConsultant(companyId, {
      select: { id: true },
    });

    const consultantCompaniesIds = consultantCompanies.map(({ id }) => id);
    const companyIds = [companyId, ...consultantCompaniesIds];

    const hierarchy = hierarchyId
      ? await this.hierarchyRepository.findByIdWithParent(hierarchyId, companyId)
      : undefined;
    hierarchies.push(...[hierarchy, ...(hierarchy?.parents || [])].filter((h) => h));
    if (query.subOfficesIds) hierarchies.push(...query.subOfficesIds.map((id) => ({ id })));

    const hierarchyIds = hierarchies.map(({ id }) => id);

    const hierarchyGtZero = hierarchyIds.length > 0;
    const getRiskFactor = isGetExamToRisk || hierarchyGtZero;

    let riskData = await this.riskDataRepository.findNude({
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
            ...(getRiskFactor && {
              docInfo: {
                where: {
                  OR: [
                    { companyId },
                    {
                      company: {
                        applyingServiceContracts: {
                          some: { receivingServiceCompanyId: companyId, status: 'ACTIVE' },
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
                  deletedAt: null,
                  exam: { isAttendance: false },
                  ...examType,
                },
              },
            }),
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
                  ...(date && {
                    AND: [
                      { OR: [{ startDate: { lte: date } }, { startDate: null }] },
                      { OR: [{ endDate: { gt: date } }, { endDate: null }] },
                    ],
                  }),
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
        activities: true,
        json: true,
        standardExams: true,
        riskFactorGroupDataId: true,
      },
      where: {
        ...(date && {
          AND: [
            { OR: [{ startDate: { lte: date } }, { startDate: null }] },
            { OR: [{ endDate: { gt: date } }, { endDate: null }] },
          ],
        }),
        companyId: { in: companyIds },
        // companyId,
        ...(hierarchyGtZero && {
          homogeneousGroup: {
            hierarchyOnHomogeneous: {
              some: {
                ...(date && {
                  AND: [
                    { OR: [{ startDate: { lte: date } }, { startDate: null }] },
                    { OR: [{ endDate: { gt: date } }, { endDate: null }] },
                  ],
                }),
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
          ...(getRiskFactor
            ? [
                {
                  riskFactor: {
                    examToRisk: {
                      some: {
                        deletedAt: null,
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
    });

    if (hierarchyId) {
      riskData = riskData.filter((riskData) => {
        return getRiskDoc(riskData.riskFactor, { companyId, hierarchyId })?.isAso;
      });
    }

    if (isGetExamToRisk && !hierarchyId) {
      riskData = riskData.filter((riskData) => {
        return getRiskDocV2(riskData.riskFactor, { companyId, getIfAnyIsTrue: true, docType: 'isAso' })?.isAso;
      });
    }

    const riskDataOrigin = riskData.map((rd) => {
      let prioritization: number;

      if (rd.homogeneousGroup.type === HomoTypeEnum.HIERARCHY && rd.homogeneousGroup.hierarchy) {
        prioritization = originRiskMap[rd.homogeneousGroup.hierarchy.type]?.prioritization;
      }

      rd.examsToRiskFactorData = rd.examsToRiskFactorData;
      return { ...rd, prioritization };
    });

    const exams: Record<string, IExamOriginData[]> = {};

    riskDataOrigin.forEach((rd) => {
      rd.examsToRiskFactorData.forEach((examData) => {
        const isStandard = (examData as any)?.isStandard;
        const isDifComponany = examData.companyId !== companyId;

        if (!exams[examData.examId]) exams[examData.examId] = [];
        exams[examData.examId].push({
          ...examData,
          origin: isStandard ? `Padrão ${isDifComponany ? 'Consultoria ' : ''}(${rd.origin && rd.origin})` : rd.origin,
          prioritization: (isStandard ? (isDifComponany ? 101 : 100) : rd.prioritization) || 3,
          homogeneousGroup: rd.homogeneousGroup,
          risk: rd.riskFactor,
          skipEmployee: this.checkIfSkipEmployee(examData, employee),
          ...this.checkExpiredDate(examData, employee),
        });
      });
    });

    if (!query.skipAllExams) {
      const examRepresentAll = await this.onGetAllExams(companyIds, {
        examsTypes: examType,
        onlyAttendance: query.onlyAttendance,
      });

      examRepresentAll.data.map((exam) => {
        exam.examToRisk.map((examToRisk) => {
          const isDifComponany = examToRisk.companyId !== companyId;

          if (!exams[examToRisk.examId]) exams[examToRisk.examId] = [];
          exams[examToRisk.examId].push({
            ...examToRisk,
            origin: !isDifComponany ? 'Padrão' : `Padrão Consultoria`,
            isStandard: true,
            exam: {
              name: exam.name,
              id: exam.id,
              isAttendance: !!exam?.isAttendance,
            } as any,
            prioritization: isDifComponany ? 101 : 100,
            skipEmployee: this.checkIfSkipEmployee(examToRisk, employee),
            risk: examToRisk.risk,
            ...this.checkExpiredDate({ ...examToRisk, exam }, employee),
          });
        });
      });
    }

    const examsDataReturn = Object.entries(exams)
      .map(([examId, examData]) => {
        const origins = examData
          .sort((a, b) => sortNumber(a, b, 'validityInMonths'))
          .sort((a, b) => sortNumber(a, b, 'prioritization')) as IExamOriginData[];

        const isAttendance = examData[0]?.exam?.isAttendance;

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
      .sort((a, b) => sortNumber(b.exam.isAttendance ? 1 : 0, a.exam.isAttendance ? 1 : 0)) as any;

    return {
      data: examsDataReturn as IExamOrigins[],
    };
  }

  checkIfSkipEmployee(examRisk: IExamEmployeeCheck, employee: EmployeeEntity) {
    if (!employee) return null;

    const age = this.dayjs.dayjs().diff(employee.birthday, 'years');
    const isOutOfAgeRange = (examRisk.fromAge && examRisk.fromAge > age) || (examRisk.toAge && examRisk.toAge < age);

    if (isOutOfAgeRange) return true;

    const isMale = employee.sex === SexTypeEnum.M;
    const isNotIncludeMale = employee.sex && isMale && !examRisk.isMale;
    const isNotIncludeFemale = employee.sex && !isMale && !examRisk.isFemale;

    if (isNotIncludeMale) return true;
    if (isNotIncludeFemale) return true;

    return false;
  }

  checkExpiredDate(examRisk: IExamOriginData, employee: EmployeeEntity, company?: CompanyEntity) {
    if (!employee) return null;

    const foundExamHistory =
      employee?.examsHistory?.find((exam) => exam.examId === examRisk.examId) || ({} as EmployeeExamsHistoryEntity);

    if (!foundExamHistory?.expiredDate && employee.lastExam) {
      foundExamHistory.expiredDate = this.dayjs
        .dayjs(employee.lastExam)
        .add(getValidityInMonths(employee, examRisk), 'month')
        .toDate();

      foundExamHistory.status = StatusEnum.ACTIVE;
    }

    if (!foundExamHistory?.expiredDate)
      return {
        expiredDate: null,
      };

    const closeValidated =
      examRisk.considerBetweenDays || (examRisk.exam.isAttendance ? clinicExamCloseToExpire : null);
    const closeToExpired =
      closeValidated !== null &&
      this.dayjs.compareTime(this.dayjs.dateNow(), foundExamHistory.expiredDate, 'days') <= closeValidated;

    return {
      closeToExpired,
      expiredDate: foundExamHistory.expiredDate,
      status: foundExamHistory.status,
      doneDate: foundExamHistory.doneDate,
    };
  }

  filterOriginsByEmployee(examsData: IExamOrigins[], employee: EmployeeEntity, hierarchyIds: string[]): IExamOrigins[] {
    return examsData.map(({ exam, origins, ...rest }) => {
      const newOrigins = [];

      origins?.forEach((origin) => {
        if (origin.risk?.docInfo) {
          const availableRisk = getRiskDocV2(origin.risk, {
            companyId: employee.companyId,
            hierarchyId: employee.hierarchyId,
          })?.isAso;
          if (!availableRisk) return;
        }

        const isPartOfHomo = origin?.homogeneousGroup
          ? origin.homogeneousGroup?.hierarchies?.find((hierarchy) => hierarchyIds.includes(hierarchy?.id))
          : true;
        if (!isPartOfHomo) return;

        const skip = this.checkIfSkipEmployee(origin, employee);
        if (skip) return false;

        const originExpireDate = this.checkExpiredDate(origin, employee);
        newOrigins.push({ ...origin, ...originExpireDate });

        return true;
      });

      return {
        exam,
        origins: newOrigins,
        ...rest,
      };
    });
  }

  filterOrigins(examsData: IExamOrigins[], examType?: ExamHistoryTypeEnum) {
    return examsData.map(({ exam, origins }) => {
      const isDismissal = examType === ExamHistoryTypeEnum.DEMI;
      const isReturn = examType === ExamHistoryTypeEnum.RETU;
      const isChange = examType === ExamHistoryTypeEnum.CHAN;
      const isPeriodic = examType === ExamHistoryTypeEnum.PERI;
      const isAdmission = examType === ExamHistoryTypeEnum.ADMI;
      const isOffice = examType === ExamHistoryTypeEnum.ADMI;

      origins = origins?.filter((origin) => {
        if (origin.skipEmployee) return false;

        if (isReturn) if (!origin.isReturn) return false;
        if (isDismissal) if (!origin.isDismissal) return false;
        if (isChange) if (!origin.isChange) return false;
        if (isPeriodic || isOffice) if (!origin.isPeriodic) return false;
        if (isAdmission) if (!origin.isAdmission) return false;

        return true;
      });

      return {
        exam,
        origins,
      };
    });
  }

  getAllOrigins(examsData: IExamOrigins[], examType?: ExamHistoryTypeEnum) {
    return examsData.map(({ exam, origins }) => {
      const isDismissal = examType === ExamHistoryTypeEnum.DEMI;
      const isReturn = examType === ExamHistoryTypeEnum.RETU;
      const isChange = examType === ExamHistoryTypeEnum.CHAN;
      const isPeriodic = examType === ExamHistoryTypeEnum.PERI;
      const isAdmission = examType === ExamHistoryTypeEnum.ADMI;
      const isOffice = examType === ExamHistoryTypeEnum.ADMI;

      const origin = origins?.find((origin) => {
        if (origin.skipEmployee) return false;

        if (isReturn) if (!origin.isReturn) return false;
        if (isDismissal) if (!origin.isDismissal) return false;
        if (isChange) if (!origin.isChange) return false;
        if (isPeriodic || isOffice) if (!origin.isPeriodic) return false;
        if (isAdmission) if (!origin.isAdmission) return false;

        return true;
      });

      return {
        exam,
        origin,
      };
    });
  }

  async onGetAllExams(
    companyIds: string[],
    options?: { examsTypes?: Prisma.ExamToRiskWhereInput; onlyAttendance?: boolean },
  ) {
    const examRepresentAll = await this.examRepository.findNude({
      select: {
        examToRisk: {
          where: {
            deletedAt: null,
            companyId: { in: companyIds },
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
            deletedAt: null,
            companyId: { in: companyIds },
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

  async onGetExamsIdsByHierarchy({
    hierarchyId,
    examType,
    doneDate,
    employeeId,
    companyId,
  }: {
    employeeId: number;
    companyId: string;
    hierarchyId?: string;
    doneDate?: Date;
    examType: ExamHistoryTypeEnum;
  }) {
    const originsData = [];
    const subOfficesIds = [];

    if (doneDate) {
      const hierarchiesHistory = await this.employeeHierarchyHistoryRepository.findNude({
        where: {
          ...(hierarchyId && { hierarchyId }),
          ...(!hierarchyId && {
            startDate: { lte: doneDate },
            motive: { not: 'DEM' },
          }),
          employeeId: employeeId,
        },
        orderBy: { startDate: 'desc' },
        take: 1,
        select: { hierarchyId: true, subHierarchies: { select: { id: true } } },
      });

      if (hierarchiesHistory.length) {
        hierarchyId = hierarchiesHistory[0]?.hierarchyId;
        subOfficesIds.push(...hierarchiesHistory[0]?.subHierarchies?.map((sub) => sub.id));
      }
    }

    if (hierarchyId) {
      const isDismissal = examType === ExamHistoryTypeEnum.DEMI;
      const isOffice = examType === ExamHistoryTypeEnum.OFFI;

      const exams = await this.execute(
        { targetCompanyId: companyId },
        {
          subOfficesIds,
          employeeId: employeeId,
          hierarchyId,
          ...(isDismissal && { isDismissal: isDismissal }),
          ...(isOffice && { isOffice: isOffice }),
        },
      );

      if (exams.data) {
        const origins = this.getAllOrigins(exams.data, examType);
        originsData.push(...origins);
      }
    }

    return originsData;
  }
}

export function filterOriginsByHierarchy(
  examsData: IExamOrigins[],
  companyId: string,
  hierarchyId: string,
  options?: { docType?: 'isAso' | 'isPCMSO' },
): IExamOrigins[] {
  return examsData.map(({ exam, origins, ...rest }) => {
    const newOrigins = [];

    origins?.forEach((origin) => {
      if (origin.risk?.docInfo) {
        const availableRisk = getRiskDocV2(origin.risk, { companyId, hierarchyId: hierarchyId })?.[
          options?.docType || 'isAso'
        ];
        if (!availableRisk) return;
      }

      const isPartOfHomo = origin?.homogeneousGroup
        ? origin.homogeneousGroup?.hierarchies?.find((hierarchy) => hierarchyId === hierarchy?.id)
        : true;
      if (!isPartOfHomo) return;

      newOrigins.push(origin);

      return true;
    });

    return {
      exam,
      origins: newOrigins,
      ...rest,
    };
  });
}

export function filterOriginsByHomoGroupId(
  examsData: IExamOrigins[],
  companyId: string,
  homoGroup: { id: string; type: HomoTypeEnum },
  options?: { docType?: 'isAso' | 'isPCMSO' },
): IExamOrigins[] {
  if (homoGroup.type == 'HIERARCHY') return filterOriginsByHierarchy(examsData, companyId, homoGroup.id);

  return examsData.map(({ exam, origins, ...rest }) => {
    const newOrigins = [];

    origins?.forEach((origin) => {
      if (origin.risk?.docInfo) {
        const availableRisk = getRiskDocV2(origin.risk, { companyId })?.[options?.docType || 'isAso'];
        if (!availableRisk) return;
      }

      const isPartOfHomo = origin?.homogeneousGroup ? origin.homogeneousGroup.id == homoGroup.id : true;
      if (!isPartOfHomo) return;

      newOrigins.push(origin);

      return true;
    });

    return {
      exam,
      origins: newOrigins,
      ...rest,
    };
  });
}
