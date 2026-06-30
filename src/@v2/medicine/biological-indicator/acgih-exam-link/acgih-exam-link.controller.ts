import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { MedicineRoutes } from '@/@v2/medicine/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { RoleEnum } from '@/shared/constants/enum/authorization';
import { Roles } from '@/shared/decorators/roles.decorator';
import { User } from '@/shared/decorators/user.decorator';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import { AcgihExamLinkSyncBody } from './acgih-exam-link.dto';
import { AcgihExamLinkService } from './acgih-exam-link.service';

/**
 * Vínculo ACGIH/BEI → Exame (MASTER-only). Único ponto de escrita:
 * BiologicalIndicatorToExam. confirmText validado no DTO (@Matches). dryRun=true
 * gera prévia sem escrita. Não cria exame, regra da Biblioteca nem ExamToRisk.
 */
@Controller(MedicineRoutes.BIOLOGICAL_INDICATORS.BASE)
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.MASTER)
export class AcgihExamLinkController {
  constructor(private readonly service: AcgihExamLinkService) {}

  @Post(MedicineRoutes.BIOLOGICAL_INDICATORS.ACGIH_EXAM_LINK_SYNC)
  sync(@Body() body: AcgihExamLinkSyncBody, @User() user: UserPayloadDto) {
    return this.service.sync({ userId: user.userId, dryRun: body.dryRun });
  }
}
