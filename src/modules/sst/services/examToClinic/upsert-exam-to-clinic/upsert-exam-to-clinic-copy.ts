import { ExamToClinicRepository } from '../../../repositories/implementations/ExamToClinicRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { BadRequestException, Injectable } from '@nestjs/common';

import { UpsertExamToClinicDto } from '../../../dto/exam-to-clinic.dto';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';

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

    // // prevent when future date is set
    // if (clinicExamOld && clinicExamOld.startDate >= createExamDto.startDate)
    //   throw new BadRequestException(
    //     'A data de início deve ser maior que a data de início anterior',
    //   );

    if (
      clinicExamActual &&
      clinicExamActual.startDate >= this.dayjs.dateNow()
    ) {
      const newExam = await this.examToClinicRepository.update({
        ...createExamDto,
        companyId: user.targetCompanyId,
        id: clinicExamActual.id,
      });

      await this.examToClinicRepository.update({
        examId: createExamDto.examId,
        companyId: user.targetCompanyId,
        id: clinicExamOld.id,
        startDate: clinicExamOld.startDate,
        endDate: createExamDto.startDate,
      });

      return newExam;
    }

    // prevent when present date is set
    if (
      clinicExamActual &&
      clinicExamActual.startDate > createExamDto.startDate
    )
      throw new BadRequestException(
        'A data de início deve ser maior que a data de início anterior',
      );

    if (clinicExamActual)
      await this.examToClinicRepository.update({
        examId: createExamDto.examId,
        companyId: user.targetCompanyId,
        id: clinicExamActual.id,
        startDate: clinicExamActual.startDate,
        endDate: createExamDto.startDate,
      });

    const ExamFactor = await this.examToClinicRepository.create({
      ...createExamDto,
      companyId: user.targetCompanyId,
    });

    return ExamFactor;
  }
}
