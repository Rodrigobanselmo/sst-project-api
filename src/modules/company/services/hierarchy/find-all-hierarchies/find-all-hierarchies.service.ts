import { Injectable } from '@nestjs/common';
import { HierarchyRepository } from 'src/modules/company/repositories/implementations/HierarchyRepository';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';

@Injectable()
export class FindAllHierarchyService {
  constructor(private readonly hierarchyRepository: HierarchyRepository) {}

  async execute(user: UserPayloadDto) {
    const hierarchies =
      await this.hierarchyRepository.findAllHierarchyByCompany(
        user.targetCompanyId,
      );

    return hierarchies;
  }
}
