import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { UpdateSimpleHierarchyDto } from '../../../dto/hierarchy';
import { HierarchyRepository } from '../../../repositories/implementations/HierarchyRepository';

@Injectable()
export class UpdateSimpleManyHierarchyService {
  constructor(private readonly hierarchyRepository: HierarchyRepository) {}

  async execute(hierarchies: UpdateSimpleHierarchyDto[], user: UserPayloadDto) {
    const allHierarchy = await this.hierarchyRepository.updateSimpleMany(hierarchies as any, user.targetCompanyId);

    return allHierarchy;
  }
}
