import { EmployeeEntity } from './../../../../../entities/employee.entity';
import { Injectable } from '@nestjs/common';
import { EmployeeHierarchyMotiveTypeEnum } from '@prisma/client';

import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { DayJSProvider } from '../../../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { CreateEmployeeHierarchyHistoryDto } from '../../../../../dto/employee-hierarchy-history';
import { EmployeeRepository } from '../../../../../repositories/implementations/EmployeeRepository';
import { CreateEmployeeHierarchyHistoryService } from '../create/create.service';
import { UpdateEmployeeHierarchyHistoryService } from '../update/update.service';

@Injectable()
export class UpsertEmployeeHierarchyHistoryService {
  constructor(
    private readonly dayJSProvider: DayJSProvider,
    private readonly employeeRepository: EmployeeRepository,
    private readonly updateEmployeeHierarchyHistoryService: UpdateEmployeeHierarchyHistoryService,
    private readonly createEmployeeHierarchyHistoryService: CreateEmployeeHierarchyHistoryService,
  ) {}

  async execute(dataDto: CreateEmployeeHierarchyHistoryDto & { companyId: string }, user: UserPayloadDto, employee?: EmployeeEntity) {
    if (!employee) {
      employee = await this.employeeRepository.findById(dataDto.employeeId, dataDto.companyId, {
        select: { id: true, hierarchyHistory: true, cpf: true },
      });
    }

    const foundHistory = employee.hierarchyHistory.find((history) => {
      const sameDate = this.dayJSProvider.format(dataDto.startDate) === this.dayJSProvider.format(history.startDate);
      if (!sameDate) return false;

      const sameMotive = (EmployeeHierarchyMotiveTypeEnum.DEM == dataDto.motive) == (history.motive == EmployeeHierarchyMotiveTypeEnum.DEM);
      return sameMotive;
    });

    if (foundHistory) {
      await this.updateEmployeeHierarchyHistoryService.execute(
        {
          id: foundHistory.id,
          motive: foundHistory.motive,
          hierarchyId: dataDto.hierarchyId,
          startDate: dataDto.startDate,
          employeeId: dataDto.employeeId,
          subOfficeId: dataDto.subOfficeId,
        },
        { ...user, targetCompanyId: dataDto.companyId },
        foundHistory,
        employee,
      );
    } else {
      return await this.createEmployeeHierarchyHistoryService.execute(
        {
          motive: dataDto.motive,
          startDate: dataDto.startDate,
          employeeId: dataDto.employeeId,
          ...(dataDto.motive != EmployeeHierarchyMotiveTypeEnum.DEM && {
            hierarchyId: dataDto.hierarchyId,
            subOfficeId: dataDto.subOfficeId,
          }),
        },
        { ...user, targetCompanyId: dataDto.companyId },
        employee,
      );
    }
  }
}
