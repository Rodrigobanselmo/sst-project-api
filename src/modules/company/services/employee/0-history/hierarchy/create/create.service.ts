import { CheckEmployeeExamService } from './../../../../../../sst/services/exam/check-employee-exam/check-employee-exam.service';
import { EmployeePPPHistoryRepository } from './../../../../../repositories/implementations/EmployeePPPHistoryRepository';
import { EmployeeEntity } from './../../../../../entities/employee.entity';
import { sortData } from './../../../../../../../shared/utils/sorts/data.sort';
import { EmployeeHierarchyHistoryEntity, historyRules } from './../../../../../entities/employee-hierarchy-history.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EmployeeHierarchyMotiveTypeEnum } from '@prisma/client';
import { ErrorMessageEnum } from './../../../../../../../shared/constants/enum/errorMessage';

import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { CreateEmployeeHierarchyHistoryDto } from '../../../../../dto/employee-hierarchy-history';
import { EmployeeHierarchyHistoryRepository } from '../../../../../repositories/implementations/EmployeeHierarchyHistoryRepository';
import { EmployeeRepository } from '../../../../../repositories/implementations/EmployeeRepository';

@Injectable()
export class CreateEmployeeHierarchyHistoryService {
  constructor(
    private readonly employeeHierarchyHistoryRepository: EmployeeHierarchyHistoryRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly employeePPPHistoryRepository: EmployeePPPHistoryRepository,
    private readonly checkEmployeeExamService: CheckEmployeeExamService,
  ) {}

  async execute(dataDto: CreateEmployeeHierarchyHistoryDto, user: UserPayloadDto) {
    const found = await this.employeeRepository.findById(dataDto.employeeId, user.targetCompanyId);

    if (!found?.id) throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_NOT_FOUND);

    const { hierarchyId, beforeHistory } = await this.check({
      dataDto,
      foundEmployee: found,
    });

    if (dataDto.motive === EmployeeHierarchyMotiveTypeEnum.DEM) dataDto.hierarchyId = beforeHistory.hierarchyId;

    const history = await this.employeeHierarchyHistoryRepository.create(
      {
        ...dataDto,
      },
      found.id,
      hierarchyId,
    );

    this.employeePPPHistoryRepository.updateManyNude({
      data: { sendEvent: true },
      where: {
        employee: {
          companyId: user.targetCompanyId,
          id: dataDto.employeeId,
        },
      },
    });

    this.checkEmployeeExamService.execute({
      employeeId: found.id,
    });

    return history;
  }

  async check({ dataDto, foundEmployee }: { dataDto: Partial<CreateEmployeeHierarchyHistoryDto>; foundEmployee: EmployeeEntity }) {
    if (!dataDto.startDate) throw new BadRequestException('missing start date');
    // CHECK ACTUAL
    // {
    //   const isActualOk =
    //     historyRules[dataDto.motive].canHaveHierarchy === !!found.hierarchyId;

    //   if (!isActualOk) {
    //     if (found.hierarchyId)
    //       throw new BadRequestException(
    //         ErrorMessageEnum.EMPLOYEE_FORBIDDEN_ADM_TWICE,
    //       );
    //     if (!found.hierarchyId)
    //       throw new BadRequestException(
    //         ErrorMessageEnum.EMPLOYEE_NOT_IN_HIERARCHY,
    //       );
    //   }
    // }

    // CHECK AFTER
    let afterMotive: EmployeeHierarchyMotiveTypeEnum | null;
    {
      const afterHistory = (
        await this.employeeHierarchyHistoryRepository.findNude({
          where: {
            employeeId: foundEmployee.id,
            startDate: { gte: dataDto.startDate },
          },
          orderBy: { startDate: 'asc' },
          take: 3,
        })
      )
        .sort((a, b) => sortData(a.created_at, b.created_at))
        .sort((a, b) => sortData(a.startDate, b.startDate))[0];

      afterMotive = afterHistory?.motive || null;
      const isAfterOk = historyRules[dataDto.motive].after.includes(afterMotive);

      if (!isAfterOk) throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_BLOCK_HISTORY);
    }

    // CHECK BEFORE
    let beforeMotive: EmployeeHierarchyMotiveTypeEnum | null;
    let beforeHistory: EmployeeHierarchyHistoryEntity;
    {
      beforeHistory = (
        await this.employeeHierarchyHistoryRepository.findNude({
          where: {
            employeeId: foundEmployee.id,
            startDate: { lte: dataDto.startDate },
          },
          orderBy: { startDate: 'desc' },
          take: 3,
        })
      )
        .sort((a, b) => sortData(b.created_at, a.created_at))
        .sort((a, b) => sortData(b.startDate, a.startDate))[0];

      beforeMotive = beforeHistory?.motive || null;
      const isBeforeOk = historyRules[dataDto.motive].before.includes(beforeMotive);

      if (!isBeforeOk) throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_BLOCK_HISTORY);
    }

    const getActualEmployeeHierarchy = () => {
      if (afterMotive === null) {
        if (dataDto.motive === EmployeeHierarchyMotiveTypeEnum.DEM) return null;
        if (dataDto.hierarchyId) return dataDto.hierarchyId;
        if (!dataDto.hierarchyId) throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_MISSING_HIERARCHY);
      }

      return undefined;
    };

    const hierarchyId = getActualEmployeeHierarchy();
    return { hierarchyId, beforeHistory };
  }
}
