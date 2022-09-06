import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { CreateExamsRiskDto } from './../../../dto/exam-risk.dto';
import { ExamRiskRepository } from './../../../repositories/implementations/ExamRiskRepository';

@Injectable()
export class CreateExamRiskService {
  constructor(private readonly examRiskRepository: ExamRiskRepository) {}

  async execute(createExamDto: CreateExamsRiskDto, user: UserPayloadDto) {
    const ExamFactor = await this.examRiskRepository.create({
      ...createExamDto,
      companyId: user.targetCompanyId,
    });

    return ExamFactor;
  }
}