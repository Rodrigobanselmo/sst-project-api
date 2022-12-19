import { EmployeePPPHistoryRepository } from './../../../repositories/implementations/EmployeePPPHistoryRepository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateHomoGroupDto } from '../../../../../modules/company/dto/homoGroup';
import { HomoGroupRepository } from '../../../../../modules/company/repositories/implementations/HomoGroupRepository';
import { ErrorCompanyEnum } from '../../../../../shared/constants/enum/errorMessage';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class UpdateHomoGroupService {
  constructor(private readonly homoGroupRepository: HomoGroupRepository, private readonly employeePPPHistoryRepository: EmployeePPPHistoryRepository) {}

  async execute(homoGroup: UpdateHomoGroupDto, userPayloadDto: UserPayloadDto) {
    const inactivating = homoGroup.status == 'INACTIVE';
    const foundHomoGroup = await this.homoGroupRepository.findHomoGroupByCompanyAndId(homoGroup.id, userPayloadDto.targetCompanyId, {
      select: {
        id: true,
        created_at: true,
        ...(inactivating && { hierarchyOnHomogeneous: { where: { endDate: null }, take: 1, select: { id: true } } }),
      },
    });

    if (!foundHomoGroup?.id) throw new BadRequestException(ErrorCompanyEnum.GHO_NOT_FOUND);

    const forbidenInactivating = inactivating && foundHomoGroup.hierarchyOnHomogeneous[0]?.id;
    if (forbidenInactivating) {
      throw new BadRequestException(ErrorCompanyEnum.FORBIDEN_INACTIVATION);
    }

    const homo = await this.homoGroupRepository.update(homoGroup);

    if ('startDate' in homoGroup || 'endDate' in homoGroup)
      this.employeePPPHistoryRepository.updateManyNude({
        data: { sendEvent: true },
        where: {
          employee: {
            companyId: userPayloadDto.targetCompanyId,
            hierarchyHistory: { some: { hierarchy: { hierarchyOnHomogeneous: { some: { homogeneousGroupId: homo.id } } } } },
          },
        },
      });

    return homo;
  }
}
