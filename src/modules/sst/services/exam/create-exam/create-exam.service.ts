import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';

import { CreateExamDto } from '../../../dto/exam.dto';
import { ExamRepository } from '../../../repositories/implementations/ExamRepository';

@Injectable()
export class CreateExamService {
  constructor(private readonly examRepository: ExamRepository) {}

  async execute(createExamDto: CreateExamDto, user: UserPayloadDto) {
    const system = user.isSystem && user.companyId === createExamDto.companyId;
    const ExamFactor = await this.examRepository.create({
      ...createExamDto,
      system,
      companyId: user.targetCompanyId,
    });

    return ExamFactor;
  }
}
