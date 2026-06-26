import { BadRequestException, Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { asyncEach } from '../../../../../shared/utils/asyncEach';
import { BulkDeleteExamRiskDto } from '../../../dto/exam-risk.dto';
import { ExamRiskRepository } from '../../../repositories/implementations/ExamRiskRepository';
import { CheckEmployeeExamService } from '../../exam/check-employee-exam/check-employee-exam.service';

@Injectable()
export class BulkDeleteExamRiskService {
  constructor(
    private readonly examRiskRepository: ExamRiskRepository,
    private readonly checkEmployeeExamService: CheckEmployeeExamService,
  ) {}

  async execute({ ids }: BulkDeleteExamRiskDto, user: UserPayloadDto) {
    const uniqueIds = Array.from(new Set(ids ?? []));
    if (uniqueIds.length === 0) {
      throw new BadRequestException('Nenhum vínculo selecionado');
    }

    // Restrito aos vínculos da própria empresa (soft delete). Vínculos herdados
    // de contratante continuam sendo removidos individualmente (lógica de skip).
    const affected = await this.examRiskRepository.findNude({
      where: { id: { in: uniqueIds }, companyId: user.targetCompanyId, deletedAt: null },
      select: { id: true, riskId: true },
    });

    if (affected.length === 0) {
      throw new BadRequestException('Nenhum vínculo encontrado para remover');
    }

    const deletedCount = await this.examRiskRepository.deleteManySoft(
      affected.map((exam) => exam.id),
      user.targetCompanyId,
    );

    const riskIds = Array.from(
      new Set(affected.map((exam) => exam.riskId).filter((riskId): riskId is string => !!riskId)),
    );

    this.checkEmployeeExam(user.targetCompanyId, riskIds);

    return { count: deletedCount };
  }

  private async checkEmployeeExam(companyId: string, riskIds: string[]) {
    await asyncEach(riskIds, async (riskId) => {
      await this.checkEmployeeExamService.execute({ companyId, riskId });
    });
  }
}
