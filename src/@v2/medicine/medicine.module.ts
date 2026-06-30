import { Module } from '@nestjs/common';

import { SharedModule } from '@/@v2/shared/shared.module';
import { ESocial27TableRepository } from '@/modules/esocial/repositories/implementations/ESocial27TableRepository';
import { FindAllTable27Service } from '@/modules/esocial/services/tables/find-all-27.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { PrismaService } from '@/prisma/prisma.service';

import { AcgihBeiComparisonController } from './acgih-bei-comparison/acgih-bei-comparison.controller';
import { AcgihBeiComparisonRepository } from './acgih-bei-comparison/acgih-bei-comparison.repository';
import { AcgihBeiComparisonSpreadsheetExportService } from './acgih-bei-comparison/acgih-bei-comparison-spreadsheet-export.service';
import { AcgihBeiComparisonService } from './acgih-bei-comparison/acgih-bei-comparison.service';
import { ComparisonAiSuggestionService } from './acgih-bei-comparison/comparison-ai-suggestion.service';
import { ComparisonReviewRepository } from './acgih-bei-comparison/comparison-review.repository';
import { ComparisonReviewService } from './acgih-bei-comparison/comparison-review.service';
import { AcgihBeiIndicatorImportApplyService } from './acgih-bei-indicator/acgih-bei-indicator-import-apply.service';
import { AcgihBeiIndicatorImportPreviewService } from './acgih-bei-indicator/acgih-bei-indicator-import-preview.service';
import { AcgihBeiIndicatorSpreadsheetExportService } from './acgih-bei-indicator/acgih-bei-indicator-spreadsheet-export.service';
import { AcgihBeiIndicatorController } from './acgih-bei-indicator/acgih-bei-indicator.controller';
import { AcgihBeiIndicatorRepository } from './acgih-bei-indicator/acgih-bei-indicator.repository';
import { AcgihBeiIndicatorService } from './acgih-bei-indicator/acgih-bei-indicator.service';
import { AcgihOfficialIndicatorApplyController } from './biological-indicator/acgih-promotion/acgih-official-indicator-apply.controller';
import { AcgihOfficialIndicatorApplyService } from './biological-indicator/acgih-promotion/acgih-official-indicator-apply.service';
import { AcgihOfficialIndicatorPreviewController } from './biological-indicator/acgih-promotion/acgih-official-indicator-preview.controller';
import { AcgihOfficialIndicatorPreviewRepository } from './biological-indicator/acgih-promotion/acgih-official-indicator-preview.repository';
import { AcgihOfficialIndicatorPreviewService } from './biological-indicator/acgih-promotion/acgih-official-indicator-preview.service';
import { AcgihRiskCorrelationController } from './biological-indicator/acgih-risk-correlation/acgih-risk-correlation.controller';
import { AcgihRiskCorrelationRepository } from './biological-indicator/acgih-risk-correlation/acgih-risk-correlation.repository';
import { AcgihRiskCorrelationService } from './biological-indicator/acgih-risk-correlation/acgih-risk-correlation.service';
import { AcgihRiskCorrelationApplyController } from './biological-indicator/acgih-risk-correlation/acgih-risk-correlation-apply.controller';
import { AcgihRiskCorrelationApplyService } from './biological-indicator/acgih-risk-correlation/acgih-risk-correlation-apply.service';
import { AcgihRiskCorrelationConsolidateController } from './biological-indicator/acgih-risk-correlation/acgih-risk-correlation-consolidate.controller';
import { AcgihRiskCorrelationConsolidateService } from './biological-indicator/acgih-risk-correlation/acgih-risk-correlation-consolidate.service';
import { BiologicalIndicatorApplicationController } from './biological-indicator/application/application/biological-indicator-application.controller';
import { BiologicalIndicatorCurationController } from './biological-indicator/application/curation/biological-indicator-curation.controller';
import { BiologicalIndicatorMaintenanceController } from './biological-indicator/application/maintenance/biological-indicator-maintenance.controller';
import { BiologicalIndicatorMatchService } from './biological-indicator/biological-indicator-match.service';
import { BiologicalIndicatorDAO } from './biological-indicator/database/dao/biological-indicator.dao';
import { BiologicalIndicatorApplicationService } from './biological-indicator/services/biological-indicator-application.service';
import { BiologicalIndicatorCurationService } from './biological-indicator/services/biological-indicator-curation.service';
import { BiologicalIndicatorImportApplyService } from './biological-indicator/services/biological-indicator-import-apply.service';
import { BiologicalIndicatorImportPreviewService } from './biological-indicator/services/biological-indicator-import-preview.service';
import { BiologicalIndicatorSpreadsheetExportService } from './biological-indicator/services/biological-indicator-spreadsheet-export.service';
import { EsocialProcedureImportApplyService } from './esocial-procedure/esocial-procedure-import-apply.service';
import { EsocialProcedureImportPreviewService } from './esocial-procedure/esocial-procedure-import-preview.service';
import { EsocialProcedureSpreadsheetExportService } from './esocial-procedure/esocial-procedure-spreadsheet-export.service';
import { EsocialProcedureController } from './esocial-procedure/esocial-procedure.controller';
import { EsocialProcedureRepository } from './esocial-procedure/esocial-procedure.repository';
import { EsocialProcedureService } from './esocial-procedure/esocial-procedure.service';
import { ExamRiskRuleImportApplyService } from './exam-risk-rule/exam-risk-rule-import-apply.service';
import { ExamRiskRuleImportPreviewService } from './exam-risk-rule/exam-risk-rule-import-preview.service';
import { ExamRiskRuleNr07SyncService } from './exam-risk-rule/exam-risk-rule-nr07-sync.service';
import { ExamRiskRuleAcgihBeiSyncService } from './exam-risk-rule/exam-risk-rule-acgih-bei-sync.service';
import { ExamRiskRuleSpreadsheetExportService } from './exam-risk-rule/exam-risk-rule-spreadsheet-export.service';
import { ExamRiskRuleController } from './exam-risk-rule/exam-risk-rule.controller';
import { ExamRiskRuleRepository } from './exam-risk-rule/exam-risk-rule.repository';
import { ExamRiskRuleService } from './exam-risk-rule/exam-risk-rule.service';
import { ExamRiskRuleReferenceController } from './exam-risk-rule-reference/exam-risk-rule-reference.controller';
import { ExamRiskRuleReferenceRepository } from './exam-risk-rule-reference/exam-risk-rule-reference.repository';
import { ExamRiskRuleReferenceService } from './exam-risk-rule-reference/exam-risk-rule-reference.service';

