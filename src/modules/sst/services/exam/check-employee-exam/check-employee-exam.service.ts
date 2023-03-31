import { standardDate } from './../../../../company/services/report/update-all-companies/update-all-companies.service';
import { Injectable } from '@nestjs/common';

import { asyncBatch } from '../../../../../shared/utils/asyncBatch';
import { EmployeeRepository } from '../../../../company/repositories/implementations/EmployeeRepository';
import { CheckEmployeeExamDto } from '../../../dto/exam.dto';
import { FindExamByHierarchyService } from '../find-by-hierarchy /find-exam-by-hierarchy.service';
import { ReloadEmployeeExamTimeService } from '../reload-employee-exam-time/reload-employee-exam-time.service';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { riskAllId } from '../../../../../shared/constants/ids';

@Injectable()
export class CheckEmployeeExamService {
  constructor(
    private readonly findExamByHierarchyService: FindExamByHierarchyService,
    private readonly employeeRepository: EmployeeRepository,
    private readonly reloadEmployeeExamTimeService: ReloadEmployeeExamTimeService,
    private readonly dayjs: DayJSProvider,
  ) {}

  async execute(body: CheckEmployeeExamDto) {
    const homogeneousGroupId = body.homogeneousGroupId;
    const hierarchyId = body.hierarchyId;
    const employeeId = body.employeeId;
    const companyId = body.companyId;
    const riskId = riskAllId == body.riskId ? undefined : body.riskId;

    const employeesWithExpiredDatePromise = this.employeeRepository.findNude({
      where: {
        expiredDateExam: { gte: new Date() },
        examsHistory: { some: { examId: { gt: 0 } } },
        ...(hierarchyId && { hierarchyId }),
        ...(employeeId && { id: employeeId }),
        ...(homogeneousGroupId && { hierarchy: { hierarchyOnHomogeneous: { some: { homogeneousGroupId: homogeneousGroupId } } } }),
        ...(companyId && { companyId }),
        ...(companyId &&
          riskId && { companyId, hierarchy: { hierarchyOnHomogeneous: { some: { homogeneousGroup: { riskFactorData: { some: { riskId: riskId } } } } } } }),
      },
      select: { id: true, companyId: true, hierarchyId: true, newExamAdded: true },
    });

    const employeesWithoutExpiredDatePromise = this.employeeRepository.findNude({
      where: {
        OR: [
          {
            expiredDateExam: null,
          },
          {
            expiredDateExam: this.dayjs.dayjs(standardDate).toDate(),
          },
        ],
        ...(hierarchyId && { hierarchyId }),
        ...(employeeId && { id: employeeId }),
        ...(homogeneousGroupId && { hierarchy: { hierarchyOnHomogeneous: { some: { homogeneousGroupId: homogeneousGroupId } } } }),
        ...(companyId && { companyId }),
        ...(companyId &&
          riskId && { companyId, hierarchy: { hierarchyOnHomogeneous: { some: { homogeneousGroup: { riskFactorData: { some: { riskId: riskId } } } } } } }),
      },
      select: { id: true, companyId: true, hierarchyId: true, newExamAdded: true },
    });

    const [employeesWithExpiredDate, employeesWithoutExpiredDate] = await Promise.all([employeesWithExpiredDatePromise, employeesWithoutExpiredDatePromise]);

    const companiesWithExpiredDateIds = employeesWithExpiredDate.map((employee) => employee.companyId);
    const companiesWithoutExpiredDateIds = employeesWithoutExpiredDate.map((employee) => employee.companyId);

    await this.reloadExamExpired(
      [...new Set(companiesWithoutExpiredDateIds)],
      employeesWithoutExpiredDate.map((employee) => employee.id),
    );

    await asyncBatch(employeesWithExpiredDate, 10, async (employee) => {
      const exams = await this.findExamByHierarchyService.execute(
        { targetCompanyId: employee.companyId },
        { employeeId: employee.id, hierarchyId: employee.hierarchyId },
      );

      const expiredComplementaryExam = exams.data.find((examData) => {
        if (examData.exam.isAttendance) return;

        const origin = examData.origins?.find((origin) => {
          if (origin?.skipEmployee) return false;

          if (origin?.isPeriodic) return true;
          return false;
        });

        const isExpired = !origin?.expiredDate || (origin?.expiredDate && origin?.expiredDate <= new Date());

        return isExpired;
      });

      if (!!expiredComplementaryExam || employee.newExamAdded) {
        await this.employeeRepository.updateNude({
          where: {
            id_companyId: {
              id: employee.id,
              companyId: employee.companyId,
            },
          },
          data: {
            ...(employee.newExamAdded && { newExamAdded: null }),
            ...(!!expiredComplementaryExam && { newExamAdded: new Date() }),
          },
          select: { id: true },
        });
      }
    });

    await this.reloadExamExpired(
      [...new Set(companiesWithExpiredDateIds)],
      employeesWithExpiredDate.map((employee) => employee.id),
    );
  }

  async reloadExamExpired(companiesIdsWithoutDuplicates: string[], employeeIds: number[]) {
    await asyncBatch(companiesIdsWithoutDuplicates, 1, async (companyId) => {
      await this.reloadEmployeeExamTimeService.reloadEmployeeExamTime(companyId, {
        employeeIds,
      });
    });
  }
}
