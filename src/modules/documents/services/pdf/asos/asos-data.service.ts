import { FindAllAvailableEmployeesService } from '../../../../company/services/employee/find-all-available-employees/find-all-available-employees.service';
import { CompanyRepository } from '../../../../company/repositories/implementations/CompanyRepository';
import { ScheduleMedicalVisitRepository } from '../../../../company/repositories/implementations/ScheduleMedicalVisitRepository';
import { EmployeeRepository } from '../../../../company/repositories/implementations/EmployeeRepository';
import { ProtocolToRiskRepository } from '../../../../sst/repositories/implementations/ProtocolRiskRepository';
import { HierarchyEntity } from '../../../../company/entities/hierarchy.entity';
import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ExamHistoryTypeEnum } from '@prisma/client';

import { ErrorMessageEnum } from '../../../../../shared/constants/enum/errorMessage';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { IPriorRiskData, onGetRisks } from '../../../../../shared/utils/onGetRisks';
import { EmployeeEntity } from '../../../../company/entities/employee.entity';
import { EmployeeExamsHistoryRepository } from '../../../../company/repositories/implementations/EmployeeExamsHistoryRepository';
import { ExamEntity } from '../../../../sst/entities/exam.entity';
import { ExamRiskEntity } from '../../../../sst/entities/examRisk.entity';
import { ExamRiskDataEntity } from '../../../../sst/entities/examRiskData.entity';
import { FindExamByHierarchyService } from '../../../../sst/services/exam/find-by-hierarchy /find-exam-by-hierarchy.service';
import { FindAllRiskDataByEmployeeService } from '../../../../sst/services/risk-data/find-by-employee/find-by-employee.service';
import { IPdfAsoData } from './types/IAsoData.type';
import { checkRiskDataDoc } from '../../../../../shared/utils/getRiskDoc';
import { removeDuplicate } from '../../../../../shared/utils/removeDuplicate';

export const checkExamType = (exam: ExamRiskDataEntity | ExamRiskEntity, examType: ExamHistoryTypeEnum) => {
  const isAdmission = examType == ExamHistoryTypeEnum.ADMI;
  const isChange = examType == ExamHistoryTypeEnum.CHAN;
  const isDismissal = examType == ExamHistoryTypeEnum.DEMI;
  const isPeriodic = examType == ExamHistoryTypeEnum.PERI;
  const isReturn = examType == ExamHistoryTypeEnum.RETU;
  const isOfficeChange = examType == ExamHistoryTypeEnum.OFFI;

  if (isAdmission && !exam.isAdmission) return false;
  if (isChange && !exam.isChange) return false;
  if (isDismissal && !exam.isDismissal) return false;
  if (isPeriodic && !exam.isPeriodic) return false;
  if (isReturn && !exam.isReturn) return false;
  if (isOfficeChange && !exam.isPeriodic && !exam.isAdmission && !exam.isChange) return false;

  return true;
};

@Injectable()
export class PdfAsoDataService {
  constructor(
    private readonly employeeExamsHistoryRepository: EmployeeExamsHistoryRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly findAllAvailableEmployeesService: FindAllAvailableEmployeesService,
    private readonly employeeRepository: EmployeeRepository,
    private readonly scheduleMedicalVisitRepository: ScheduleMedicalVisitRepository,
    private readonly hierarchyRepository: HierarchyRepository,
    private readonly findAllRiskDataByEmployeeService: FindAllRiskDataByEmployeeService,
    private readonly findExamByHierarchyService: FindExamByHierarchyService,
    private readonly protocolToRiskRepository: ProtocolToRiskRepository,
  ) { }

