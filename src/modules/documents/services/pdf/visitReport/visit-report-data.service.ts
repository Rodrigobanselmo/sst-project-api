import { ScheduleMedicalVisitRepository } from '../../../../company/repositories/implementations/ScheduleMedicalVisitRepository';
import { KitPdfDto } from '../../../dto/kit-dto';
import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { PdfAsoDataService } from '../aso/aso-data.service';
import { PdfProntuarioDataService } from '../prontuario/prontuario-data.service';
import { asyncBatch } from '../../../../../shared/utils/asyncBatch';
import sortArray from 'sort-array';
import { VisitReportPdfDto } from '../../../../../modules/documents/dto/visit-report-dto';
import { ExamHistoryTypeEnum } from '@prisma/client';

@Injectable()
export class PdfVisitReportDataService {
  constructor(
    private readonly scheduleMedicalVisitRepository: ScheduleMedicalVisitRepository,
    private readonly pdfProntuarioDataService: PdfProntuarioDataService,
    private readonly pdfAsoDataService: PdfAsoDataService,
  ) {}
  async execute(userPayloadDto: UserPayloadDto, options?: VisitReportPdfDto) {
    const companyId = userPayloadDto.targetCompanyId;

    const scheduleMedicalVisit = await this.scheduleMedicalVisitRepository.findFirstNude({
      where: { id: options.scheduleMedicalVisitId, companyId },
      select: {
        doneClinicDate: true,
        company: {
          select: {
            name: true,
            initials: true,
            logoUrl: true,
            cnpj: true,
            address: true,
            contacts: {
              select: { phone: true, id: true, isPrincipal: true, email: true },
              take: 1,
              orderBy: { isPrincipal: 'desc' },
            },
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
        exams: {
          where: {
            exam: { isAttendance: true },
            status: { in: ['PROCESSING', 'DONE'] },
          },
          select: {
            exam: { select: { name: true } },
            id: true,
            examType: true,
            employee: {
              select: {
                id: true,
                name: true,
                cpf: true,
                birthday: true,
                socialName: true,
                rg: true,
              },
            },
          },
        },
      },
    });

    const actualCompany = scheduleMedicalVisit?.company;
    const consultantCompany = scheduleMedicalVisit?.company?.receivingServiceContracts?.[0]?.applyingServiceCompany;
    const empoyees = scheduleMedicalVisit?.exams?.map((exam) => exam.employee);
    const doneDate = scheduleMedicalVisit.doneClinicDate;

    const sumExamsTypes = scheduleMedicalVisit?.exams.reduce(
      (acc, exam) => {
        acc[exam.examType] = acc[exam.examType] ? acc[exam.examType] + 1 : 1;

        return acc;
      },
      {} as Record<ExamHistoryTypeEnum, number>,
    );

    delete actualCompany?.receivingServiceContracts;

    return {
      actualCompany,
      consultantCompany,
      empoyees: sortArray(empoyees, { by: 'name' }),
      doneDate,
      sumExamsTypes,
      totalSumExamsTypes: Object.values(sumExamsTypes).reduce((acc, curr) => acc + curr, 0),
    };
  }
}
