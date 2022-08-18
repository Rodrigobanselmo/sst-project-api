import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { UpdateExamRiskDto } from './../../../dto/exam-risk.dto';
import { ExamRiskRepository } from './../../../repositories/implementations/ExamRiskRepository';

@Injectable()
export class UpdateExamRiskService {
  constructor(private readonly examRiskRepository: ExamRiskRepository) {}

  async execute(
    id: number,
    updateExamDto: UpdateExamRiskDto,
    user: UserPayloadDto,
  ) {
    const exam = await this.examRiskRepository.update({
      id,
      companyId: user.targetCompanyId,
      ...updateExamDto,
    });

    return exam;
  }
}
