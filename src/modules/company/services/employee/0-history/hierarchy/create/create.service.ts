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

  async execute(dataDto: CreateEmployeeHierarchyHistoryDto, user: UserPayloadDto, employee?: EmployeeEntity) {
    if (!employee) {
      employee = await this.employeeRepository.findById(dataDto.employeeId, user.targetCompanyId, { select: { id: true, cpf: true } });

      if (!employee?.id) throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_NOT_FOUND);
    }

    const { hierarchyId, beforeHistory } = await this.check({
      dataDto,
      foundEmployee: employee,
      histories: employee.hierarchyHistory,
    });

    if (dataDto.motive === EmployeeHierarchyMotiveTypeEnum.DEM) dataDto.hierarchyId = beforeHistory.hierarchyId;

    const history = await this.employeeHierarchyHistoryRepository.create(
      {
        ...dataDto,
      },
      employee.id,
      hierarchyId,
    );

    const pppPromise = this.employeePPPHistoryRepository.updateManyNude({
      data: { sendEvent: true },
      where: {
        employee: {
          companyId: user.targetCompanyId,
          id: dataDto.employeeId,
        },
      },
    });

    const checkExamPromise = this.checkEmployeeExamService.execute({
      employeeId: employee.id,
    });

    await Promise.all([pppPromise, checkExamPromise]);

    return history;
  }

  async check({
    dataDto,
    foundEmployee,
    histories,
  }: {
    dataDto: Partial<CreateEmployeeHierarchyHistoryDto & { id?: number }>;
    foundEmployee: Pick<EmployeeEntity, 'id' | 'cpf'>;
    histories?: EmployeeHierarchyHistoryEntity[];
  }) {
    if (!dataDto.startDate) throw new BadRequestException('missing start date');

    let afterMotive: EmployeeHierarchyMotiveTypeEnum | null;
    {
      let afterHistories = histories?.filter((h) => {
        const cond2 = dataDto.id ? h.id !== dataDto.id : true;
        const cond1 = h.startDate >= dataDto.startDate;

        return cond1 && cond2;
      });

      if (!afterHistories) {
        afterHistories = await this.employeeHierarchyHistoryRepository.findNude({
          where: {
            employeeId: foundEmployee.id,
            startDate: { gte: dataDto.startDate },
            ...(dataDto.id && { id: { not: dataDto.id } }),
          },
          orderBy: { startDate: 'asc' },
          take: 3,
        });
      }

      const afterHistory = afterHistories.sort((a, b) => sortData(a.created_at, b.created_at)).sort((a, b) => sortData(a.startDate, b.startDate))[0];

      afterMotive = afterHistory?.motive || null;
      const isAfterOk = historyRules[dataDto.motive].after.includes(afterMotive);

      if (!isAfterOk) throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_BLOCK_HISTORY + (foundEmployee?.cpf ? ` ${foundEmployee.cpf}` : ''));
    }

    // CHECK BEFORE
    let beforeMotive: EmployeeHierarchyMotiveTypeEnum | null;
    let beforeHistories: EmployeeHierarchyHistoryEntity[];
    let beforeHistory: EmployeeHierarchyHistoryEntity;
    {
      beforeHistories = histories?.filter((h) => {
        const cond2 = dataDto.id ? h.id !== dataDto.id : true;
        const cond1 = h.startDate <= dataDto.startDate;

        return cond1 && cond2;
      });

      if (!beforeHistories) {
        beforeHistories = await this.employeeHierarchyHistoryRepository.findNude({
          where: {
            employeeId: foundEmployee.id,
            startDate: { lte: dataDto.startDate },
            ...(dataDto.id && { id: { not: dataDto.id } }),
          },
          orderBy: { startDate: 'desc' },
          take: 3,
        });
      }

      beforeHistory = beforeHistories.sort((a, b) => sortData(b.created_at, a.created_at)).sort((a, b) => sortData(b.startDate, a.startDate))[0];

      beforeMotive = beforeHistory?.motive || null;
      if (beforeMotive && beforeMotive != EmployeeHierarchyMotiveTypeEnum.DEM && dataDto.motive == EmployeeHierarchyMotiveTypeEnum.ADM)
        dataDto.motive = EmployeeHierarchyMotiveTypeEnum.TRANS_PROM;

      const isBeforeOk = historyRules[dataDto.motive].before.includes(beforeMotive);

      if (!isBeforeOk) throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_BLOCK_HISTORY + (foundEmployee?.cpf ? ` ${foundEmployee.cpf}` : ''));
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
