import { Injectable } from '@nestjs/common';
import { HomoGroupRepository } from '../../../../../modules/company/repositories/implementations/HomoGroupRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class FindByCompanyHomoGroupService {
  constructor(private readonly homoGroupRepository: HomoGroupRepository) {}

  async execute(user: UserPayloadDto) {
    const homoGroups = await this.homoGroupRepository.findHomoGroupByCompany(user.targetCompanyId, {
      include: {
        hierarchyOnHomogeneous: {
          include: {
            hierarchy: {
              select: {
                id: true,
                companyId: true,
                refName: true,
                parentId: true,
                type: true,
                workspaces: { select: { id: true } },
              },
            },
          },
        },
      },
    });

    return homoGroups;
  }
}
