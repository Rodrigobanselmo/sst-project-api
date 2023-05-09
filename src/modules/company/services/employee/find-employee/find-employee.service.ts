import { CheckEmployeeExamService } from './../../../../sst/services/exam/check-employee-exam/check-employee-exam.service';
import { FindExamByHierarchyService } from './../../../../sst/services/exam/find-by-hierarchy /find-exam-by-hierarchy.service';
import { EmployeeEntity } from './../../../entities/employee.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorCompanyEnum } from '../../../../../shared/constants/enum/errorMessage';
import { EmployeeRepository } from '../../../../../modules/company/repositories/implementations/EmployeeRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { FindOneEmployeeDto } from '../../../../../modules/company/dto/employee.dto';

@Injectable()
export class FindEmployeeService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly findExamByHierarchyService: FindExamByHierarchyService,
    private readonly checkEmployeeExamService: CheckEmployeeExamService,
  ) {}

  async execute(id: number, query: FindOneEmployeeDto, user: UserPayloadDto) {
    const isAbs60 = query?.absenteeismLast60Days;

    const employee = await this.employeeRepository.findById(id, user.targetCompanyId, {
      ...(isAbs60 && {
        include: { absenteeisms: { select: { id: true, startDate: true, endDate: true, motive: true, esocial18: true } } },
      }),
    });

    if (!employee?.id) throw new BadRequestException(ErrorCompanyEnum.EMPLOYEE_NOT_FOUND);

    return employee;
  }
}
