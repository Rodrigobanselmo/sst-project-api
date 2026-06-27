import { Module } from '@nestjs/common';

import { SharedModule } from '@/@v2/shared/shared.module';
import { ESocial27TableRepository } from '@/modules/esocial/repositories/implementations/ESocial27TableRepository';
import { FindAllTable27Service } from '@/modules/esocial/services/tables/find-all-27.service';
import { PrismaModule } from '@/prisma/prisma.module';

import { BiologicalIndicatorApplicationController } from './biological-indicator/application/application/biological-indicator-application.controller';
import { BiologicalIndicatorCurationController } from './biological-indicator/application/curation/biological-indicator-curation.controller';
import { BiologicalIndicatorMaintenanceController } from './biological-indicator/application/maintenance/biological-indicator-maintenance.controller';
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
import { ExamRiskRuleSpreadsheetExportService } from './exam-risk-rule/exam-risk-rule-spreadsheet-export.service';
import { ExamRiskRuleController } from './exam-risk-rule/exam-risk-rule.controller';
import { ExamRiskRuleRepository } from './exam-risk-rule/exam-risk-rule.repository';
import { ExamRiskRuleService } from './exam-risk-rule/exam-risk-rule.service';

@Module({
  imports: [SharedModule, PrismaModule],
  controllers: [
    BiologicalIndicatorApplicationController,
    BiologicalIndicatorMaintenanceController,
    BiologicalIndicatorCurationController,
    ExamRiskRuleController,
    EsocialProcedureController,
  ],
  providers: [
    BiologicalIndicatorDAO,
    BiologicalIndicatorCurationService,
    BiologicalIndicatorApplicationService,
    BiologicalIndicatorSpreadsheetExportService,
    BiologicalIndicatorImportPreviewService,
    BiologicalIndicatorImportApplyService,
    ExamRiskRuleRepository,
    ExamRiskRuleService,
    ExamRiskRuleNr07SyncService,
    ExamRiskRuleSpreadsheetExportService,
    ExamRiskRuleImportPreviewService,
    ExamRiskRuleImportApplyService,
    EsocialProcedureRepository,
    EsocialProcedureService,
    EsocialProcedureSpreadsheetExportService,
    EsocialProcedureImportPreviewService,
    EsocialProcedureImportApplyService,
    // Leitura apenas do catálogo oficial da Tabela 27 (não altera eSocial).
    FindAllTable27Service,
    ESocial27TableRepository,
  ],
})
export class MedicineModule {}
