import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';

import { UpdateExamDto } from '../../../dto/exam.dto';
import { ExamRepository } from '../../../repositories/implementations/ExamRepository';

@Injectable()
export class UpdateExamService {
  constructor(private readonly examRepository: ExamRepository) {}

  async execute(
    id: number,
    updateExamDto: UpdateExamDto,
    user: UserPayloadDto,
  ) {
    const exam = await this.examRepository.update({
      id,
      companyId: user.targetCompanyId,
      ...updateExamDto,
    });

    return exam;
  }
}