@Module({
  imports: [SharedModule, PrismaModule],
  controllers: [
    BiologicalIndicatorApplicationController,
    BiologicalIndicatorMaintenanceController,
    BiologicalIndicatorCurationController,
    ExamRiskRuleController,
    ExamRiskRuleReferenceController,
    EsocialProcedureController,
    AcgihBeiIndicatorController,
    AcgihBeiComparisonController,
    AcgihOfficialIndicatorPreviewController,
    AcgihOfficialIndicatorApplyController,
    AcgihRiskCorrelationController,
    AcgihRiskCorrelationApplyController,
    AcgihRiskCorrelationConsolidateController,
  ],
  providers: [
    BiologicalIndicatorDAO,
    // 4M.1 — match determinístico reutilizável (recebe PrismaClient; PrismaService o estende).
    {
      provide: BiologicalIndicatorMatchService,
      useFactory: (prisma: PrismaService) =>
        new BiologicalIndicatorMatchService(prisma),
      inject: [PrismaService],
    },
    BiologicalIndicatorCurationService,
    BiologicalIndicatorApplicationService,
    BiologicalIndicatorSpreadsheetExportService,
    BiologicalIndicatorImportPreviewService,
    BiologicalIndicatorImportApplyService,
    ExamRiskRuleRepository,
    ExamRiskRuleService,
    ExamRiskRuleNr07SyncService,
    ExamRiskRuleAcgihBeiSyncService,
    ExamRiskRuleSpreadsheetExportService,
    ExamRiskRuleImportPreviewService,
    ExamRiskRuleImportApplyService,
    ExamRiskRuleReferenceRepository,
    ExamRiskRuleReferenceService,
    EsocialProcedureRepository,
    EsocialProcedureService,
    EsocialProcedureSpreadsheetExportService,
    EsocialProcedureImportPreviewService,
    EsocialProcedureImportApplyService,
    AcgihBeiIndicatorRepository,
    AcgihBeiIndicatorService,
    AcgihBeiIndicatorSpreadsheetExportService,
    AcgihBeiIndicatorImportPreviewService,
    AcgihBeiIndicatorImportApplyService,
    AcgihBeiComparisonRepository,
    AcgihBeiComparisonService,
    AcgihBeiComparisonSpreadsheetExportService,
    ComparisonReviewRepository,
    ComparisonReviewService,
    ComparisonAiSuggestionService,
    // 4P.1B — preview/dry-run de promoção ACGIH/BEI (somente leitura).
    AcgihOfficialIndicatorPreviewRepository,
    AcgihOfficialIndicatorPreviewService,
    // 4P.2A — apply/promote real de candidatos ACGIH/BEI (escrita controlada).
    AcgihOfficialIndicatorApplyService,
    // Frente A.1 — preview de correlação ACGIH/BEI × Fatores de Risco (read-only).
    AcgihRiskCorrelationRepository,
    AcgihRiskCorrelationService,
    AcgihRiskCorrelationApplyService,
    AcgihRiskCorrelationConsolidateService,
    // Leitura apenas do catálogo oficial da Tabela 27 (não altera eSocial).
    FindAllTable27Service,
    ESocial27TableRepository,
  ],
})
export class MedicineModule {}
