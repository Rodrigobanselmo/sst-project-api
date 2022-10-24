import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';
import { FindExamDto } from '../../../dto/exam.dto';

import { ExamRepository } from '../../../repositories/implementations/ExamRepository';

@Injectable()
export class FindExamService {
  constructor(private readonly examRepository: ExamRepository) {}

  async execute({ skip, take, ...query }: FindExamDto, user: UserPayloadDto) {
    const Exam = await this.examRepository.find(
      { companyId: user.targetCompanyId, ...query },
      { skip, take },
    );

    return Exam;
  }
}
