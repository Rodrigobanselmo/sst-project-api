import { CheckEmployeeExamService } from './../../../../sst/services/exam/check-employee-exam/check-employee-exam.service';
import { Injectable } from '@nestjs/common';
import { UpdateEmployeeDto } from '../../../../../modules/company/dto/employee.dto';
import { EmployeeRepository } from '../../../../../modules/company/repositories/implementations/EmployeeRepository';

@Injectable()
export class UpdateEmployeeService {
  constructor(
    private readonly checkEmployeeExamService: CheckEmployeeExamService,
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(updateEmployeeDto: UpdateEmployeeDto) {
    // let removeSubOffices = false;
    const employeeFound = await this.employeeRepository.findById(updateEmployeeDto.id, updateEmployeeDto.companyId);

    // if (updateEmployeeDto.hierarchyId) {
    //   if (employeeFound.hierarchyId !== updateEmployeeDto.hierarchyId) {
    //     removeSubOffices = true;
    //   }
    // }

    const employee = await this.employeeRepository.update(
      {
        ...updateEmployeeDto,
      },
      // removeSubOffices,
    );

    if (updateEmployeeDto.lastExam != employeeFound.lastExam) {
      this.checkEmployeeExamService.execute({
        employeeId: updateEmployeeDto.id,
      });
    }

    return employee;
  }
}
