import { CopyExamsToClinicDto } from '../../../dto/exam-to-clinic.dto';
import { ExamToClinicRepository } from '../../../repositories/implementations/ExamToClinicRepository';
import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';

@Injectable()
export class CopyExamToClinicService {
  constructor(private readonly examRepository: ExamToClinicRepository) {}

  async execute(copyExamsDto: CopyExamsToClinicDto, user: UserPayloadDto) {
    const FromExamFactor = await this.examRepository.findNude({
      where: { companyId: copyExamsDto.fromCompanyId, endDate: null },
    });

    const ActualExamFactor = await this.examRepository.findNude({
      where: { companyId: user.targetCompanyId, endDate: null },
    });

    const copyData = FromExamFactor.map((exam) => {
      const found = ActualExamFactor.find((aExam) => aExam.examId === exam.examId);

      if (found) return null;

      return exam;
    }).filter((i) => i);

    const ExamFactor = await this.examRepository.createMany({
      data: copyData,
      companyId: user.targetCompanyId,
    });

    return ExamFactor;
  }
}
