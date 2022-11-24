import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { EmployeeRepository } from '../../../../company/repositories/implementations/EmployeeRepository';
import { Injectable } from '@nestjs/common';
import clone from 'clone';

import { RiskRepository } from '../../../repositories/implementations/RiskRepository';
import { RiskFactorDataEntity } from '../../../entities/riskData.entity';

@Injectable()
export class FindAllRiskDataByEmployeeService {
  constructor(
    private readonly riskRepository: RiskRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly hierarchyRepository: HierarchyRepository,
  ) {}

  async execute(employeeId: number, companyId?: string, options?: { fromExam?: boolean; filterDate?: boolean }) {
    const { risk } = await this.getRiskData(employeeId, companyId, options);

    return risk;
  }

  async getRiskData(employeeId: number, companyId?: string, options?: { fromExam?: boolean; filterDate?: boolean; hierarchyData?: boolean }) {
    const employee = await this.employeeRepository.findFirstNude({
      where: { id: employeeId, ...(companyId && { companyId }) },
      select: {
        id: true,
        companyId: true,
        hierarchyHistory: {
          where: { motive: { not: 'DEM' } },
          orderBy: { startDate: 'desc' },
          take: 1,
          select: {
            startDate: true,
            subHierarchies: { select: { id: true } },
            hierarchy: {
              select: {
                id: true,
                ...(options?.hierarchyData && { type: true, name: true }),
                parent: {
                  select: {
                    ...(options?.hierarchyData && { type: true, name: true }),
                    id: true,
                    parent: {
                      select: {
                        ...(options?.hierarchyData && { type: true, name: true }),
                        id: true,
                        parent: {
                          select: {
                            ...(options?.hierarchyData && { type: true, name: true }),
                            id: true,
                            parent: {
                              select: {
                                ...(options?.hierarchyData && { type: true, name: true }),
                                id: true,
                                parent: {
                                  select: { parent: true, id: true },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        ...(options.fromExam && {
          examsHistory: {
            where: { exam: { isAttendance: true } },
            orderBy: { doneDate: 'desc' },
            take: 1,
            select: {
              doneDate: true,
              subOfficeId: true,
              hierarchy: {
                select: {
                  ...(options?.hierarchyData && { type: true, name: true }),
                  id: true,
                  parent: {
                    select: {
                      ...(options?.hierarchyData && { type: true, name: true }),
                      id: true,
                      parent: {
                        select: {
                          id: true,
                          ...(options?.hierarchyData && { type: true, name: true }),
                          parent: {
                            select: {
                              ...(options?.hierarchyData && { type: true, name: true }),
                              id: true,
                              parent: {
                                select: {
                                  id: true,
                                  ...(options?.hierarchyData && { type: true, name: true }),
                                  parent: {
                                    select: { parent: true, id: true },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        }),
      },
    });

    const hierarchyHistory = employee.hierarchyHistory?.[0];
    const examHistory = employee?.examsHistory?.[0];
    let date = hierarchyHistory.startDate;
    if (hierarchyHistory) {
      employee.hierarchy = hierarchyHistory?.hierarchy;
      employee.subOffices = hierarchyHistory?.subHierarchies;
    }

    if (examHistory && examHistory?.hierarchy && (examHistory.doneDate > hierarchyHistory?.startDate || !hierarchyHistory?.startDate)) {
      date = examHistory.doneDate;
      employee.hierarchy = examHistory?.hierarchy;
      employee.subOffices = [{ id: examHistory?.subOfficeId }];
    }

    const hierarchyIds: string[] = [];

    if (employee?.hierarchy) {
      if (employee.hierarchy?.id) hierarchyIds.push(employee.hierarchy.id);
      if (employee.hierarchy?.parents?.length) hierarchyIds.push(...employee.hierarchy.parents.map((h) => h.id));
    }

    if (employee?.subOffices?.length) hierarchyIds.push(...employee.subOffices.map((i) => i.id));

    if (!options.filterDate) date = undefined;
    const risks = await this.riskRepository.findRiskDataByHierarchies(hierarchyIds, employee.companyId, { date });

    const riskDataReturn: RiskFactorDataEntity[] = [];

    risks.forEach((risk) => {
      risk.riskFactorData.forEach((riskData) => {
        const riskCopy = clone(risk);
        riskCopy.riskFactorData = undefined;

        riskData.riskFactor = riskCopy;
        riskDataReturn.push(riskData);
      });
    });

    return { risk: riskDataReturn.map((riskData) => new RiskFactorDataEntity(riskData)), employee };
  }
}
