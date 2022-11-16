import { Injectable } from '@nestjs/common';
import { HierarchyRepository } from '../../../repositories/implementations/HierarchyRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class FindHierarchyService {
  constructor(private readonly hierarchyRepository: HierarchyRepository) {}

  async execute(id: string, user: UserPayloadDto) {
    const hierarchy = await this.hierarchyRepository.findById(id, user.targetCompanyId);

    return hierarchy;
  }
}
