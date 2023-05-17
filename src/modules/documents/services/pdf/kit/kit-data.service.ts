import { ScheduleMedicalVisitRepository } from './../../../../company/repositories/implementations/ScheduleMedicalVisitRepository';
import { KitPdfDto } from './../../../dto/kit-dto';
import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { PdfAsoDataService } from '../aso/aso-data.service';
import { PdfProntuarioDataService } from '../prontuario/prontuario-data.service';
import { asyncBatch } from '../../../../../shared/utils/asyncBatch';
import sortArray from 'sort-array';

@Injectable()
export class PdfKitDataService {
  constructor(
    private readonly scheduleMedicalVisitRepository: ScheduleMedicalVisitRepository,
    private readonly pdfProntuarioDataService: PdfProntuarioDataService,
    private readonly pdfAsoDataService: PdfAsoDataService
  ) { }
  async execute(userPayloadDto: UserPayloadDto, options?: KitPdfDto) {
    const companyId = userPayloadDto.targetCompanyId;
    const kits = [];

    const getAso = async (employeeId: number, asoId?: number) => {
      const aso = await this.pdfAsoDataService.execute(employeeId, userPayloadDto, asoId);
      const examination = this.pdfProntuarioDataService.getExamination(aso.employee, companyId);
      const questions = this.pdfProntuarioDataService.getQuestions(aso.employee, companyId);

      kits.push({
        sort: aso.employee.name,
        aso,
        prontuario: {
          examination,
          questions,
        },
      })
    }

    if (options.scheduleMedicalVisitId) {
      const scheduleMedicalVisit = await this.scheduleMedicalVisitRepository.findFirstNude({
        where: { id: options.scheduleMedicalVisitId, companyId },
        select: {
          exams: {
            where: { exam: { isAttendance: true } },
            select: { id: true, employeeId: true }
          }
        }
      })

      await asyncBatch(scheduleMedicalVisit.exams, 20, async (exam) => {
        await getAso(exam.employeeId, exam.id)
      })
    } else {
      await getAso(options.employeeId, options?.asoId)
    }

    return sortArray(kits, { by: 'sort' })

  }
}