  async execute(employeeId: number, userPayloadDto: UserPayloadDto, options?: { asoId?: number, scheduleMedicalVisitId?: number }) {
    const companyId = userPayloadDto.targetCompanyId;

    const asoId = options.asoId;
    const scheduleMedicalVisitId = options.scheduleMedicalVisitId;

    const asoExam = await this.employeeExamsHistoryRepository.findFirstNude({
      where: {
        ...(asoId && { id: asoId }),
        ...(scheduleMedicalVisitId && { scheduleMedicalVisitId: scheduleMedicalVisitId }),
        employeeId, exam: { isAttendance: true }, OR: [{ clinicId: companyId }, { employee: { companyId } }]
      },
      orderBy: { doneDate: 'desc' },
      select: {
        id: true,
        hierarchyId: true,
        doneDate: true,
        examType: true,
        employeeId: true,
        employee: { select: { companyId: true } },
        scheduleMedicalVisitId: true,
        clinic: {
          select: {
            id: true,
            contacts: { select: { phone: true, id: true, isPrincipal: true, email: true }, take: 1, orderBy: { isPrincipal: 'desc' } },
            fantasy: true,
            address: true,
            doctorResponsible: { include: { professional: { select: { name: true, id: true } } } },
          },
        },
      },
    });

    if (!asoExam?.id) throw new ForbiddenException(ErrorMessageEnum.FORBIDDEN_ACCESS);

    const employees = await this.findAllAvailableEmployeesService.execute({
      dateFrom: asoExam.doneDate,
      dateFromExams: asoExam.doneDate,
      companyId,
      getAllExams: true,
      getAllExamsWithSchedule: true,
      getHierarchyIdFromScheduledExam: true,
      noPagination: true,
      getExamName: true,
      getSocialName: true,
      scheduleMedicalVisitId,
    }, userPayloadDto);


    const company = await this.companyRepository.findFirstNude({
      where: { id: companyId },
      select: {
        name: true,
        initials: true,
        logoUrl: true,
        cnpj: true,
        address: true,
        doctorResponsible: { select: { councilId: true, councilType: true, councilUF: true, professional: { select: { name: true } } } },
        numAsos: true,
        group: {
          select: {
            numAsos: true,
            doctorResponsible: { select: { councilId: true, councilType: true, councilUF: true, professional: { select: { name: true } } } },
          },
        },
        contacts: { select: { phone: true, id: true, isPrincipal: true, email: true }, take: 1, orderBy: { isPrincipal: 'desc' } },
        receivingServiceContracts: {
          select: {
            applyingServiceCompany: {
              select: {
                initials: true,
                id: true,
                name: true,
                cnpj: true,
                logoUrl: true,
                fantasy: true,
                address: true,
                contacts: { select: { phone: true, id: true, isPrincipal: true, email: true }, take: 1, orderBy: { isPrincipal: 'desc' } },
              },
            },
          },
          where: {
            applyingServiceCompany: {
              isConsulting: true,
              isGroup: false,
              license: { status: 'ACTIVE' },
            },
          },
        },
      },
    });



    // const {
    //   risk: riskData,
    //   employee: employeeRisk,
    //   date: startHierarchyDate,
    //   hierarchyIds,
    // } = await this.findAllRiskDataByEmployeeService.getRiskData(employeeId, undefined, {
    //   fromExam: true,
    //   hierarchyData: true,
    //   filterDate: true,
    // });
    // const asoRiskData = checkRiskDataDoc(riskData, { docType: 'isAso', companyId: clinicExam.employee.companyId });
    // const asoRisk = onGetRisks(asoRiskData) || [];

    // const protocols = await this.protocolToRiskRepository.findByHierarchies(hierarchyIds, { date: startHierarchyDate });
    // const employee = { ...employeeRisk, ...clinicExam.employee };
    // const examsHistory = employee.examsHistory;
    // const consultantCompany = company?.receivingServiceContracts?.[0]?.applyingServiceCompany;
    // const actualCompany = company;
    // const sector = this.onGetSector(employee?.hierarchy);

    // delete actualCompany?.receivingServiceContracts;

    // const doctorResponsible = actualCompany.doctorResponsible;
    // const numAsos = actualCompany.numAsos;

    // const examsRepresentAll = await this.findExamByHierarchyService.onGetAllExams(employee.companyId);
    // const exams = this.onGetAllExamsData(employee, asoRisk, examsRepresentAll?.data, examType);
    // const doneExams = exams.map((examData) => {
    //   const history = examsHistory.find((examHistory) => examHistory.examId == examData.examId);
    //   return { exam: examData.exam, doneDate: history?.doneDate };
    // });

    // protocols.push(...asoRisk.map((r) => r.riskData.map((rd) => rd.protocolsToRisk)).flat(2));
    // return {
    //   doneExams,
    //   consultantCompany,
    //   actualCompany,
    //   doctorResponsible,
    //   numAsos,
    //   clinicExam,
    //   employee,
    //   risks: asoRisk.map((risk) => ({ riskData: risk.riskData[0], riskFactor: risk.riskFactor })),
    //   sector,
    //   protocols: removeDuplicate(
    //     protocols.filter((i) => i).map((p) => ({ ...p, name: p.protocol.name })),
    //     { removeById: 'name' },
    //   ),
    //   admissionDate,
    // };
  }

  onGetAllExamsData(employee: EmployeeEntity, asoRisk: IPriorRiskData[], examRepresentAll: ExamEntity[], examType: ExamHistoryTypeEnum) {
    const exams: (ExamRiskEntity | ExamRiskDataEntity)[] = [];

    asoRisk?.forEach((data) => {
      data?.riskData?.forEach((rd) => {
        rd.examsToRiskFactorData.forEach((e) => {
          exams.push(e);
        });
      });
      data?.riskFactor?.examToRisk.forEach((e) => {
        exams.push(e);
      });
    });

    examRepresentAll?.forEach((exam) => {
      exam?.examToRisk.forEach((e) => {
        delete exam.examToRisk;
        exams.push({ ...e, exam: exam });
      });
    });

    return exams.filter(
      (item, index, self) =>
        checkExamType(item, examType) && !this.findExamByHierarchyService.checkIfSkipEmployee(item, employee) && index === self.findIndex((t) => t.examId == item.examId),
    );
  }

  onGetSector(hierarchy: Partial<HierarchyEntity>) {
    return hierarchy?.parents?.find((parent) => parent.type == 'SECTOR');
    // this.hierarchyRepository.findFirstNude({where:{type:'SECTOR', children:{some:{}}}})
  }
}
