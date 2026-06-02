import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';

import { RiskCatalogEquivalenceService } from './risk-catalog-equivalence.service';

@Module({
  imports: [PrismaModule],
  providers: [RiskCatalogEquivalenceService],
  exports: [RiskCatalogEquivalenceService],
})
export class RiskCatalogEquivalenceModule {}
