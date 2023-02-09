import { HomoGroupEntity } from './../../../entities/homoGroup.entity';
import { RoleEnum } from './../../../../../shared/constants/enum/authorization';
import { EmployeePPPHistoryRepository } from './../../../repositories/implementations/EmployeePPPHistoryRepository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateHierarchyHomoGroupDto, UpdateHomoGroupDto } from '../../../../../modules/company/dto/homoGroup';
import { HomoGroupRepository } from '../../../../../modules/company/repositories/implementations/HomoGroupRepository';
import { ErrorCompanyEnum, ErrorMessageEnum } from '../../../../../shared/constants/enum/errorMessage';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { DeleteHierarchyHomoGroupService } from '../delete-hierarchy-homo-group/delete-hierarchy-homo-group.service';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';

@Injectable()
export class UpdateHomoGroupService {
  constructor(
    private readonly homoGroupRepository: HomoGroupRepository,
    private readonly deleteHierarchyHomoGroupService: DeleteHierarchyHomoGroupService,
    private readonly employeePPPHistoryRepository: EmployeePPPHistoryRepository,
  ) {}

  async execute(homoGroup: UpdateHomoGroupDto, userPayloadDto: UserPayloadDto) {
    const inactivating = homoGroup.status == 'INACTIVE';
    const foundHomoGroup = await this.homoGroupRepository.findHomoGroupByCompanyAndId(homoGroup.id, userPayloadDto.targetCompanyId, {
      select: {
        id: true,
        created_at: true,
        ...(inactivating && { hierarchyOnHomogeneous: { where: { endDate: null }, take: 1, select: { id: true } } }),
        ...(!!homoGroup?.hierarchies?.length && {
          hierarchyOnHomogeneous: {
            select: { id: true, startDate: true, endDate: true, hierarchyId: true },
            where: {
              endDate: null,
              hierarchy: {
                id: { in: homoGroup.hierarchies.map((h) => h.id) },
              },
            },
          },
        }),
      },
    });

    if (!foundHomoGroup?.id) throw new BadRequestException(ErrorCompanyEnum.GHO_NOT_FOUND);

    const forbidenInactivating = inactivating && foundHomoGroup.hierarchyOnHomogeneous[0]?.id;
    if (forbidenInactivating) {
      throw new BadRequestException(ErrorCompanyEnum.FORBIDEN_INACTIVATION);
    }

    await this.deleteHierarchyHomoGroupService.checkDeletion(foundHomoGroup, userPayloadDto, {
      updateCheck: true,
      onlyEndPresentOk: true,
      data: { endDate: homoGroup.endDate, startDate: homoGroup.startDate },
    });

    await this.checkDeletion(foundHomoGroup, userPayloadDto, {
      endDate: homoGroup.endDate,
      startDate: homoGroup.startDate,
      ids: homoGroup?.hierarchies?.map((i) => i.id) || [],
    });

    const homo = await this.homoGroupRepository.update({ ...homoGroup, companyId: userPayloadDto.targetCompanyId });

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

  async checkDeletion(homoGroup: HomoGroupEntity, userPayloadDto: UserPayloadDto, data: { ids: string[]; endDate?: Date; startDate?: Date }) {
    const newHierarchyIds = data?.ids?.filter((id) => !homoGroup.hierarchyOnHomogeneous?.find((hh) => hh?.hierarchyId == id)) || [];

    if (newHierarchyIds.length == 0) return;

    const foundPPP = await this.employeePPPHistoryRepository.findFirstNude({
      select: { id: true, doneDate: true, created_at: true },
      orderBy: { doneDate: 'desc' },
      where: {
        employee: {
          hierarchyHistory: { some: { hierarchy: { id: { in: newHierarchyIds } } } },
        },
        events: {
          some: {
            status: { in: ['DONE', 'TRANSMITTED'] },
          },
        },
      },
    });

    const pppId = foundPPP?.id;
    if (!pppId) return;

    // const endDate = data?.endDate || null;
    const startDate = data?.startDate || null;

    if (startDate && userPayloadDto.roles.includes(RoleEnum.ESOCIAL_EDIT)) return;

    const missingRequiredStartDate = !startDate;
    if (missingRequiredStartDate) throw new BadRequestException('Adicione uma data de início para a nova condição');

    const isError = foundPPP.doneDate > startDate;

    if (isError) throw new BadRequestException(ErrorMessageEnum.ESOCIAL_FORBIDDEN_HIER_DELETION);
  }
}
