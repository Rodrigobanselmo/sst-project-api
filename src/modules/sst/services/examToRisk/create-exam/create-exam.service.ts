import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CreateExamsRiskDto } from '../../../dto/exam-risk.dto';
import { ExamRiskRepository } from '../../../repositories/implementations/ExamRiskRepository';
import { CheckEmployeeExamService } from '../../exam/check-employee-exam/check-employee-exam.service';

@Injectable()
export class CreateExamRiskService {
  constructor(
    private readonly examRiskRepository: ExamRiskRepository,
    private readonly checkEmployeeExamService: CheckEmployeeExamService,
  ) {}

  async execute(createExamDto: CreateExamsRiskDto, user: UserPayloadDto) {
    const ExamFactor = await this.examRiskRepository.create({
      ...createExamDto,
      companyId: user.targetCompanyId,
    });

    this.checkEmployeeExamService.execute({
      companyId: user.targetCompanyId,
      riskId: ExamFactor.riskId,
    });

    return ExamFactor;
  }
}
