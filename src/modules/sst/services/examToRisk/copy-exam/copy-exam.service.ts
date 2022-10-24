import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CopyExamsRiskDto } from '../../../dto/exam-risk.dto';
import { ExamRiskRepository } from '../../../repositories/implementations/ExamRiskRepository';

@Injectable()
export class CopyExamRiskService {
  constructor(private readonly examRiskRepository: ExamRiskRepository) {}

  async execute(copyExamsRiskDto: CopyExamsRiskDto, user: UserPayloadDto) {
    const FromExamFactor = await this.examRiskRepository.findNude({
      where: { companyId: copyExamsRiskDto.fromCompanyId, endDate: null },
    });

    const ActualExamFactor = await this.examRiskRepository.findNude({
      where: { companyId: user.targetCompanyId, endDate: null },
      select: { riskId: true, examId: true },
    });

    const copyData = FromExamFactor.map((exam) => {
      const found = ActualExamFactor.find(
        (aExam) => aExam.examId === exam.examId && aExam.riskId === exam.riskId,
      );

      if (found) return null;

      return exam;
    }).filter((i) => i);

    const ExamFactor = await this.examRiskRepository.createMany({
      data: copyData,
      companyId: user.targetCompanyId,
    });

    return ExamFactor;
  }
}
