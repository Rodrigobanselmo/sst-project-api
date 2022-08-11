import { Injectable } from '@nestjs/common';

import { UpsertExamToClinicDto } from '../../../../../modules/checklist/dto/exam-to-clinic.dto';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { ExamToClinicRepository } from './../../../repositories/implementations/ExamToClinicRepository';

@Injectable()
export class UpsertExamToClinicService {
  constructor(
    private readonly examToClinicRepository: ExamToClinicRepository,
    private readonly dayjs: DayJSProvider,
  ) {}

  async execute(createExamDto: UpsertExamToClinicDto, user: UserPayloadDto) {
    const [clinicExamActual, clinicExamOld] =
      await this.examToClinicRepository.findNude({
        where: {
          examId: createExamDto.examId,
          companyId: user.targetCompanyId,
        },
        orderBy: { startDate: 'desc' },
        take: 2,
      });

    if (
      clinicExamActual &&
      clinicExamActual.startDate >= this.dayjs.dateNow() &&
      createExamDto.startDate >= this.dayjs.dateNow()
    ) {
      const newExam = await this.examToClinicRepository.update({
        ...createExamDto,
        companyId: user.targetCompanyId,
        id: clinicExamActual.id,
      });

      if (clinicExamOld)
        await this.examToClinicRepository.update({
          examId: createExamDto.examId,
          companyId: user.targetCompanyId,
          id: clinicExamOld.id,
          startDate: clinicExamOld.startDate,
          endDate: createExamDto.startDate,
        });

      return newExam;
    }

    const newExam = await this.examToClinicRepository.upsert({
      ...createExamDto,
      companyId: user.targetCompanyId,
      endDate:
        clinicExamActual?.startDate > createExamDto.startDate
          ? clinicExamActual?.startDate
          : undefined,
    });

    if (clinicExamActual?.startDate < createExamDto?.startDate)
      await this.examToClinicRepository.update({
        examId: createExamDto.examId,
        companyId: user.targetCompanyId,
        id: clinicExamActual.id,
        startDate: clinicExamActual.startDate,
        endDate: createExamDto.startDate,
      });

    return newExam;
  }
}
