import { Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { FindExamToClinicDto } from './../../../dto/exam-to-clinic.dto';
import { ExamToClinicRepository } from './../../../repositories/implementations/ExamToClinicRepository';

@Injectable()
export class FindExamToClinicService {
  constructor(private readonly examRepository: ExamToClinicRepository) {}

  async execute(
    { skip, take, ...query }: FindExamToClinicDto,
    user: UserPayloadDto,
  ) {
    const Exam = await this.examRepository.find(
      { companyId: user.targetCompanyId, ...query },
      { skip, take },
    );

    return Exam;
  }
}
