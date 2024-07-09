import { RoleEnum } from './../../../../../../../shared/constants/enum/authorization';
import { CheckEmployeeExamService } from './../../../../../../sst/services/exam/check-employee-exam/check-employee-exam.service';
import { EmployeePPPHistoryRepository } from './../../../../../repositories/implementations/EmployeePPPHistoryRepository';
import {
  EmployeeHierarchyHistoryEntity,
  historyRules,
} from './../../../../../entities/employee-hierarchy-history.entity';
import { sortData } from './../../../../../../../shared/utils/sorts/data.sort';
import { EmployeeEntity } from './../../../../../entities/employee.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EmployeeHierarchyMotiveTypeEnum } from '@prisma/client';
import { ErrorMessageEnum } from './../../../../../../../shared/constants/enum/errorMessage';

import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { EmployeeHierarchyHistoryRepository } from './../../../../../repositories/implementations/EmployeeHierarchyHistoryRepository';
import { EmployeeRepository } from './../../../../../repositories/implementations/EmployeeRepository';

@Injectable()
export class DeleteEmployeeHierarchyHistoryService {
  constructor(
    private readonly employeeHierarchyHistoryRepository: EmployeeHierarchyHistoryRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly employeePPPHistoryRepository: EmployeePPPHistoryRepository,
    private readonly checkEmployeeExamService: CheckEmployeeExamService,
  ) {}

  async execute(id: number, employeeId: number, user: UserPayloadDto) {
    const history = await this.employeeHierarchyHistoryRepository.findFirstNude({
      where: { id, employeeId },
      select: { id: true, employeeId: true, startDate: true, employee: { select: { id: true, cpf: true } } },
    });

    const found = history.employee;

    if (!found?.id) throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_NOT_FOUND);

    await this.checkDeletion(history, user);
    const hierarchyId = await this.check({ id, foundEmployee: found });

    await this.employeeHierarchyHistoryRepository.delete(id, employeeId, hierarchyId);

    const pppPromise = this.employeePPPHistoryRepository.updateManyNude({
      data: { sendEvent: true },
      where: {
        employee: {
          companyId: user.targetCompanyId,
          id: employeeId,
        },
      },
    });

    const checkExamPromise = this.checkEmployeeExamService.execute({
      employeeId,
    });

    await Promise.all([pppPromise, checkExamPromise]);

    return history;
  }

  async check({
    foundEmployee,
    id,
    history,
  }: {
    foundEmployee: EmployeeEntity;
    id: number;
    history?: EmployeeHierarchyHistoryEntity[];
  }) {
    // CHECK AFTER
    let afterHistory: EmployeeHierarchyHistoryEntity;
    let beforeHistory: EmployeeHierarchyHistoryEntity;
    {
      const allHistory = (
        history
          ? history
          : await this.employeeHierarchyHistoryRepository.findNude({
              where: {
                employeeId: foundEmployee.id,
              },
              orderBy: { startDate: 'asc' },
            })
      )
        .sort((a, b) => sortData(a.created_at, b.created_at))
        .sort((a, b) => sortData(a.startDate, b.startDate));

      const actualHistoryIndex = allHistory.findIndex((history) => history.id === id);

      if (actualHistoryIndex === -1) throw new BadRequestException(ErrorMessageEnum.NOT_FOUND_ON_COMPANY_TO_DELETE);

      afterHistory = allHistory[actualHistoryIndex + 1];
      beforeHistory = allHistory[actualHistoryIndex - 1];

      const afterMotive = afterHistory?.motive || null;
      const beforeMotive = beforeHistory?.motive || null;

      const isAfterOk = historyRules[String(afterMotive)]?.before?.includes(beforeMotive);
      const isBeforeOk = historyRules[String(beforeMotive)]?.after?.includes(afterMotive);

      if (!isAfterOk || !isBeforeOk)
        throw new BadRequestException(
          ErrorMessageEnum.EMPLOYEE_BLOCK_HISTORY + (foundEmployee?.cpf ? ` ${foundEmployee.cpf}` : ''),
        );
    }

    const getActualEmployeeHierarchy = () => {
      if (afterHistory === undefined) {
        if (beforeHistory?.motive === EmployeeHierarchyMotiveTypeEnum.DEM) return null;
        if (beforeHistory?.hierarchyId) return beforeHistory.hierarchyId;
        if (!beforeHistory?.hierarchyId) throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_MISSING_HIERARCHY);
      }

      return undefined;
    };

    const hierarchyId = getActualEmployeeHierarchy();
    return hierarchyId;
  }

  async checkDeletion(history: EmployeeHierarchyHistoryEntity, userPayloadDto: UserPayloadDto) {
    if (userPayloadDto.roles.includes(RoleEnum.ESOCIAL_EDIT)) return;

    const foundPPP = await this.employeePPPHistoryRepository.findFirstNude({
      select: { id: true },
      orderBy: { doneDate: 'desc' },
      where: {
        doneDate: { gte: history.startDate },
        employeeId: history.employeeId,
        events: {
          some: {
            status: { in: ['DONE', 'TRANSMITTED'] },
            eventsDate: { gte: history.startDate },
          },
        },
      },
    });

    if (foundPPP?.id) throw new BadRequestException(ErrorMessageEnum.ESOCIAL_FORBIDDEN_HIER_DELETION);
  }
}
