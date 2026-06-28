import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { MedicineRoutes } from '@/@v2/medicine/constants/routes';
import { JwtAuthGuard } from '@/@v2/shared/guards/jwt-auth.guard';
import { RoleEnum } from '@/shared/constants/enum/authorization';
import { Roles } from '@/shared/decorators/roles.decorator';
import { User } from '@/shared/decorators/user.decorator';
import { UserPayloadDto } from '@/shared/dto/user-payload.dto';

import { ApplyAcgihReferenceBody } from '../exam-risk-rule-reference/exam-risk-rule-reference.dto';
import { ExamRiskRuleReferenceService } from '../exam-risk-rule-reference/exam-risk-rule-reference.service';
import {
  BrowseAcgihBeiComparisonQuery,
  ExportAcgihBeiComparisonQuery,
  UpsertComparisonReviewBody,
} from './acgih-bei-comparison.dto';
import { AcgihBeiComparisonSpreadsheetExportService } from './acgih-bei-comparison-spreadsheet-export.service';
import { AcgihBeiComparisonService } from './acgih-bei-comparison.service';
import { ComparisonAiSuggestionService } from './comparison-ai-suggestion.service';
import { ComparisonReviewService } from './comparison-review.service';

const XLSX_CONTENT_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

/**
 * Fase 4E — Comparação ACGIH/BEI × NR-7 × Regras Exame × Risco (SOMENTE LEITURA
 * nos GET). Fase 4I — único ponto de escrita: registrar a ACGIH/BEI como fonte
 * complementar de uma regra EXISTENTE (POST references). Não cria regra, não
 * toca ExamToRisk/empresas/XML/eSocial nem as bases NR-7/ACGIH/BEI.
 */
@Controller(MedicineRoutes.ACGIH_BEI_COMPARISON.BASE)
@UseGuards(JwtAuthGuard)
@Roles(RoleEnum.MASTER)
export class AcgihBeiComparisonController {
  constructor(
    private readonly service: AcgihBeiComparisonService,
    private readonly exportService: AcgihBeiComparisonSpreadsheetExportService,
    private readonly referenceService: ExamRiskRuleReferenceService,
    private readonly reviewService: ComparisonReviewService,
    private readonly aiSuggestionService: ComparisonAiSuggestionService,
  ) {}

  @Post(MedicineRoutes.ACGIH_BEI_COMPARISON.REFERENCES)
  addReference(
    @Body() body: ApplyAcgihReferenceBody,
    @User() user: UserPayloadDto,
  ) {
    return this.referenceService.applyAcgihReference({
      acgihBeiIndicatorId: body.acgihBeiIndicatorId,
      userId: user.userId,
    });
  }

  // 4O.1 — registra/atualiza a decisão técnica de uma linha da comparação.
  // Camada de curadoria: NÃO altera o cálculo nem as bases de origem.
  @Post(MedicineRoutes.ACGIH_BEI_COMPARISON.REVIEWS)
  upsertReview(
    @Body() body: UpsertComparisonReviewBody,
    @User() user: UserPayloadDto,
  ) {
    return this.reviewService.upsert({
      acgihBeiIndicatorId: body.acgihBeiIndicatorId,
      decision: body.decision,
      technicalNote: body.technicalNote,
      userId: user.userId,
    });
  }

  // 4O.2 — sugestão de decisão técnica assistida por IA (apenas sugere; não
  // grava decisão nem sugestão; não altera nenhuma base). Requer confirmação
  // humana pelo fluxo de decisão (4O.1).
  @Post(MedicineRoutes.ACGIH_BEI_COMPARISON.REVIEW_AI_SUGGESTION)
  aiSuggestion(@Param('acgihBeiIndicatorId') acgihBeiIndicatorId: string) {
    return this.aiSuggestionService.suggest({ acgihBeiIndicatorId });
  }

  // 4O.1 — limpa/reabre a decisão técnica (soft-delete).
  @Delete(MedicineRoutes.ACGIH_BEI_COMPARISON.REVIEW_BY_ID)
  removeReview(
    @Param('acgihBeiIndicatorId') acgihBeiIndicatorId: string,
    @User() user: UserPayloadDto,
  ) {
    return this.reviewService.remove({
      acgihBeiIndicatorId,
      userId: user.userId,
    });
  }

  @Get(MedicineRoutes.ACGIH_BEI_COMPARISON.EXPORT)
  async export(
    @Query() query: ExportAcgihBeiComparisonQuery,
    @Res() res: Response,
  ) {
    const rows = await this.service.computeForExport({
      search: query.search,
      comparisonStatus: query.comparisonStatus,
      suggestedAction: query.suggestedAction,
      confidence: query.confidence,
      reviewDecision: query.reviewDecision,
      hasReview: query.hasReview,
    });
    const buffer = await this.exportService.export(rows);
    res.setHeader('Content-Type', XLSX_CONTENT_TYPE);
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="acgih-bei-comparacao.xlsx"',
    );
    res.status(HttpStatus.OK);
    res.send(buffer);
  }

  @Get()
  browse(@Query() query: BrowseAcgihBeiComparisonQuery) {
    return this.service.browse({
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      filters: {
        search: query.search,
        comparisonStatus: query.comparisonStatus,
        suggestedAction: query.suggestedAction,
        confidence: query.confidence,
        reviewDecision: query.reviewDecision,
        hasReview: query.hasReview,
      },
    });
  }
}
