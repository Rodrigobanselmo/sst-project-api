import { ExamEntity } from '../../../entities/exam.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ExamRepository } from '../../../repositories/implementations/ExamRepository';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { isMaster } from '../../../../../shared/utils/isMater';

@Injectable()
export class DeleteSoftExamService {
  constructor(private readonly examRepository: ExamRepository) {}

  async execute(id: number, userPayloadDto: UserPayloadDto) {
    const user = isMaster(userPayloadDto);
    const companyId = user.companyId;

    let exam: ExamEntity;
    if (user.isMaster) {
      exam = await this.examRepository.DeleteByIdSoft(id);
    } else {
      exam = await this.examRepository.DeleteByCompanyAndIdSoft(id, companyId);
    }

    if (!exam.id) throw new NotFoundException('data not found');

    return exam;
  }
}
