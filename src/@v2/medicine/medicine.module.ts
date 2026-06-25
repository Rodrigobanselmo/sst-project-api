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

@Module({
  imports: [SharedModule, PrismaModule],
  controllers: [
    BiologicalIndicatorApplicationController,
    BiologicalIndicatorMaintenanceController,
    BiologicalIndicatorCurationController,
  ],
  providers: [
    BiologicalIndicatorDAO,
    BiologicalIndicatorCurationService,
    BiologicalIndicatorApplicationService,
    BiologicalIndicatorSpreadsheetExportService,
    BiologicalIndicatorImportPreviewService,
    BiologicalIndicatorImportApplyService,
  ],
})
export class MedicineModule {}
