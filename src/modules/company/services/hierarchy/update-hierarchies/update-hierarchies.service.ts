import { EmployeeRepository } from './../../../repositories/implementations/EmployeeRepository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { HierarchyEnum } from '@prisma/client';
import { UpdateHierarchyDto } from '../../../../../modules/company/dto/hierarchy';
import { HierarchyRepository } from '../../../../../modules/company/repositories/implementations/HierarchyRepository';
import { ErrorCompanyEnum } from '../../../../../shared/constants/enum/errorMessage';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class UpdateHierarchyService {
  constructor(private readonly hierarchyRepository: HierarchyRepository, private readonly employeeRepository: EmployeeRepository) {}

  async execute(hierarchy: UpdateHierarchyDto, user: UserPayloadDto) {
    if (hierarchy.parentId && hierarchy.type === HierarchyEnum.DIRECTORY) {
      throw new BadRequestException(ErrorCompanyEnum.UPDATE_HIERARCHY_WITH_PARENT);
    }

    const hierarchies = await this.hierarchyRepository.update(hierarchy, user.targetCompanyId);

    if (hierarchy.employeesIds) {
      const employeeFound = await this.employeeRepository.findNude({
        include: { hierarchy: true },
        where: { id: { in: hierarchy.employeesIds } },
      });

      const employeesIdsToDisconnect = employeeFound.filter((employee) => employee.hierarchyId !== hierarchy.id).map((employee) => employee.id);

      await this.employeeRepository.disconnectSubOffices(employeesIdsToDisconnect, user.targetCompanyId);
    }

    return hierarchies;
  }
}
