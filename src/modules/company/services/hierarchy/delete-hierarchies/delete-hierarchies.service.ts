import { BadRequestException, Injectable } from '@nestjs/common';
import { HierarchyRepository } from '../../../../../modules/company/repositories/implementations/HierarchyRepository';
import { ErrorMessageEnum } from '../../../../../shared/constants/enum/errorMessage';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class DeleteHierarchyService {
  constructor(private readonly hierarchyRepository: HierarchyRepository) {}

  async execute(id: string, user: UserPayloadDto) {
    const hierarchy = await this.hierarchyRepository.findAllHierarchyByCompanyAndId(id, user.targetCompanyId);

    if (!hierarchy?.id) throw new BadRequestException(ErrorMessageEnum.NOT_FOUND_ON_COMPANY_TO_DELETE);

    const hierarchies = await this.hierarchyRepository.deleteById(id);

    return hierarchies;
  }
}
