import { HierarchyEntity } from './../../../entities/hierarchy.entity';
import { getEmployeeRowExpiredDate, getEmployeeRowStatus } from './../../../../../shared/utils/getExpiredExamStatus.utils';
import { ExamEntity } from './../../../../sst/entities/exam.entity';
import { HierarchyRepository } from './../../../repositories/implementations/HierarchyRepository';
import { EmployeeEntity } from './../../../entities/employee.entity';
import { Injectable } from '@nestjs/common';
import { FindEmployeeDto } from '../../../../../modules/company/dto/employee.dto';
import { EmployeeRepository } from '../../../../../modules/company/repositories/implementations/EmployeeRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { FindExamByHierarchyService } from './../../../../sst/services/exam/find-by-hierarchy /find-exam-by-hierarchy.service';
import { CheckEmployeeExamService } from './../../../../sst/services/exam/check-employee-exam/check-employee-exam.service';
import { getHierarchyParents, getHierarchyParentsFromMap } from '../../../../../shared/utils/getParents';
import { StatusEnum } from '@prisma/client';

@Injectable()
export class FindAllAvailableEmployeesService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly findExamByHierarchyService: FindExamByHierarchyService,
    private readonly checkEmployeeExamService: CheckEmployeeExamService,
    private readonly hierarchyRepository: HierarchyRepository,
  ) { }

  async execute({ skip, take, ...query }: FindEmployeeDto, user: UserPayloadDto) {
    const employeesData = await this.employeeRepository.find({ ...query, companyId: user.targetCompanyId }, { skip, take });

    if (employeesData.data?.length && query?.getAllExams) {
      const allEmployees: EmployeeEntity[] = [];
      const allExams: ExamEntity[] = [];

      const groupedByCompany = employeesData.data.reduce((acc, employee) => {
        if (acc[employee.companyId]) {
          acc[employee.companyId].push(employee);
        } else {
          acc[employee.companyId] = [employee];
        }
        return acc;
      }, {} as Record<number, EmployeeEntity[]>);

      const uniqueCompanyIds = Object.keys(groupedByCompany);

      await Promise.all(
        uniqueCompanyIds.map(async (companyId) => {
          const { employees, exams } = await this.getAllExams(groupedByCompany[companyId], query, companyId);

          allEmployees.push(...employees);
          allExams.push(...exams);
        }),
      );
      employeesData.data = allEmployees;
      employeesData.exams = allExams;
    }

    return employeesData;
  }

  async getAllExams(employees: EmployeeEntity[], query: FindEmployeeDto, companyId: string) {
    const allExamsMap: Record<number, ExamEntity> = {};
    const exams = await this.findExamByHierarchyService.execute({ targetCompanyId: companyId }, { getAllExamToRiskWithoutHierarchy: true });
    const hierarchies = await this.hierarchyRepository.findNude({
      where: {
        companyId: companyId,
        ...(query.workspacesIds && {
          workspaces: {
            some: {
              id: { in: query.workspacesIds },
            },
          },
        }),
      },
      select: { id: true, parentId: true },
    });

    const hierarchyMap = hierarchies.reduce((acc, hierarchy) => {
      acc[hierarchy.id] = hierarchy;
      return acc;
    }, {} as Record<number, HierarchyEntity>);


    employees.map((employee) => {
      const examsHistoryOnlyDone = employee.examsHistory?.filter((historyExam) => historyExam.status === 'DONE');

      const hierarchyIdToCheckExams = query.getHierarchyIdFromScheduledExam ? (employee.scheduleExam?.subOfficeId || employee.scheduleExam?.hierarchyId) : null

      const { isDismissal } = this.checkEmployeeExamService.getIsDismissal({ ...employee, examsHistory: examsHistoryOnlyDone });
      const { parents, actualHierarchy } = getHierarchyParentsFromMap(hierarchyMap, hierarchyIdToCheckExams || employee.hierarchyId);

      if (!employee.hierarchy) {
        if (!query.getHierarchyIdFromScheduledExam) employee.hierarchy = actualHierarchy;
        if (query.getHierarchyIdFromScheduledExam) employee.hierarchy = hierarchyMap[employee.hierarchyId || employee.scheduleExam?.hierarchyId];
      }

      if (actualHierarchy) employee.hierarchy.parents = parents;

      const { originsExams, employeeExamType } = this.checkEmployeeExamService.checkExpiredExam({ ...employee, examsHistory: examsHistoryOnlyDone }, exams.data, {
        isDismissal,
      });

      employee.infoExams = {};
      employee.examType = employeeExamType;

      originsExams.forEach((originExam) => {
        const examsHistory = employee.examsHistory?.filter((hExam) => hExam.examId === originExam.examId);
        const examHistoryData = examsHistory?.[0];

        const status = getEmployeeRowStatus(examHistoryData, originExam?.expiredDate);

        const isScheduled = examHistoryData?.status == StatusEnum.PROCESSING;

        const validityDateString = getEmployeeRowExpiredDate(isScheduled ? examHistoryData.doneDate : originExam?.expiredDate);

        if (originExam.exam && !allExamsMap[originExam.examId]) allExamsMap[originExam.examId] = originExam.exam;
        employee.infoExams[originExam.examId] = {
          expiredDate: originExam.expiredDate,
          closeToExpired: originExam.closeToExpired,
          examId: originExam.examId,
          isAttendance: originExam.exam.isAttendance,
          validity: employee.isComorbidity ? originExam.lowValidityInMonths : originExam.validityInMonths,
          isScheduled,
          validityDateString,
          status,
        };
      });
    });

    return { employees, exams: Object.values(allExamsMap) };
  }
}
