import { Module } from '@nestjs/common';

import { SharedModule } from '@/@v2/shared/shared.module';
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
import { ExamRiskRuleNr07SyncService } from './exam-risk-rule/exam-risk-rule-nr07-sync.service';
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
  ],
})
export class MedicineModule {}
