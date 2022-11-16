import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from './../../../../../../../shared/dto/user-payload.dto';
import { FindEmployeeHierarchyHistoryDto } from './../../../../../dto/employee-hierarchy-history';
import { EmployeeHierarchyHistoryRepository } from './../../../../../repositories/implementations/EmployeeHierarchyHistoryRepository';

@Injectable()
export class FindEmployeeHierarchyHistoryService {
  constructor(private readonly employeeHierarchyHistoryRepository: EmployeeHierarchyHistoryRepository) {}

  async execute({ skip, take, ...query }: FindEmployeeHierarchyHistoryDto, user: UserPayloadDto) {
    const access = await this.employeeHierarchyHistoryRepository.find({ companyId: user.targetCompanyId, ...query }, { skip, take });

    return access;
  }
}
