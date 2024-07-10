import { EmployeePPPHistoryRepository } from './../../../repositories/implementations/EmployeePPPHistoryRepository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateHierarchyHomoGroupDto } from '../../../dto/homoGroup';
import { HomoGroupRepository } from '../../../repositories/implementations/HomoGroupRepository';
import { ErrorCompanyEnum } from '../../../../../shared/constants/enum/errorMessage';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { DeleteHierarchyHomoGroupService } from '../delete-hierarchy-homo-group/delete-hierarchy-homo-group.service';

@Injectable()
export class UpdateHierarchyHomoGroupService {
  constructor(
    private readonly homoGroupRepository: HomoGroupRepository,
    private readonly deleteHierarchyHomoGroupService: DeleteHierarchyHomoGroupService,
    private readonly employeePPPHistoryRepository: EmployeePPPHistoryRepository,
  ) {}

  async execute(homoGroup: UpdateHierarchyHomoGroupDto, userPayloadDto: UserPayloadDto) {
    const foundHomoGroup = await this.homoGroupRepository.findFirstNude({
      where: {
        companyId: userPayloadDto.targetCompanyId,
        hierarchyOnHomogeneous: {
          some: {
            id: { in: homoGroup.ids },
          },
        },
      },
      select: {
        id: true,
        hierarchyOnHomogeneous: {
          select: { id: true, startDate: true, endDate: true },
          where: {
            id: { in: homoGroup.ids },
          },
        },
      },
    });

    if (!foundHomoGroup?.id) throw new BadRequestException(ErrorCompanyEnum.GHO_NOT_FOUND);
    if (foundHomoGroup?.hierarchyOnHomogeneous.length !== homoGroup.ids.length)
      throw new BadRequestException(ErrorCompanyEnum.GHO_NOT_FOUND);

    await this.deleteHierarchyHomoGroupService.checkDeletion(foundHomoGroup, userPayloadDto, {
      updateCheck: true,
      data: homoGroup,
    });

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
