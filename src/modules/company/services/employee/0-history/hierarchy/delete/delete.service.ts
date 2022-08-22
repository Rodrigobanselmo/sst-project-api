import {
  EmployeeHierarchyHistoryEntity,
  historyRules,
} from './../../../../../entities/employee-hierarchy-history.entity';
import { sortData } from './../../../../../../../shared/utils/sorts/data.sort';
import { EmployeeEntity } from './../../../../../entities/employee.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EmployeeHierarchyMotiveTypeEnum } from '@prisma/client';
import { ErrorMessageEnum } from 'src/shared/constants/enum/errorMessage';

import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { EmployeeHierarchyHistoryRepository } from './../../../../../repositories/implementations/EmployeeHierarchyHistoryRepository';
import { EmployeeRepository } from './../../../../../repositories/implementations/EmployeeRepository';

@Injectable()
export class DeleteEmployeeHierarchyHistoryService {
  constructor(
    private readonly employeeHierarchyHistoryRepository: EmployeeHierarchyHistoryRepository,
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(id: number, employeeId: number, user: UserPayloadDto) {
    const found = await this.employeeRepository.findById(
      employeeId,
      user.targetCompanyId,
    );

    if (!found?.id)
      throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_NOT_FOUND);

    const hierarchyId = await this.check({ id, foundEmployee: found });

    const history = await this.employeeHierarchyHistoryRepository.delete(
      id,
      employeeId,
      hierarchyId,
    );

    return history;
  }

  async check({
    foundEmployee,
    id,
  }: {
    foundEmployee: EmployeeEntity;
    id: number;
  }) {
    // CHECK AFTER
    let afterHistory: EmployeeHierarchyHistoryEntity;
    let beforeHistory: EmployeeHierarchyHistoryEntity;
    {
      const allHistory = (
        await this.employeeHierarchyHistoryRepository.findNude({
          where: {
            employeeId: foundEmployee.id,
          },
          orderBy: { startDate: 'asc' },
        })
      )
        .sort((a, b) => sortData(a.created_at, b.created_at))
        .sort((a, b) => sortData(a.startDate, b.startDate));

      const actualHistoryIndex = allHistory.findIndex(
        (history) => history.id === id,
      );

      if (actualHistoryIndex === -1)
        throw new BadRequestException(
          ErrorMessageEnum.NOT_FOUND_ON_COMPANY_TO_DELETE,
        );

      afterHistory = allHistory[actualHistoryIndex + 1];
      beforeHistory = allHistory[actualHistoryIndex - 1];

      const afterMotive = afterHistory?.motive || null;
      const beforeMotive = beforeHistory?.motive || null;

      const isAfterOk =
        historyRules[String(afterMotive)].before.includes(beforeMotive);
      const isBeforeOk =
        historyRules[String(beforeMotive)].after.includes(afterMotive);

      if (!isAfterOk || !isBeforeOk)
        throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_BLOCK_HISTORY);
    }

    const getActualEmployeeHierarchy = () => {
      if (afterHistory === null) {
        if (beforeHistory.motive === EmployeeHierarchyMotiveTypeEnum.DEM)
          return null;
        if (beforeHistory.hierarchyId) return beforeHistory.hierarchyId;
        if (!beforeHistory.hierarchyId)
          throw new BadRequestException(
            ErrorMessageEnum.EMPLOYEE_MISSING_HIERARCHY,
          );
      }

      return undefined;
    };

    const hierarchyId = getActualEmployeeHierarchy();
    return hierarchyId;
  }
}
