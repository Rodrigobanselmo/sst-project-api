import { EmployeeRepository } from './../../../repositories/implementations/EmployeeRepository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { HierarchyEnum } from '@prisma/client';

import { ErrorCompanyEnum } from '../../../../../shared/constants/enum/errorMessage';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CreateSubHierarchyDto } from '../../../dto/hierarchy';
import { HierarchyRepository } from '../../../repositories/implementations/HierarchyRepository';

@Injectable()
export class CreateSubHierarchyService {
  constructor(private readonly hierarchyRepository: HierarchyRepository, private readonly employeeRepository: EmployeeRepository) {}

  async execute(hierarchy: CreateSubHierarchyDto, user: UserPayloadDto) {
    const employees = await this.employeeRepository.findNude({
      select: {
        hierarchyId: true,
        id: true,
        hierarchy: {
          select: {
            workspaces: { select: { id: true } },
            description: true,
            id: true,
          },
        },
        hierarchyHistory: { orderBy: { startDate: 'desc' }, take: 1, select: { id: true } },
      },
      where: {
        companyId: user.targetCompanyId,
        id: { in: hierarchy.employeesIds || [] },
      },
    });

    const isEveryoneFromSameOffice = employees.every((employee) => employees.every((e) => (e.hierarchyId = employee?.hierarchyId)));

    if (!isEveryoneFromSameOffice) throw new BadRequestException(ErrorCompanyEnum.EVERYONE_NOT_FROM_SAME_OFFICE);

    const office = employees[0].hierarchy;
    const workspaceIds = office.workspaces.map((workspace) => workspace.id);

    const hierarchySub = await this.hierarchyRepository.upsertSubOffice({
      companyId: user.targetCompanyId,
      name: hierarchy.name,
      status: hierarchy.status,
      parentId: hierarchy.parentId,
      employeesIds: employees.map((employee) => employee.id),
      realDescription: hierarchy.realDescription,
      description: office.description,
      type: HierarchyEnum.SUB_OFFICE,
      workspaceIds: workspaceIds,
      id: hierarchy.id,
      historyIds: employees.reduce((acc, employee) => {
        return [...acc, ...employee.hierarchyHistory.map((e) => e.id)];
      }, [] as number[]),
    });

    return {
      ...hierarchySub,
      workspaceIds: workspaceIds,
    };
  }
}
