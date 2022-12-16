import { BadRequestException, Injectable } from '@nestjs/common';
import { HomoGroupRepository } from '../../../../../modules/company/repositories/implementations/HomoGroupRepository';
import { ErrorCompanyEnum, ErrorMessageEnum } from '../../../../../shared/constants/enum/errorMessage';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class DeleteHomoGroupService {
  constructor(private readonly homoGroupRepository: HomoGroupRepository) {}

  async execute(id: string, userPayloadDto: UserPayloadDto) {
    const foundHomoGroup = await this.homoGroupRepository.findHomoGroupByCompanyAndId(id, userPayloadDto.targetCompanyId, {
      select: {
        id: true,
        hierarchyOnHomogeneous: {
          select: { id: true },
          take: 1,
          where: {
            hierarchy: {
              hierarchyHistory: {
                some: {
                  employee: {
                    esocialEvents: {
                      some: {
                        status: { in: ['DONE', 'TRANSMITTED'] },
                        type: 'RISK_2240',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!foundHomoGroup?.id) throw new BadRequestException(ErrorCompanyEnum.GHO_NOT_FOUND);
    if (foundHomoGroup.hierarchyOnHomogeneous?.[0]?.id) throw new BadRequestException(ErrorMessageEnum.ESOCIAL_FORBIDDEN_DELETION);

    const homoGroups = await this.homoGroupRepository.deleteById(id);

    return homoGroups;
  }
}
