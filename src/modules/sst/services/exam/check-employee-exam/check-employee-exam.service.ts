import { Injectable } from '@nestjs/common';

import { asyncBatch } from '../../../../../shared/utils/asyncBatch';
import { EmployeeRepository } from '../../../../company/repositories/implementations/EmployeeRepository';
import { CheckEmployeeExamDto } from '../../../dto/exam.dto';
import { FindExamByHierarchyService } from '../find-by-hierarchy /find-exam-by-hierarchy.service';

@Injectable()
export class CheckEmployeeExamService {
  constructor(private readonly findExamByHierarchyService: FindExamByHierarchyService, private readonly employeeRepository: EmployeeRepository) {}

  async execute(body: CheckEmployeeExamDto) {
    const homogeneousGroupId = body.homogeneousGroupId;
    const hierarchyId = body.hierarchyId;
    const employeeId = body.employeeId;
    const companyId = body.companyId;
    const riskId = body.riskId;

    const employees = await this.employeeRepository.findNude({
      where: {
        expiredDateExam: { gte: new Date() },
        examsHistory: { some: { examId: { gt: 0 } } },
        ...(hierarchyId && { hierarchyId }),
        ...(employeeId && { id: employeeId }),
        ...(homogeneousGroupId && { hierarchy: { hierarchyOnHomogeneous: { some: { homogeneousGroupId: homogeneousGroupId } } } }),
        ...(companyId &&
          riskId && { companyId, hierarchy: { hierarchyOnHomogeneous: { some: { homogeneousGroup: { riskFactorData: { some: { riskId: riskId } } } } } } }),
      },
      select: { id: true, companyId: true, hierarchyId: true, newExamAdded: true },
    });

    await asyncBatch(employees, 10, async (employee) => {
      const exams = await this.findExamByHierarchyService.execute(
        { targetCompanyId: employee.companyId },
        { employeeId: employee.id, hierarchyId: employee.hierarchyId },
      );

      const expiredExam = exams.data.find((examData) => {
        if (examData.exam.isAttendance) return;

        const origin = examData.origins?.find((origin) => {
          if (origin?.skipEmployee) return false;

          if (origin?.isPeriodic) return true;
          return false;
        });

        const isExpired = !origin?.expiredDate || (origin?.expiredDate && origin?.expiredDate <= new Date());

        return isExpired;
      });

      if (!!expiredExam || employee.newExamAdded) {
        await this.employeeRepository.updateNude({
          where: {
            id_companyId: {
              id: employee.id,
              companyId: employee.companyId,
            },
          },
          data: {
            ...(employee.newExamAdded && { newExamAdded: null }),
            ...(!!expiredExam && { newExamAdded: new Date() }),
          },
          select: { id: true },
        });
      }
    });
  }
}
