import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CopyExamsRiskDto } from '../../../dto/exam-risk.dto';
import { ExamRiskRepository } from '../../../repositories/implementations/ExamRiskRepository';
import { CheckEmployeeExamService } from '../../exam/check-employee-exam/check-employee-exam.service';

@Injectable()
export class CopyExamRiskService {
  constructor(private readonly examRiskRepository: ExamRiskRepository, private readonly checkEmployeeExamService: CheckEmployeeExamService) {}

  async execute(copyExamsRiskDto: CopyExamsRiskDto, user: UserPayloadDto) {
    const FromExamFactor = await this.examRiskRepository.findNude({
      where: { companyId: copyExamsRiskDto.fromCompanyId, endDate: null },
    });

    const ActualExamFactor = await this.examRiskRepository.findNude({
      where: { companyId: user.targetCompanyId, endDate: null },
      select: { riskId: true, examId: true },
    });

    const copyData = FromExamFactor.map((exam) => {
      const found = ActualExamFactor.find((aExam) => aExam.examId === exam.examId && aExam.riskId === exam.riskId);

      if (found) return null;

      return exam;
    }).filter((i) => i);

    const ExamFactor = await this.examRiskRepository.createMany({
      data: copyData,
      companyId: user.targetCompanyId,
    });

    copyData.map((data) => {
      this.checkEmployeeExamService.execute({
        companyId: user.targetCompanyId,
        riskId: data.riskId,
      });
    });

    return ExamFactor;
  }
}
