import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorMessageEnum } from '../../../../../shared/constants/enum/errorMessage';

import { UpsertExamToClinicDto } from '../../../dto/exam-to-clinic.dto';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { ExamToClinicRepository } from '../../../repositories/implementations/ExamToClinicRepository';

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
          groupId: createExamDto.groupId || 'not-found',
        },
        orderBy: { startDate: 'desc' },
        take: 2,
      });

    if (!clinicExamActual) {
      const foundEqual = await this.examToClinicRepository.findNude({
        where: {
          examId: createExamDto.examId,
          companyId: user.targetCompanyId,
          isAdmission: createExamDto.isAdmission,
          isReturn: createExamDto.isReturn,
          isChange: createExamDto.isChange,
          isDismissal: createExamDto.isDismissal,
          isPeriodic: createExamDto.isPeriodic,
        },
        take: 1,
      });

      if (foundEqual.length > 0)
        throw new BadRequestException(
          ErrorMessageEnum.CLINIC_EXAM_ALREADY_EXIST,
        );
    }

    // if company already have an exam in the same date or future date, update it
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

    // if exam is before last startDate, will create and end the created exam
    const newExam = await this.examToClinicRepository.upsert({
      ...createExamDto,
      companyId: user.targetCompanyId,
      endDate:
        clinicExamActual?.startDate > createExamDto.startDate
          ? clinicExamActual?.startDate
          : undefined,
    });

    // if actual exam is before the new created exam, will end the actual and the created one becomes the last one
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
