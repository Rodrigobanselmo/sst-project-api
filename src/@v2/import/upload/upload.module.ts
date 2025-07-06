import { SharedModule } from '@/@v2/shared/shared.module';
import { Module } from '@nestjs/common';
import { UploadStructureService } from './services/upload-structure/upload-structure.service';
import { UploadStructureUseCase } from './application/upload-structure/use-cases/upload-structure.usecase';
import { UploadStructureController } from './application/upload-structure/controllers/upload-structure.controller';
import { UploadStructureProduct } from './products/upload-structure/upload-structure.product';
import { NodeXMLAdapter } from './adapters/xml/node-xml.adapter';

@Module({
  imports: [SharedModule],
  controllers: [UploadStructureController],
  providers: [
    // Services
    UploadStructureService,

    // Use Cases
    UploadStructureUseCase,

    // Products
    UploadStructureProduct,

    // Adapters
    NodeXMLAdapter,
  ],
  exports: [],
})
export class UploadModule {}
