import { DocumentDAO } from '@/@v2/documents/database/dao/document/document.dao';
import { DocumentVersionEntity } from '@/@v2/documents/domain/entities/document-version.entity';
import { CharacterizationPhotoModel } from '@/@v2/documents/domain/models/characterization-photos.model';
import { DocumentPGRModel } from '@/@v2/documents/domain/models/document-pgr.model';
import { DocumentBuildPGR } from '@/@v2/documents/libs/docx/builders/pgr/create';
import { getDocumentFileName } from '@/@v2/documents/libs/docx/helpers/get-document-file-name';
import { getDocumentVersion } from '@/@v2/documents/libs/docx/helpers/get-document-version';
import { PREVIEW_TYPE } from '@/@v2/documents/services/document-creation/document-creation.service';
import { DocumentVersionStatus } from '@/@v2/shared/domain/enum/documents/document-version-status';
import { dateUtils } from '@/@v2/shared/utils/helpers/date-utils';
import { BadRequestException } from '@nestjs/common';
import { ISectionOptions } from 'docx';
import { IDocumentFactoryProduct, IGetDocument, ISaveDocument, ISaveErrorDocument, IUnlinkPaths } from '../../types/document-factory.types';
import { IProductDocumentPreview } from './document-preview.types';

export class ProductDocumentPreview implements IDocumentFactoryProduct<IProductDocumentPreview, DocumentPGRModel> {
  public unlinkPaths: IUnlinkPaths[] = [];
  public type = PREVIEW_TYPE;

  constructor(private readonly documentDAO: DocumentDAO) {}

  public async getData({ model }: IProductDocumentPreview) {
    const document = await this.documentDAO.findDocumentPGR({ documentVersionId: 'd4a95404-f195-4729-83a1-e672e81a3f6b' });
    if (!document) throw new BadRequestException('Nenhum documento PGR cadastrado');

    document.model = model;

    await this.downloadImages(document);

    return document;
  }

  public async getAttachments() {
    return [];
  }

  public async getSections({ data, attachments }: IGetDocument<IProductDocumentPreview, DocumentPGRModel>) {
    const version = this.getVersionName(data);

    const sections: ISectionOptions[] = await new DocumentBuildPGR({
      data: data,
      version: version,
      attachments,
      sections: data.model.sections,
      variables: data.model.variables,
    }).build();

    return sections;
  }

  public async save({ attachments, body, url }: ISaveDocument<IProductDocumentPreview, DocumentPGRModel>) {
    const documentVersion = new DocumentVersionEntity({
      id: 'preview',
      status: DocumentVersionStatus.DONE,
      attachments,
      fileUrl: url,
    });

    return documentVersion;
  }

  public async error({ body }: ISaveErrorDocument<IProductDocumentPreview>) {}

  public getFileName = (data: DocumentPGRModel, type = 'PGR') => {
    return getDocumentFileName({
      name: data.documentVersion.name || '',
      companyName: data.documentBase.company.indentificationName,
      version: data.documentVersion.version,
      typeName: type,
      date: dateUtils().format('MMMM-YYYY'),
    });
  };

  private getVersionName = (data: DocumentPGRModel) => {
    return getDocumentVersion(data.documentVersion);
  };

  private async downloadImages(document: DocumentPGRModel) {
    const images = document.model.images;
    const company = document.documentBase.company;
    const consultant = document.documentBase.company.consultant;
    const workspace = document.documentBase.workspace;

    const companyLogoPath = 'images/logo/logo-main.png';
    const consultantLogoPath = 'images/logo/logo-simple.png';
    const workspaceLogoPath = 'images/logo/logo-main.png';

    if (companyLogoPath) {
      company.logoPath = companyLogoPath;
    }
    if (consultantLogoPath && consultant) {
      consultant.logoPath = consultantLogoPath;
    }
    if (workspaceLogoPath && workspace) {
      workspace.logoPath = workspaceLogoPath;
    }

    images.forEach((image) => {
      image.path = 'images/mock/placeholder-image.png';
    });

    const photos = document.homogeneousGroups
      .map((group) => group.characterization?.photos)
      .flat()
      .filter(Boolean) as CharacterizationPhotoModel[];

    photos.forEach((photo) => {
      photo.path = 'images/mock/placeholder-image.png';
    });
  }
}
