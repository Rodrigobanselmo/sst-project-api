import { BadRequestException, Injectable } from '@nestjs/common';
import { HierarchyEnum } from '@prisma/client';
import { UpdateHierarchyDto } from '../../../../../modules/company/dto/hierarchy';
import { HierarchyRepository } from '../../../../../modules/company/repositories/implementations/HierarchyRepository';
import { ErrorCompanyEnum } from '../../../../../shared/constants/enum/errorMessage';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class UpsertManyHierarchyService {
  constructor(private readonly hierarchyRepository: HierarchyRepository) {}

  async execute(hierarchies: UpdateHierarchyDto[], user: UserPayloadDto) {
    hierarchies.map((hierarchy) => {
      if (hierarchy.parentId && hierarchy.type === HierarchyEnum.DIRECTORY) {
        throw new BadRequestException(
          ErrorCompanyEnum.UPDATE_HIERARCHY_WITH_PARENT,
        );
      }
    });
    console.log('hierarchies', hierarchies, user.targetCompanyId);
    const allHierarchy = await this.hierarchyRepository.upsertMany(
      hierarchies as any,
      user.targetCompanyId,
    );

    return allHierarchy;
  }
}
