import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { MedicineRoutes } from '@/@v2/medicine/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { RoleEnum } from '@/shared/constants/enum/authorization';
import { Roles } from '@/shared/decorators/roles.decorator';
import { User } from '@/shared/decorators/user.decorator';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import {
  AcgihExamLinkResolveBody,
  AcgihExamLinkSyncBody,
  AcgihExamLinkConfirmSafePendingBody,
  AcgihExamLinkResolveAmbiguousBody,
} from './acgih-exam-link.dto';
import { AcgihExamLinkService } from './acgih-exam-link.service';

/**
 * Vínculo ACGIH/BEI → Exame (MASTER-only). Pontos de escrita: Exam (sistêmico,
 * apenas no resolve quando não há candidato seguro) e BiologicalIndicatorToExam.
 * confirmText validado no DTO (@Matches); dryRun=true gera prévia sem escrita.
 * Não cria regra da Biblioteca, ExamToRisk em empresa, nem altera NR-7/RiskFactor.
 */
@Controller(MedicineRoutes.BIOLOGICAL_INDICATORS.BASE)
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.MASTER)
export class AcgihExamLinkController {
  constructor(private readonly service: AcgihExamLinkService) {}

  @Get(MedicineRoutes.BIOLOGICAL_INDICATORS.ACGIH_EXAM_LINK_PREVIEW)
  preview() {
    return this.service.preview();
  }

  @Post(MedicineRoutes.BIOLOGICAL_INDICATORS.ACGIH_EXAM_LINK_SYNC)
  sync(@Body() body: AcgihExamLinkSyncBody, @User() user: UserPayloadDto) {
    return this.service.sync({ userId: user.userId, dryRun: body.dryRun });
  }

  @Post(MedicineRoutes.BIOLOGICAL_INDICATORS.ACGIH_EXAM_LINK_RESOLVE)
  resolve(
    @Body() body: AcgihExamLinkResolveBody,
    @User() user: UserPayloadDto,
  ) {
    return this.service.resolve({
      userId: user.userId,
      dryRun: body.dryRun,
      createMissingExams: body.createMissingExams,
      linkSafeMatches: body.linkSafeMatches,
    });
  }

  @Post(MedicineRoutes.BIOLOGICAL_INDICATORS.ACGIH_EXAM_LINK_CONFIRM_SAFE_PENDING)
  confirmSafePending(
    @Body() body: AcgihExamLinkConfirmSafePendingBody,
    @User() user: UserPayloadDto,
  ) {
    return this.service.confirmSafePending({
      userId: user.userId,
      dryRun: body.dryRun,
    });
  }

  @Post(MedicineRoutes.BIOLOGICAL_INDICATORS.ACGIH_EXAM_LINK_RESOLVE_AMBIGUOUS)
  resolveAmbiguous(
    @Body() body: AcgihExamLinkResolveAmbiguousBody,
    @User() user: UserPayloadDto,
  ) {
    return this.service.resolveAmbiguous({
      indicatorId: body.indicatorId,
      examIds: body.examIds,
      userId: user.userId,
      dryRun: body.dryRun,
    });
  }
}
