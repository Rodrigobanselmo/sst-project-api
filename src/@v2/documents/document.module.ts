import { Module } from "@nestjs/common";
import { SharedModule } from "../shared/shared.module";
import { DocumentVersionRepository } from "./database/repositories/document-version/document-version.repository";
import { DocumentBaseDAO } from "./database/dao/document-base/document-base.dao";
import { DocumentDAO } from "./database/dao/document/document.dao";
import { DocumentVersionDAO } from "./database/dao/document-version/document-version.dao";
import { HierarchyDAO } from "./database/dao/hierarchy/hierarchy.dao";
import { ExamDAO } from "./database/dao/exam/exam.dao";
import { HomogeneousGroupDAO } from "./database/dao/homogeneous-group/homogeneous-group.dao";
import { RiskDAO } from "./database/dao/risk/risk.dao";
import { RiskDataDAO } from "./database/dao/risk-data/risk-data.dao";
import { ProductDocumentPGR } from "./application/factories/document/products/document-pgr/document-pgr.product";
import { DocumentCreationService } from "./application/services/document-creation/document-creation.service";
import { DonwloadImageService } from "./application/services/donwload-image/donwload-image.service";
import { CreatorDocumentPGR } from "./application/factories/document/creators/document-pgr/document-pgr.creator";

@Module({
  imports: [SharedModule],
  controllers: [],
  providers: [
    CreatorDocumentPGR,
    ProductDocumentPGR,
    DocumentCreationService,
    DonwloadImageService,
    DocumentVersionRepository,
    DocumentDAO,
    DocumentBaseDAO,
    DocumentVersionDAO,
    HierarchyDAO,
    ExamDAO,
    HomogeneousGroupDAO,
    RiskDAO,
    RiskDataDAO,
  ],
  exports: [CreatorDocumentPGR]
})
export class DocumentModule { }
