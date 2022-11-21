import { EmployeePPPHistoryRepository } from './../../../repositories/implementations/EmployeePPPHistoryRepository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateHierarchyHomoGroupDto } from '../../../dto/homoGroup';
import { HomoGroupRepository } from '../../../repositories/implementations/HomoGroupRepository';
import { ErrorCompanyEnum } from '../../../../../shared/constants/enum/errorMessage';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class UpdateHierarchyHomoGroupService {
  constructor(private readonly homoGroupRepository: HomoGroupRepository, private readonly employeePPPHistoryRepository: EmployeePPPHistoryRepository) {}

  async execute(homoGroup: UpdateHierarchyHomoGroupDto, userPayloadDto: UserPayloadDto) {
    const foundHomoGroup = await this.homoGroupRepository.findFirstNude({
      where: {
        companyId: userPayloadDto.targetCompanyId,
        hierarchyOnHomogeneous: {
          some: {
            workspaceId: homoGroup.workspaceId,
            id: { in: homoGroup.ids },
          },
        },
      },
      select: {
        id: true,
        hierarchyOnHomogeneous: {
          select: { id: true },
          where: {
            workspaceId: homoGroup.workspaceId,
            id: { in: homoGroup.ids },
          },
        },
      },
    });

    if (!foundHomoGroup?.id) throw new BadRequestException(ErrorCompanyEnum.GHO_NOT_FOUND);
    if (foundHomoGroup?.hierarchyOnHomogeneous.length !== homoGroup.ids.length) throw new BadRequestException(ErrorCompanyEnum.GHO_NOT_FOUND);

    const data = await this.homoGroupRepository.updateHierarchyHomo(homoGroup);

    if ('startDate' in homoGroup || 'endDate' in homoGroup)
      this.employeePPPHistoryRepository.updateManyNude({
        data: { sendEvent: true },
        where: {
          employee: {
            companyId: userPayloadDto.targetCompanyId,
            hierarchyHistory: {
              some: {
                hierarchy: {
                  hierarchyOnHomogeneous: {
                    some: { id: { in: homoGroup.ids } },
                  },
                },
              },
            },
          },
        },
      });

    return data;
  }
}
