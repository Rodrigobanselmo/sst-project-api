import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';

import { MedicineRoutes } from '@/@v2/medicine/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { RoleEnum } from '@/shared/constants/enum/authorization';
import { Roles } from '@/shared/decorators/roles.decorator';
import { User } from '@/shared/decorators/user.decorator';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import {
  RuleReferenceByIdPath,
  RuleReferencesPath,
} from './exam-risk-rule-reference.dto';
import { ExamRiskRuleReferenceService } from './exam-risk-rule-reference.service';

/**
 * Fase 4I — Fontes/evidências complementares das Regras Exame × Risco.
 * Listagem e remoção sob a base da Biblioteca. O apply ACGIH/BEI vive na
 * comparação (AcgihBeiComparisonController). Apenas MASTER.
 */
@Controller(MedicineRoutes.EXAM_RISK_RULES.BASE)
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.MASTER)
export class ExamRiskRuleReferenceController {
  constructor(private readonly service: ExamRiskRuleReferenceService) {}

  @Get(MedicineRoutes.EXAM_RISK_RULES.REFERENCES)
  list(@Param() path: RuleReferencesPath) {
    return this.service.listByRule(path.ruleId);
  }

  @Delete(MedicineRoutes.EXAM_RISK_RULES.REFERENCE_BY_ID)
  remove(
    @Param() path: RuleReferenceByIdPath,
    @User() user: UserPayloadDto,
  ) {
    return this.service.remove({
      ruleId: path.ruleId,
      referenceId: path.referenceId,
      userId: user.userId,
    });
  }
}
