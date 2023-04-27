import { HierarchyEntity } from './../../../entities/hierarchy.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { HierarchyRepository } from '../../../../../modules/company/repositories/implementations/HierarchyRepository';
import { ErrorMessageEnum } from '../../../../../shared/constants/enum/errorMessage';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { hierarchyList, hierarchyListReversed } from '../../../../../shared/constants/lists/hierarchy.list';

@Injectable()
export class DeleteHierarchyService {
  constructor(private readonly hierarchyRepository: HierarchyRepository) {}

  async execute(id: string, user: UserPayloadDto) {
    const optionsMainSelect = {
      id: true,
      type: true,
      name: true,
    };
    const optionsSelect = {
      employeeExamsHistory: {
        select: { id: true },
      },
      employeeExamsHistorySubOffice: {
        select: { id: true },
      },
      hierarchyHistory: {
        select: { id: true },
      },
      subHierarchyHistory: {
        select: { id: true },
      },
    };

    const hierarchy = await this.hierarchyRepository.findAllHierarchyByCompanyAndId(id, user.targetCompanyId, {
      select: {
        ...optionsMainSelect,
        ...optionsSelect,
        children: {
          select: {
            ...optionsMainSelect,
            ...optionsSelect,
            children: {
              select: {
                ...optionsMainSelect,
                ...optionsSelect,
                children: {
                  select: {
                    ...optionsMainSelect,
                    ...optionsSelect,
                    children: {
                      select: {
                        ...optionsMainSelect,
                        ...optionsSelect,
                        children: {
                          select: {
                            ...optionsMainSelect,
                            ...optionsSelect,
                            children: {
                              select: { ...optionsMainSelect, ...optionsSelect },
                            },
                          },
                        },
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

    if (!hierarchy?.id) throw new BadRequestException(ErrorMessageEnum.NOT_FOUND_ON_COMPANY_TO_DELETE);

    const { emptyResult, nonEmptyResult } = this.checkEmptyArraysAndChildren(hierarchy);

    if (nonEmptyResult && nonEmptyResult.length > 0) {
      throw new BadRequestException(
        'Não é possível deletar uma hierarquia que possui histórico de funcionários ' +
          nonEmptyResult
            .filter((i) => i.type == 'OFFICE' || i.type == 'SUB_OFFICE')
            .map((item) => item.name)
            .slice(0, 4)
            .join(', '),
      );
    }

    await Promise.all(
      hierarchyListReversed.map(async (type) => {
        const idsToDelete = emptyResult.filter((i) => i.type == type).map((item) => item.id);
        await this.hierarchyRepository.deleteByIds(idsToDelete);
      }),
    );

    return;
  }

  isEmptyArray(arr: any[]) {
    return Array.isArray(arr) && arr.length === 0;
  }

  checkEmptyArraysAndChildren(obj: HierarchyEntity, emptyResult: HierarchyEntity[] = [], nonEmptyResult: HierarchyEntity[] = []) {
    const { employeeExamsHistory, employeeExamsHistorySubOffice, hierarchyHistory, subHierarchyHistory, children } = obj;

    const allArraysEmpty =
      this.isEmptyArray(employeeExamsHistory) &&
      this.isEmptyArray(employeeExamsHistorySubOffice) &&
      this.isEmptyArray(hierarchyHistory) &&
      this.isEmptyArray(subHierarchyHistory);

    let hasNonEmptyChild = false;

    if (Array.isArray(children)) {
      children.forEach((child) => {
        const { hasNonEmpty } = this.checkEmptyArraysAndChildren(child, emptyResult, nonEmptyResult);
        hasNonEmptyChild = hasNonEmptyChild || hasNonEmpty;
      });
      delete obj.children;
    }

    const isEmpty = allArraysEmpty && !hasNonEmptyChild;

    if (isEmpty) {
      emptyResult.push(obj);
    } else {
      nonEmptyResult.push(obj);
    }

    return { emptyResult, nonEmptyResult, hasNonEmpty: !isEmpty };
  }
}
