import { Module } from '@nestjs/common';

import { SharedModule } from '@/@v2/shared/shared.module';
import { PrismaModule } from '@/prisma/prisma.module';

import { BiologicalIndicatorCurationController } from './biological-indicator/application/curation/biological-indicator-curation.controller';
import { BiologicalIndicatorDAO } from './biological-indicator/database/dao/biological-indicator.dao';
import { BiologicalIndicatorCurationService } from './biological-indicator/services/biological-indicator-curation.service';

@Module({
  imports: [SharedModule, PrismaModule],
  controllers: [BiologicalIndicatorCurationController],
  providers: [BiologicalIndicatorDAO, BiologicalIndicatorCurationService],
})
export class MedicineModule {}
