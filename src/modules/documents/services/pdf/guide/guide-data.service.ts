import { ErrorMessageEnum } from './../../../../../shared/constants/enum/errorMessage';
import { HierarchyRepository } from './../../../../company/repositories/implementations/HierarchyRepository';
import { BadRequestException, Injectable, ForbiddenException } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { removeDuplicate } from '../../../../../shared/utils/removeDuplicate';
import { CompanyRepository } from '../../../../company/repositories/implementations/CompanyRepository';
import { EmployeeExamsHistoryRepository } from '../../../../company/repositories/implementations/EmployeeExamsHistoryRepository';
import { EmployeeRepository } from '../../../../company/repositories/implementations/EmployeeRepository';
import { IClinicComplementaryExamData, IClinicExamData, IPdfGuideData } from './types/IGuideData.type';
import { sortData } from '../../../../../shared/utils/sorts/data.sort';
import { v4 } from 'uuid';

@Injectable()
export class PdfGuideDataService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly hierarchyRepository: HierarchyRepository,
  ) {}
  async execute(employeeId: number, userPayloadDto: UserPayloadDto): Promise<IPdfGuideData> {
    const companyId = userPayloadDto.targetCompanyId;

    const data = await this.employeeRepository.findFirstNude({
      where: { id: employeeId, OR: [{ examsHistory: { some: { clinicId: companyId } } }, { companyId: companyId }] },
      select: {
        cpf: true,
        name: true,
        email: true,
        rg: true,
        companyId: true,
        hierarchy: { select: { name: true } },
        socialName: true,
        company: {
          select: {
            id: true,
            initials: true,
            name: true,
            cnpj: true,
            fantasy: true,
            logoUrl: true,
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
                    contacts: {
                      select: { phone: true, id: true, isPrincipal: true, email: true },
                      take: 1,
                      orderBy: { isPrincipal: 'desc' },
                    },
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
        },
        examsHistory: {
          where: { status: 'PROCESSING' },
          select: {
            clinicId: true,
            examId: true,
            doneDate: true,
            time: true,
            hierarchyId: true,
            examType: true,
            exam: {
              select: {
                id: true,
                name: true,
                instruction: true,
                isAttendance: true,
              },
            },
          },
        },
      },
    });

    if (!data) throw new ForbiddenException(ErrorMessageEnum.FORBIDDEN_ACCESS);

    const clinicIds = data.examsHistory.map((data) => data.clinicId);
    const examIds = data.examsHistory.map((data) => data.examId);
    const clinics = await this.companyRepository.findNude({
      select: {
        address: true,
        id: true,
        obs: true,
        name: true,
        fantasy: true,
        contacts: {
          where: { isPrincipal: true },
          select: { email: true, phone: true, phone_1: true },
        },
        clinicExams: {
          select: { isScheduled: true, examId: true, scheduleRange: true },
          where: { examId: { in: examIds } },
        },
      },
      where: { id: { in: clinicIds } },
    });

    const consultantCompany = data?.company?.receivingServiceContracts?.[0]?.applyingServiceCompany;
    const actualCompany = data?.company;
    delete actualCompany?.receivingServiceContracts;

    const examInstructions = removeDuplicate(
      data?.examsHistory.map((examHistory) => examHistory.exam),
      { removeById: 'id' },
    );

    const clinicExamBlock: IClinicExamData = {} as any;
    const clinicComplementaryExamBlocks: IClinicComplementaryExamData = {};
    let hierarchyId = '';

    data?.examsHistory.forEach((examHistory) => {
      const key = `${examHistory.clinicId}${examHistory.doneDate}${examHistory.time}`;
      if (examHistory.hierarchyId) hierarchyId = examHistory.hierarchyId;

      if (examHistory.exam.isAttendance) {
        const clinic = clinics.find((c) => c.id === examHistory.clinicId);
        const exam = clinic.clinicExams.find((c) => c.examId === examHistory.exam.id);
        clinicExamBlock.clinic = clinic;
        clinicExamBlock.doneDate = examHistory.doneDate;
        clinicExamBlock.exam = examHistory.exam;
        clinicExamBlock.time = examHistory.time;
        clinicExamBlock.type = examHistory.examType;
        clinicExamBlock.id = key;

        if (exam) {
          clinicExamBlock.isScheduled = exam?.isScheduled;
          clinicExamBlock.scheduleRange = exam?.scheduleRange;
        }

        return;
      }

      const clinic = clinics.find((c) => c.id === examHistory.clinicId);
      const exam = clinic.clinicExams.find((c) => c.examId === examHistory.exam.id);

      if (!clinicComplementaryExamBlocks[key])
        clinicComplementaryExamBlocks[key] = {
          clinic,
          doneDate: examHistory.doneDate,
          exams: [],
          time: examHistory.time,
          isScheduled: exam.isScheduled,
          scheduleRange: exam.scheduleRange,
        };

      clinicComplementaryExamBlocks[key].exams.push(examHistory.exam);
    });

    delete data.examsHistory;

    if (hierarchyId) {
      const hierarchy = await this.hierarchyRepository.findById(hierarchyId, data.companyId);

      data.hierarchy = hierarchy;
    }

    return {
      ...data,
      clinics,
      exams: examInstructions,
      consultantCompany: consultantCompany?.id ? consultantCompany : actualCompany,
      company: actualCompany,
      clinicComplementaryExams: Object.values(clinicComplementaryExamBlocks).sort((a, b) =>
        sortData(a.doneDate, b.doneDate),
      ),
      clinicExam: clinicExamBlock,
      user: { email: userPayloadDto.email, id: v4() },
    };
  }
}
