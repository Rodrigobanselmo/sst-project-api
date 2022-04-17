import { Injectable } from '@nestjs/common';
import { HierarchyRepository } from 'src/modules/company/repositories/implementations/HierarchyRepository';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';

@Injectable()
export class DeleteHierarchyService {
  constructor(private readonly hierarchyRepository: HierarchyRepository) {}

  async execute(id: string, user: UserPayloadDto) {
    const hierarchies = await this.hierarchyRepository.deleteById(
      id,
      user.targetCompanyId,
    );

    return hierarchies;
  }
}
