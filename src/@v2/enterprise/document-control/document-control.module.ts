import { SharedModule } from '@/@v2/shared/shared.module';
import { Module } from '@nestjs/common';
import { AddDocumentControlUseCase } from './application/document-control/add-document-control/use-cases/add-document-control.usecase';
import { DocumentControlFileRepository } from './database/repositories/document-control-file/document-control-file.repository';
import { DocumentControlAggregateRepository } from './database/repositories/document-control/document-control-aggregate.repository';
import { DocumentControlRepository } from './database/repositories/document-control/document-control.repository';
import { AddDocumentControlController } from './application/document-control/add-document-control/controllers/add-document-control.controller';
import { GetDocumentControlFileService } from './services/get-document-control-file/get-document-control-file.service';
import { AddDocumentControlFileUseCase } from './application/document-control-file/add-document-control-file/use-cases/add-document-control-file.usecase';
import { EditDocumentControlUseCase } from './application/document-control/edit-document-control/use-cases/edit-document-control.usecase';
import { EditDocumentControlFileUseCase } from './application/document-control-file/edit-document-control-file/use-cases/edit-document-control-file.usecase';
import { EditDocumentControlController } from './application/document-control/edit-document-control/controllers/edit-document-control.controller';
import { AddDocumentControlFileController } from './application/document-control-file/add-document-control-file/controllers/add-document-control-file.controller';
import { EditDocumentControlFileController } from './application/document-control-file/edit-document-control-file/controllers/edit-document-control-file.controller';
import { DocumentControlFileDAO } from './database/dao/document-control-file/document-control-file.dao';
import { DocumentControlDAO } from './database/dao/document-control/document-control.dao';

@Module({
  imports: [SharedModule],
  controllers: [AddDocumentControlController, EditDocumentControlController, AddDocumentControlFileController, EditDocumentControlFileController],
  providers: [
    // Database
    DocumentControlAggregateRepository,
    DocumentControlRepository,
    DocumentControlFileRepository,
    DocumentControlDAO,
    DocumentControlFileDAO,

    // Use Cases
    AddDocumentControlUseCase,
    EditDocumentControlUseCase,
    AddDocumentControlFileUseCase,
    EditDocumentControlFileUseCase,

    // Services
    GetDocumentControlFileService,
  ],
  exports: [],
})
export class CompanyModule {}
