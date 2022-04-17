import { BadRequestException, Injectable } from '@nestjs/common';
import { HierarchyEnum } from '@prisma/client';
import { UpdateHierarchyDto } from 'src/modules/company/dto/hierarchy';
import { HierarchyRepository } from 'src/modules/company/repositories/implementations/HierarchyRepository';
import { ErrorCompanyEnum } from 'src/shared/constants/enum/errorMessage';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';

@Injectable()
export class UpsertManyHierarchyService {
  constructor(private readonly hierarchyRepository: HierarchyRepository) {}

  async execute(hierarchies: UpdateHierarchyDto[], user: UserPayloadDto) {
    hierarchies.map((hierarchy) => {
      if (hierarchy.parentId && hierarchy.type === HierarchyEnum.DIRECTORY) {
        throw new BadRequestException(ErrorCompanyEnum.UPDATE_WITH_PARENT);
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
