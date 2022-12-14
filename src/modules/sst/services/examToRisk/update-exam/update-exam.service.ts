import { BadRequestException, Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { UpdateExamRiskDto } from '../../../dto/exam-risk.dto';
import { ExamRiskRepository } from '../../../repositories/implementations/ExamRiskRepository';
import { CheckEmployeeExamService } from '../../exam/check-employee-exam/check-employee-exam.service';

@Injectable()
export class UpdateExamRiskService {
  constructor(private readonly examRiskRepository: ExamRiskRepository, private readonly checkEmployeeExamService: CheckEmployeeExamService) {}

  async execute(id: number, updateExamDto: UpdateExamRiskDto, user: UserPayloadDto) {
    const found = await this.examRiskRepository.findFirstNude({
      where: { id, companyId: user.targetCompanyId },
      select: { id: true, riskId: true },
    });

    if (!found?.id) throw new BadRequestException('Não encontrado');

    const exam = await this.examRiskRepository.update({
      id,
      companyId: user.targetCompanyId,
      ...updateExamDto,
    });

    this.checkEmployeeExamService.execute({
      companyId: user.targetCompanyId,
      riskId: updateExamDto.riskId,
    });

    this.checkEmployeeExamService.execute({
      companyId: user.targetCompanyId,
      riskId: found.riskId,
    });

    return exam;
  }
}
