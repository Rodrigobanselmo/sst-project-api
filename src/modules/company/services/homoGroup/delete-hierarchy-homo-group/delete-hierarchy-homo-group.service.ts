import { HomoGroupEntity } from './../../../entities/homoGroup.entity';
import { RoleEnum } from './../../../../../shared/constants/enum/authorization';
import { EmployeePPPHistoryRepository } from '../../../repositories/implementations/EmployeePPPHistoryRepository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateHierarchyHomoGroupDto } from '../../../dto/homoGroup';
import { HomoGroupRepository } from '../../../repositories/implementations/HomoGroupRepository';
import { ErrorCompanyEnum, ErrorMessageEnum } from '../../../../../shared/constants/enum/errorMessage';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';

@Injectable()
export class DeleteHierarchyHomoGroupService {
  constructor(
    private readonly homoGroupRepository: HomoGroupRepository,
    private readonly employeePPPHistoryRepository: EmployeePPPHistoryRepository,
    private readonly dayjsPropvider: DayJSProvider,
  ) {}

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
          select: { id: true, startDate: true, endDate: true },
          where: {
            workspaceId: homoGroup.workspaceId,
            id: { in: homoGroup.ids },
          },
        },
      },
    });

    if (!foundHomoGroup?.id) throw new BadRequestException(ErrorCompanyEnum.GHO_NOT_FOUND);
    if (foundHomoGroup?.hierarchyOnHomogeneous.length !== homoGroup.ids.length) throw new BadRequestException(ErrorCompanyEnum.GHO_NOT_FOUND);

    await this.checkDeletion(foundHomoGroup, userPayloadDto, { deleteCheck: true });

    const data = await this.homoGroupRepository.deleteHierarchyHomo(homoGroup);
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

  async checkDeletion(
    homoGroup: HomoGroupEntity,
    userPayloadDto: UserPayloadDto,
    check?: { deleteCheck?: boolean; updateCheck?: boolean; data?: UpdateHierarchyHomoGroupDto },
  ) {
    if (userPayloadDto.roles.includes(RoleEnum.ESOCIAL_EDIT)) return;
    const foundPPP = await this.employeePPPHistoryRepository.findFirstNude({
      select: { id: true, doneDate: true },
      orderBy: { doneDate: 'desc' },
      where: {
        employee: {
          hierarchyHistory: { some: { hierarchy: { hierarchyOnHomogeneous: { some: { id: { in: homoGroup.hierarchyOnHomogeneous.map((hh) => hh.id) } } } } } },
        },
        events: {
          some: {
            status: { in: ['DONE', 'TRANSMITTED'] },
          },
        },
      },
    });

    const pppId = foundPPP?.id;

    if (check.deleteCheck) {
      const isStartDateBefore = pppId && homoGroup.hierarchyOnHomogeneous.some((hh) => !hh.startDate || hh.startDate < foundPPP.doneDate);

      if (isStartDateBefore) throw new BadRequestException(ErrorMessageEnum.ESOCIAL_FORBIDDEN_HIER_DELETION);
    }

    if (check.updateCheck && check.data) {
      const startDate = check.data?.startDate || null;
      const endDate = check.data?.endDate || null;
      const isError =
        pppId &&
        homoGroup.hierarchyOnHomogeneous.some((hh) => {
          const isSameStartDate = this.dayjsPropvider.format(hh.startDate) == this.dayjsPropvider.format(startDate);
          const isActualStartDateBeforePPP = !hh.startDate || hh.startDate < foundPPP.doneDate;

          const isRequestEndDateBeforePPP = endDate && endDate < foundPPP.doneDate;
          const isActualEndDateBeforePPP = hh.endDate && hh.endDate < foundPPP.doneDate;
          const isSameEndDate = this.dayjsPropvider.format(hh.endDate) == this.dayjsPropvider.format(endDate);

          return (isActualEndDateBeforePPP && !isSameEndDate) || (isActualStartDateBeforePPP && !isSameStartDate) || isRequestEndDateBeforePPP;
        });

      if (isError) throw new BadRequestException(ErrorMessageEnum.ESOCIAL_FORBIDDEN_HIER_DELETION);
    }
  }
}
