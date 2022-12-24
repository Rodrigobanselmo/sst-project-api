import { CheckEmployeeExamService } from './../../../../../../sst/services/exam/check-employee-exam/check-employee-exam.service';
import { EmployeePPPHistoryRepository } from './../../../../../repositories/implementations/EmployeePPPHistoryRepository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EmployeeHierarchyMotiveTypeEnum } from '@prisma/client';
import { ErrorMessageEnum } from './../../../../../../../shared/constants/enum/errorMessage';

import { UserPayloadDto } from '../../../../../../../shared/dto/user-payload.dto';
import { UpdateEmployeeHierarchyHistoryDto } from '../../../../../dto/employee-hierarchy-history';
import { EmployeeHierarchyHistoryRepository } from '../../../../../repositories/implementations/EmployeeHierarchyHistoryRepository';
import { EmployeeRepository } from '../../../../../repositories/implementations/EmployeeRepository';
import { CreateEmployeeHierarchyHistoryService } from '../create/create.service';
import { DeleteEmployeeHierarchyHistoryService } from '../delete/delete.service';

@Injectable()
export class UpdateEmployeeHierarchyHistoryService {
  constructor(
    private readonly employeeHierarchyHistoryRepository: EmployeeHierarchyHistoryRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly employeePPPHistoryRepository: EmployeePPPHistoryRepository,
    private readonly createEmployeeHierarchyHistoryService: CreateEmployeeHierarchyHistoryService,
    private readonly checkEmployeeExamService: CheckEmployeeExamService,
    private readonly deleteEmployeeHierarchyHistoryService: DeleteEmployeeHierarchyHistoryService,
  ) {}

  async execute(dataDto: UpdateEmployeeHierarchyHistoryDto, user: UserPayloadDto) {
    const history = await this.employeeHierarchyHistoryRepository.findFirstNude({
      where: { id: dataDto.id, employeeId: dataDto.employeeId, employee: { companyId: user.targetCompanyId } },
      select: { id: true, employeeId: true, startDate: true, employee: { select: { id: true } } },
    });

    const found = history.employee;
    if (!found?.id) throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_NOT_FOUND);

    await this.deleteEmployeeHierarchyHistoryService.checkDeletion(history, user);

    const { hierarchyId, beforeHistory } = await this.createEmployeeHierarchyHistoryService.check({
      dataDto,
      foundEmployee: found,
    });

    if (dataDto.motive === EmployeeHierarchyMotiveTypeEnum.DEM) dataDto.hierarchyId = beforeHistory.hierarchyId;

    const historyUp = await this.employeeHierarchyHistoryRepository.update(
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
      employeeId: dataDto.employeeId,
    });

    return historyUp;
  }
}
