import { BadRequestException, Injectable } from '@nestjs/common';
import { HierarchyEnum } from '@prisma/client';
import { CreateHierarchyDto } from 'src/modules/company/dto/hierarchy';
import { HierarchyRepository } from 'src/modules/company/repositories/implementations/HierarchyRepository';
import { ErrorCompanyEnum } from 'src/shared/constants/enum/errorMessage';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';

@Injectable()
export class CreateHierarchyService {
  constructor(private readonly hierarchyRepository: HierarchyRepository) {}

  async execute(hierarchy: CreateHierarchyDto, user: UserPayloadDto) {
    if (hierarchy.parentId && hierarchy.type === HierarchyEnum.DIRECTORY) {
      throw new BadRequestException(
        ErrorCompanyEnum.CREATE_HIERARCHY_WITH_PARENT,
      );
    }

    const hierarchies = await this.hierarchyRepository.upsert(
      hierarchy,
      user.targetCompanyId,
    );

    return hierarchies;
  }
}
