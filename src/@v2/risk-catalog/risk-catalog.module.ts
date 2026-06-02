import { Module } from '@nestjs/common';

import { SharedModule } from '@/@v2/shared/shared.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { RiskCatalogEquivalenceModule } from '@/shared/risk-catalog-equivalence/risk-catalog-equivalence.module';

import { RiskCatalogEquivalenceController } from './application/equivalences/controllers/risk-catalog-equivalence.controller';
import { RiskCatalogEquivalenceMasterService } from './application/equivalences/services/risk-catalog-equivalence-master.service';

@Module({
  imports: [SharedModule, PrismaModule, RiskCatalogEquivalenceModule],
  controllers: [RiskCatalogEquivalenceController],
  providers: [RiskCatalogEquivalenceMasterService],
})
export class RiskCatalogModule {}
