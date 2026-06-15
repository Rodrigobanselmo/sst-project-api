import { Module } from '@nestjs/common';

import { SharedModule } from '@/@v2/shared/shared.module';

import {
  HoExtractionSolventController,
  HoLaboratoryController,
  HoMethodUploadController,
  HoSamplerController,
} from './ho-method/controllers/ho-catalog.controller';
import {
  HoMethodByIdController,
  HoMethodController,
} from './ho-method/controllers/ho-method.controller';
import {
  HoExtractionSolventService,
  HoLaboratoryService,
  HoMethodFileService,
  HoSamplerService,
} from './ho-method/ho-catalog.service';
import { HoMethodImportService } from './ho-method/import/ho-method-import.service';
import { HoMethodDAO } from './ho-method/ho-method.dao';
import { HoMethodRepository } from './ho-method/ho-method.repository';
import { HoMethodRiskSearchService } from './ho-method/ho-method-risk-search.service';
import { HoMethodService } from './ho-method/ho-method.service';

@Module({
  imports: [SharedModule],
  controllers: [
    HoMethodController,
    HoMethodByIdController,
    HoSamplerController,
    HoExtractionSolventController,
    HoLaboratoryController,
    HoMethodUploadController,
  ],
  providers: [
    HoMethodDAO,
    HoMethodRepository,
    HoMethodService,
    HoMethodRiskSearchService,
    HoMethodImportService,
    HoSamplerService,
    HoExtractionSolventService,
    HoLaboratoryService,
    HoMethodFileService,
  ],
  exports: [HoMethodService],
})
export class OccupationalHygieneModule {}
