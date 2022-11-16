import { EmployeeRepository } from './../../../repositories/implementations/EmployeeRepository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { HierarchyEnum } from '@prisma/client';
import { UpdateHierarchyDto } from '../../../../../modules/company/dto/hierarchy';
import { HierarchyRepository } from '../../../../../modules/company/repositories/implementations/HierarchyRepository';
import { ErrorCompanyEnum } from '../../../../../shared/constants/enum/errorMessage';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class UpsertManyHierarchyService {
  constructor(private readonly hierarchyRepository: HierarchyRepository, private readonly employeeRepository: EmployeeRepository) {}

  async execute(hierarchies: UpdateHierarchyDto[], user: UserPayloadDto) {
    await Promise.all(
      hierarchies.map(async (hierarchy) => {
        if (hierarchy.parentId && ([HierarchyEnum.DIRECTORY] as HierarchyEnum[]).includes(hierarchy.type)) {
          throw new BadRequestException(ErrorCompanyEnum.UPDATE_HIERARCHY_WITH_PARENT);
        }
        if (!hierarchy.parentId && ([HierarchyEnum.SUB_SECTOR, HierarchyEnum.SUB_OFFICE] as HierarchyEnum[]).includes(hierarchy.type)) {
          throw new BadRequestException(ErrorCompanyEnum.UPSERT_HIERARCHY_WITH_PARENT);
        }

        if (hierarchy.type === HierarchyEnum.SUB_OFFICE) {
          const employeeFound = await this.employeeRepository.findFirstNude({
            where: {
              id: { in: hierarchy?.employeesIds },
              hierarchyId: { notIn: [hierarchy.parentId] },
            },
          });

          if (employeeFound?.id) {
            throw new BadRequestException(ErrorCompanyEnum.UPSERT_HIERARCHY_WITH_SUB_OFFICE_OTHER_OFFICE);
          }

          return;
        }

        // verify if employee has sub office before changing offices
        if (hierarchy?.employeesIds?.length > 0) {
          const employeeFound = await this.employeeRepository.findFirstNude({
            where: {
              id: { in: hierarchy?.employeesIds },
              subOffices: {
                some: { status: { equals: 'ACTIVE' } },
              },
              hierarchyId: { notIn: [hierarchy.id] },
            },
          });

          if (employeeFound?.id) {
            throw new BadRequestException(ErrorCompanyEnum.UPSERT_HIERARCHY_WITH_EMPLOYEE_WITH_SUB_OFFICE);
          }
        }
      }),
    );

    const allHierarchy = await this.hierarchyRepository.upsertMany(hierarchies as any, user.targetCompanyId);

    return allHierarchy;
  }
}
