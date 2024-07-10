import { EmployeeEntity } from './../../../../../entities/employee.entity';
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
import { EmployeeHierarchyHistoryEntity } from './../../../../../../../modules/company/entities/employee-hierarchy-history.entity';

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

  async execute(
    dataDto: UpdateEmployeeHierarchyHistoryDto,
    user: UserPayloadDto,
    history?: EmployeeHierarchyHistoryEntity,
    employee?: EmployeeEntity,
  ) {
    if (!history) {
      history = await this.employeeHierarchyHistoryRepository.findFirstNude({
        where: { id: dataDto.id, employeeId: dataDto.employeeId, employee: { companyId: user.targetCompanyId } },
        select: { id: true, employeeId: true, startDate: true },
      });
    }

    if (!employee) {
      employee = { id: history.employeeId } as EmployeeEntity;
      if (!employee?.id) throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_NOT_FOUND);
    }

    await this.deleteEmployeeHierarchyHistoryService.checkDeletion(history, user);

    const { hierarchyId, beforeHistory } = await this.createEmployeeHierarchyHistoryService.check({
      dataDto,
      foundEmployee: employee,
      histories: employee?.hierarchyHistory,
    });

    if (dataDto.motive === EmployeeHierarchyMotiveTypeEnum.DEM) dataDto.hierarchyId = beforeHistory.hierarchyId;

    const historyUp = await this.employeeHierarchyHistoryRepository.update(
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
      employeeId: dataDto.employeeId,
    });

    await Promise.all([pppPromise, checkExamPromise]);

    return historyUp;
  }
}
