import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { FindExamRiskDto } from './../../../dto/exam-risk.dto';
import { ExamRiskRepository } from './../../../repositories/implementations/ExamRiskRepository';

@Injectable()
export class FindExamRiskService {
  constructor(private readonly examRiskRepository: ExamRiskRepository) {}

  async execute(
    { skip, take, ...query }: FindExamRiskDto,
    user: UserPayloadDto,
  ) {
    const Exam = await this.examRiskRepository.find(
      { companyId: user.targetCompanyId, ...query },
      { skip, take },
      {
        include: {
          exam: { select: { name: true, id: true, isAttendance: true } },
          risk: { select: { name: true, id: true, type: true } },
        },
      },
    );

    return Exam;
  }
}
