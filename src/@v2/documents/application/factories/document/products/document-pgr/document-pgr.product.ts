import { DocumentBuildPGR } from '@/@v2/documents/application/libs/docx/builders/pgr/create';
import { getDocumentFileName } from '@/@v2/documents/application/libs/docx/helpers/get-document-file-name';
import { getDocumentVersion } from '@/@v2/documents/application/libs/docx/helpers/get-document-version';
import { DonwloadImageService } from '@/@v2/documents/application/services/donwload-image/donwload-image.service';
import { DocumentDAO } from '@/@v2/documents/database/dao/document/document.dao';
import { DocumentVersionRepository } from '@/@v2/documents/database/repositories/document-version/document-version.repository';
import { DocumentVersionEntity } from '@/@v2/documents/domain/entities/document-version.entity';
import { DocumentSectionTypeEnum } from '@/@v2/documents/domain/enums/document-section-type.enum';
import { AttachmentModel } from '@/@v2/documents/domain/models/attachment.model';
import { CharacterizationPhotoModel } from '@/@v2/documents/domain/models/characterization-photos.model';
import { DocumentPGRModel } from '@/@v2/documents/domain/models/document-pgr.model';
import { DocumentVersionStatus } from '@/@v2/shared/domain/enum/documents/document-version-status';
import { dateUtils } from '@/@v2/shared/utils/helpers/date-utils';
import { BadRequestException } from '@nestjs/common';
import { ISectionOptions } from 'docx';
import { v4 } from 'uuid';
import { IDocumentFactoryProduct, IGetAttachments, IGetDocument, ISaveDocument, ISaveErrorDocument, IUnlinkPaths } from '../../types/document-factory.types';
import { IProductDocumentPGR } from './document-pgr.types';

export class ProductDocumentPGR implements IDocumentFactoryProduct<IProductDocumentPGR, DocumentPGRModel> {
  public unlinkPaths: IUnlinkPaths[] = [];
  public type = 'PGR';

  constructor(
    private readonly documentDAO: DocumentDAO,
    private readonly documentVersionRepository: DocumentVersionRepository,
    private readonly donwloadImageService: DonwloadImageService
  ) { }

  public async getData({ documentVersionId }: IProductDocumentPGR) {
    const document = await this.documentDAO.findDocumentPGR({ documentVersionId });
    if (!document) throw new BadRequestException('Nenhum documento PGR cadastrado');

    await this.downloadImages(document);

    return document
  }

  public async getAttachments({ data }: IGetAttachments<IProductDocumentPGR, DocumentPGRModel>) {
    const version = this.getVersionName(data);

    const documentAPRSection = new DocumentBuildPGR({
      data: data,
      version: version,
      attachments: [],
      variables: {},
      sections: [{ data: [{ type: DocumentSectionTypeEnum.APR }] }],
    }).build();

    const documentAPRGroupSection = new DocumentBuildPGR({
      data: data,
      version: version,
      attachments: [],
      variables: {},
      sections: [{ data: [{ type: DocumentSectionTypeEnum.APR_GROUP }] }],
    }).build();

    const documentActionPlanSection = new DocumentBuildPGR({
      data: data,
      version: version,
      attachments: [],
      variables: {},
      sections: [{ data: [{ type: DocumentSectionTypeEnum.ACTION_PLAN }] }],
    }).build();

    const docVersionId = data.documentVersion.id;
    const companyId = data.documentBase.company.id;
    const id1 = v4();
    const id2 = v4();
    const id3 = v4();

    return [
      {
        id: id1,
        section: documentAPRSection,
        model: new AttachmentModel({
          name: 'Inventário de Risco por Função (APR)',
          link: `${process.env.APP_HOST}/download/pgr/anexos?ref1=${docVersionId}&ref2=${id1}&ref3=${companyId}`,
          type: 'PGR-APR',
        }),
      },
      {
        id: id2,
        section: documentAPRGroupSection,
        model: new AttachmentModel({
          type: 'PGR-APR-GSE',
          name: 'Inventário de Risco por GSE (APR)',
          link: `${process.env.APP_HOST}/download/pgr/anexos?ref1=${docVersionId}&ref2=${id2}&ref3=${companyId}`,
        }),
      },
      {
        id: id3,
        section: documentActionPlanSection,
        model: new AttachmentModel({
          type: 'PGR-PLANO_DE_ACAO',
          name: 'Plano de Ação Detalhado',
          link: `${process.env.APP_HOST}/download/pgr/anexos?ref1=${docVersionId}&ref2=${id3}&ref3=${companyId}`,
        }),
      },
    ];
  }

  public async getSections({ data, attachments }: IGetDocument<IProductDocumentPGR, DocumentPGRModel>) {
    const version = this.getVersionName(data);

    const sections: ISectionOptions[] = new DocumentBuildPGR({
      data: data,
      version: version,
      attachments,
      sections: data.model.sections,
      variables: data.model.variables,
    }).build();

    return sections;
  }

  public async save({ attachments, body, url }: ISaveDocument<IProductDocumentPGR, DocumentPGRModel>) {
    const documentVersion = new DocumentVersionEntity({
      id: body.documentVersionId,
      status: DocumentVersionStatus.DONE,
      attachments,
      fileUrl: url,
    })

    const document = await this.documentVersionRepository.update(documentVersion);
    return document
  }

  public async error({ body }: ISaveErrorDocument<IProductDocumentPGR>,) {
    const documentVersion = new DocumentVersionEntity({
      id: body.documentVersionId,
      status: DocumentVersionStatus.ERROR,
      attachments: [],
      fileUrl: null,
    })

    await this.documentVersionRepository.update(documentVersion);
  }

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
    return getDocumentVersion(data.documentVersion)
  };

  private async downloadImages(document: DocumentPGRModel) {
    const images = document.model.images;
    const company = document.documentBase.company;
    const consultant = document.documentBase.company.consultant;

    const companyLogoPath = await this.donwloadImageService.donwload({ imageUrl: company.logoUrl })
    const consultantLogoPath = await this.donwloadImageService.donwload({ imageUrl: consultant?.logoUrl })

    if (companyLogoPath) {
      this.unlinkPaths.push({ path: companyLogoPath })
      company.logoPath = companyLogoPath;
    };
    if (consultantLogoPath && consultant) {
      this.unlinkPaths.push({ path: consultantLogoPath })
      consultant.logoPath = consultantLogoPath
    };

    await this.donwloadImageService.donwloadBatch({
      images: images,
      getUrl: (image) => image.url,
      callbackFn: async (path, image) => {
        if (path) {
          this.unlinkPaths.push({ path });
          image.path = path;
        }
      },
    })

    const photos = document.homogeneousGroups.map((group) => group.characterization?.photos).flat().filter(Boolean) as CharacterizationPhotoModel[];
    await this.donwloadImageService.donwloadBatch({
      images: photos,
      getUrl: (photo) => photo.url,
      callbackFn: async (path, photo) => {
        if (path) {
          this.unlinkPaths.push({ path });
          photo.path = path;
        }
      },
    })
  }
}
