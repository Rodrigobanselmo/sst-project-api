import { BadRequestException, Injectable } from '@nestjs/common';
import { HierarchyRepository } from 'src/modules/company/repositories/implementations/HierarchyRepository';
import { ErrorMessageEnum } from 'src/shared/constants/enum/errorMessage';
import { UserPayloadDto } from 'src/shared/dto/user-payload.dto';

@Injectable()
export class DeleteHierarchyService {
  constructor(private readonly hierarchyRepository: HierarchyRepository) {}

  async execute(id: string, user: UserPayloadDto) {
    const hierarchy =
      await this.hierarchyRepository.findAllHierarchyByCompanyAndId(
        id,
        user.targetCompanyId,
      );

    if (!hierarchy)
      throw new BadRequestException(
        ErrorMessageEnum.NOT_FOUND_ON_COMPANY_TO_DELETE,
      );

    const hierarchies = await this.hierarchyRepository.deleteById(id);

    return hierarchies;
  }
}
