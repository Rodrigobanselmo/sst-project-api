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

@Injectable()
export class UpdateEmployeeHierarchyHistoryService {
  constructor(
    private readonly employeeHierarchyHistoryRepository: EmployeeHierarchyHistoryRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly employeePPPHistoryRepository: EmployeePPPHistoryRepository,
    private readonly createEmployeeHierarchyHistoryService: CreateEmployeeHierarchyHistoryService,
    private readonly checkEmployeeExamService: CheckEmployeeExamService,
  ) {}

  async execute(dataDto: UpdateEmployeeHierarchyHistoryDto, user: UserPayloadDto) {
    const found = await this.employeeRepository.findById(dataDto.employeeId, user.targetCompanyId);

    if (!found?.id) throw new BadRequestException(ErrorMessageEnum.EMPLOYEE_NOT_FOUND);

    const { hierarchyId, beforeHistory } = await this.createEmployeeHierarchyHistoryService.check({
      dataDto,
      foundEmployee: found,
    });

    if (dataDto.motive === EmployeeHierarchyMotiveTypeEnum.DEM) dataDto.hierarchyId = beforeHistory.hierarchyId;

    const history = await this.employeeHierarchyHistoryRepository.update(
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

    return history;
  }
}
