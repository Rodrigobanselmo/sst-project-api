import { IDocumentModelData } from './../../../../types/document-mode.types';
import { Injectable } from '@nestjs/common';

import { FakeStorageProvider } from '../../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/FakeStorageProvider';
import { CompanyRepository } from '../../../../../company/repositories/implementations/CompanyRepository';
import { HierarchyRepository } from '../../../../../company/repositories/implementations/HierarchyRepository';
import { HomoGroupRepository } from '../../../../../company/repositories/implementations/HomoGroupRepository';
import { WorkspaceRepository } from '../../../../../company/repositories/implementations/WorkspaceRepository';
import { RiskDocumentEntity } from '../../../../../sst/entities/riskDocument.entity';
import { RiskDocumentRepository } from '../../../../../sst/repositories/implementations/RiskDocumentRepository';
import { RiskGroupDataRepository } from '../../../../../sst/repositories/implementations/RiskGroupDataRepository';
import { DocumentFactoryAbstractionCreator } from '../../creator/DocumentFactoryCreator';
import { IDocumentFactoryProduct as IDocumentFactoryProduct } from '../../types/IDocumentFactory.types';
import { DocumentPGRFactoryProduct } from './DocumentPGRFactory';
import { IDocumentPGRBody } from './types/pgr.types';
import { DocumentModelRepository } from '../../../../repositories/implementations/DocumentModelRepository';

@Injectable()
export class DocumentPGRPreviewFactory extends DocumentFactoryAbstractionCreator<IDocumentPGRBody & { data: IDocumentModelData }, any> {
  constructor(
    private readonly riskGroupDataRepository: RiskGroupDataRepository,
    private readonly riskDocumentRepository: RiskDocumentRepository,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly homoGroupRepository: HomoGroupRepository,
    private readonly hierarchyRepository: HierarchyRepository,
    private readonly documentModelRepository: DocumentModelRepository,
    private readonly storageProvider: FakeStorageProvider,
  ) {
    super(storageProvider);
  }

  public factoryMethod(body: IDocumentPGRBody & { data: IDocumentModelData }): IDocumentFactoryProduct {
    const DocumentPreview = new DocumentPreviewPGRFactoryProduct(
      this.riskGroupDataRepository,
      this.riskDocumentRepository,
      this.workspaceRepository,
      this.companyRepository,
      this.homoGroupRepository,
      this.hierarchyRepository,
      this.documentModelRepository,
    );

    DocumentPreview.data = body.data;

    return DocumentPreview;
  }

  async upload() {
    return ' ';
  }

  async unlinkFiles() {
    //
  }
}

export class DocumentPreviewPGRFactoryProduct extends DocumentPGRFactoryProduct {
  public data: IDocumentModelData = { sections: [], variables: {} };

  public async save() {
    return new RiskDocumentEntity({});
  }

  public async error() {
    return;
  }

  public async downloadLogos() {
    return { logo: 'images/logo/logo-main.png', consultantLogo: 'images/logo/logo-simple.png' };
  }

  public async downloadPathImage() {
    return 'images/mock/placeholder-image.png';
  }

  public async documentModelData() {
    return this.data;
  }
}
