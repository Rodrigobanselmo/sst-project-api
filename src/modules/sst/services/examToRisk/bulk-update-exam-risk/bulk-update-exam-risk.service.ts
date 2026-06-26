import { BadRequestException, Injectable } from '@nestjs/common';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { asyncEach } from '../../../../../shared/utils/asyncEach';
import { BulkUpdateExamRiskDto } from '../../../dto/exam-risk.dto';
import { ExamRiskRepository } from '../../../repositories/implementations/ExamRiskRepository';
import { CheckEmployeeExamService } from '../../exam/check-employee-exam/check-employee-exam.service';

@Injectable()
export class BulkUpdateExamRiskService {
  constructor(
    private readonly examRiskRepository: ExamRiskRepository,
    private readonly checkEmployeeExamService: CheckEmployeeExamService,
  ) {}

  async execute({ ids, patch }: BulkUpdateExamRiskDto, user: UserPayloadDto) {
    const uniqueIds = Array.from(new Set(ids ?? []));
    if (uniqueIds.length === 0) {
      throw new BadRequestException('Nenhum vínculo selecionado');
    }

    // Mantém apenas os campos efetivamente enviados (evita sobrescrever por
    // acidente campos não marcados no modal de edição em lote).
    const data = Object.fromEntries(
      Object.entries(patch ?? {}).filter(([, value]) => value !== undefined),
    );

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('Nenhum campo para atualizar');
    }

    // Restrito aos vínculos da própria empresa (não altera vínculos herdados de
    // contratante; estes continuam sendo editados individualmente).
    const affected = await this.examRiskRepository.findNude({
      where: { id: { in: uniqueIds }, companyId: user.targetCompanyId, deletedAt: null },
      select: { id: true, riskId: true },
    });

    if (affected.length === 0) {
      throw new BadRequestException('Nenhum vínculo encontrado para atualizar');
    }

    const updatedCount = await this.examRiskRepository.updateManyFields(
      affected.map((exam) => exam.id),
      user.targetCompanyId,
      data,
    );

    const riskIds = Array.from(
      new Set(affected.map((exam) => exam.riskId).filter((riskId): riskId is string => !!riskId)),
    );

    this.checkEmployeeExam(user.targetCompanyId, riskIds);

    return { count: updatedCount };
  }

  private async checkEmployeeExam(companyId: string, riskIds: string[]) {
    await asyncEach(riskIds, async (riskId) => {
      await this.checkEmployeeExamService.execute({ companyId, riskId });
    });
  }
}
