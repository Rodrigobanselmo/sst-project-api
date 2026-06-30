import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { Injectable } from '@nestjs/common';
import { FindExamDto } from '../../../dto/exam.dto';

import { ExamRepository } from '../../../repositories/implementations/ExamRepository';

@Injectable()
export class FindExamService {
  constructor(private readonly examRepository: ExamRepository) {}

  async execute({ skip, take, ...query }: FindExamDto, user: UserPayloadDto) {
    const result = await this.examRepository.find(
      { companyId: user.targetCompanyId, ...query },
      { skip, take },
      {},
      { withOrigin: true },
    );

    return {
      count: result.count,
      data: result.data.map((exam) => ({
        ...exam,
        origin: exam.origin,
        originSources: exam.originSources,
      })),
      ...('agentFilter' in result && result.agentFilter
        ? { agentFilter: result.agentFilter }
        : {}),
    };
  }
}
