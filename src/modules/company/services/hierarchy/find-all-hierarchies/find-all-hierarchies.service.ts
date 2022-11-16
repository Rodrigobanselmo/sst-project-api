import { Injectable } from '@nestjs/common';
import { HierarchyRepository } from '../../../../../modules/company/repositories/implementations/HierarchyRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class FindAllHierarchyService {
  constructor(private readonly hierarchyRepository: HierarchyRepository) {}

  async execute(user: UserPayloadDto) {
    const hierarchies = await this.hierarchyRepository.findAllHierarchyByCompany(user.targetCompanyId, { include: { workspaces: true } });

    return hierarchies;
  }
}
