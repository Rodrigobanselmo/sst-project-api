import { Module } from '@nestjs/common';

import { SharedModule } from '@/@v2/shared/shared.module';
import { PrismaModule } from '@/prisma/prisma.module';

import { BiologicalIndicatorApplicationController } from './biological-indicator/application/application/biological-indicator-application.controller';
import { BiologicalIndicatorCurationController } from './biological-indicator/application/curation/biological-indicator-curation.controller';
import { BiologicalIndicatorDAO } from './biological-indicator/database/dao/biological-indicator.dao';
import { BiologicalIndicatorApplicationService } from './biological-indicator/services/biological-indicator-application.service';
import { BiologicalIndicatorCurationService } from './biological-indicator/services/biological-indicator-curation.service';

@Module({
  imports: [SharedModule, PrismaModule],
  controllers: [BiologicalIndicatorApplicationController, BiologicalIndicatorCurationController],
  providers: [
    BiologicalIndicatorDAO,
    BiologicalIndicatorCurationService,
    BiologicalIndicatorApplicationService,
  ],
})
export class MedicineModule {}
