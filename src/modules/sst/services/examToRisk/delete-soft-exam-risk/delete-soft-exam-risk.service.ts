import { BadRequestException, Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { ExamRiskRepository } from '../../../repositories/implementations/ExamRiskRepository';
import { CheckEmployeeExamService } from '../../exam/check-employee-exam/check-employee-exam.service';

@Injectable()
export class DeleteSoftExamRiskService {
  constructor(
    private readonly examRiskRepository: ExamRiskRepository,
    private readonly checkEmployeeExamService: CheckEmployeeExamService,
  ) {}

  async execute(id: number, user: UserPayloadDto) {
    const found = await this.examRiskRepository.findFirstNude({
      where: { id, deletedAt: null },
      select: { id: true, companyId: true },
    });

    if (!found?.id) throw new BadRequestException('Não encontrado');

    if (found.companyId != user.targetCompanyId) {
      await this.examRiskRepository.update({
        id,
        companyId: found.companyId,
        addSkipCompanyId: user.targetCompanyId,
      });

      this.checkEmployeeExamService.execute({
        companyId: user.targetCompanyId,
        riskId: found.riskId,
      });

      return found;
    }

    const examRisk = await this.examRiskRepository.deleteSoft(id, user.targetCompanyId);

    this.checkEmployeeExamService.execute({
      companyId: user.targetCompanyId,
      riskId: examRisk.riskId,
    });

    return examRisk;
  }
}
