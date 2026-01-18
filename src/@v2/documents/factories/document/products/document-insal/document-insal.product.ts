import { DocumentDAO } from '@/@v2/documents/database/dao/document/document.dao';
import { DocumentVersionRepository } from '@/@v2/documents/database/repositories/document-version/document-version.repository';
import { DocumentVersionEntity } from '@/@v2/documents/domain/entities/document-version.entity';
import { DocumentPGRModel } from '@/@v2/documents/domain/models/document-pgr.model';
import { DocumentBuildPGR } from '@/@v2/documents/libs/docx/builders/pgr/create';
import { getDocumentFileName } from '@/@v2/documents/libs/docx/helpers/get-document-file-name';
import { getDocumentVersion } from '@/@v2/documents/libs/docx/helpers/get-document-version';
import { DownloadImageService } from '@/@v2/documents/services/download-image/download-image.service';
import { DocumentVersionStatus } from '@/@v2/shared/domain/enum/documents/document-version-status';
import { dateUtils } from '@/@v2/shared/utils/helpers/date-utils';
import { BadRequestException } from '@nestjs/common';
import { ISectionOptions } from 'docx';
import { IDocumentFactoryProduct, IGetAttachments, IGetDocument, ISaveDocument, ISaveErrorDocument, IUnlinkPaths } from '../../types/document-factory.types';
import { IProductDocumentINSAL } from './document-insal.types';

export class ProductDocumentINSAL implements IDocumentFactoryProduct<IProductDocumentINSAL, DocumentPGRModel> {
  public unlinkPaths: IUnlinkPaths[] = [];
  public type = 'Insalubridade';

  constructor(
    private readonly documentDAO: DocumentDAO,
    private readonly documentVersionRepository: DocumentVersionRepository,
    private readonly donwloadImageService: DownloadImageService,
  ) {}

  public async getData({ documentVersionId, homogeneousGroupsIds }: IProductDocumentINSAL) {
    const document = await this.documentDAO.findDocumentPGR({ documentVersionId, homogeneousGroupsIds });
    if (!document) throw new BadRequestException('Nenhum documento INSALUBRIDADE cadastrado');

    await this.downloadImages(document);

    return document;
  }

  public async getAttachments({ data }: IGetAttachments<IProductDocumentINSAL, DocumentPGRModel>) {
    return [];
  }

  public async getSections({ data, attachments }: IGetDocument<IProductDocumentINSAL, DocumentPGRModel>) {
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

  public async save({ attachments, body, url }: ISaveDocument<IProductDocumentINSAL, DocumentPGRModel>) {
    const documentVersion = new DocumentVersionEntity({
      id: body.documentVersionId,
      status: DocumentVersionStatus.DONE,
      attachments,
      fileUrl: url,
    });

    const document = await this.documentVersionRepository.update(documentVersion);
    return document;
  }

  public async error({ body }: ISaveErrorDocument<IProductDocumentINSAL>) {
    const documentVersion = new DocumentVersionEntity({
      id: body.documentVersionId,
      status: DocumentVersionStatus.ERROR,
      attachments: [],
      fileUrl: null,
    });

    await this.documentVersionRepository.update(documentVersion);
  }

  public getFileName = (data: DocumentPGRModel, type = 'INSAL') => {
    return getDocumentFileName({
      name: data.documentVersion.name || '',
      companyName: data.documentBase.company.indentificationName,
      version: data.documentVersion.version,
      typeName: 'INSALUBRIDADE',
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

    const companyLogoPath = await this.donwloadImageService.download({ imageUrl: company.logoUrl });
    const consultantLogoPath = await this.donwloadImageService.download({ imageUrl: consultant?.logoUrl });
    const workspaceLogoPath = await this.donwloadImageService.download({ imageUrl: workspace?.logoUrl });

    if (companyLogoPath) {
      this.unlinkPaths.push({ path: companyLogoPath });
      company.logoPath = companyLogoPath;
    }
    if (consultantLogoPath && consultant) {
      this.unlinkPaths.push({ path: consultantLogoPath });
      consultant.logoPath = consultantLogoPath;
    }
    if (workspaceLogoPath && workspace) {
      this.unlinkPaths.push({ path: workspaceLogoPath });
      workspace.logoPath = workspaceLogoPath;
    }

    await this.donwloadImageService.downloadBatch({
      images: images,
      getUrl: (image) => image.url,
      callbackFn: async (path, image) => {
        if (path) {
          this.unlinkPaths.push({ path });
          image.path = path;
        }
      },
    });

    const photos = document.homogeneousGroups
      .map((group) => group.characterization?.photos!)
      .flat()
      .filter(Boolean);

    await this.donwloadImageService.downloadBatch({
      images: photos,
      getUrl: (photo) => photo.url,
      callbackFn: async (path, photo) => {
        if (path) {
          this.unlinkPaths.push({ path });
          photo.path = path;
        }
      },
    });
  }
}

