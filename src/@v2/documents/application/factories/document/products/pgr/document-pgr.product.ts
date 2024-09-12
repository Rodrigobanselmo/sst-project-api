import { DocumentBuildPGR } from '@/@v2/documents/application/libs/docx/builders/pgr/create';
import { getDocumentFileName } from '@/@v2/documents/application/libs/docx/helpers/get-document-file-name';
import { DonwloadImageService } from '@/@v2/documents/application/services/donwload-image/donwload-image.service';
import { DocumentDAO } from '@/@v2/documents/database/dao/document/document.dao';
import { DocumentSectionTypeEnum } from '@/@v2/documents/domain/enums/document-section-type.enum';
import { CharacterizationPhotoModel } from '@/@v2/documents/domain/models/characterization-photos.model';
import { DocumentPGRModel } from '@/@v2/documents/domain/models/document-pgr.model';
import { PromiseInfer } from '@/@v2/shared/interfaces/promise-infer.types';
import { dateUtils } from '@/@v2/shared/utils/helpers/date-utils';
import { BadRequestException, Injectable, Scope } from '@nestjs/common';
import { ISectionOptions } from 'docx';
import { v4 } from 'uuid';
import { IDocumentFactoryProduct, IGetAttachments, IGetDocument, ISaveDocument, ISaveErrorDocument, IUnlinkPaths } from '../../types/document-factory.types';
import { IDocumentPGRParams } from './document-pgr.types';
import { getDocumentVersion } from '@/@v2/documents/application/libs/docx/helpers/get-document-version';

@Injectable({ scope: Scope.REQUEST })
export class DocumentPGRFactory implements IDocumentFactoryProduct<IDocumentPGRParams, DocumentPGRModel> {
  public unlinkPaths: IUnlinkPaths[] = [];
  public type = 'PGR';

  constructor(
    protected readonly documentDAO: DocumentDAO,
    protected readonly donwloadImageService: DonwloadImageService
  ) { }

  public async getData({ documentVersionId }: IDocumentPGRParams) {
    const document = await this.documentDAO.findDocumentPGR({ documentVersionId });
    if (!document) throw new BadRequestException('Nenhum documento PGR cadastrado');

    await this.downloadImages(document);

    return document
  }

  public async getAttachments({ data }: IGetAttachments<IDocumentPGRParams, DocumentPGRModel>) {
    const version = this.getVersionName(data);

    const documentAPRSection = new DocumentBuildPGR({
      data: data,
      version: version,
      attachments: [],
      variables: {},
      sections: [{ data: [{ type: DocumentSectionTypeEnum.ACTION_PLAN }] }],
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

    const docId = data.documentVersion.id;
    const companyId = data.documentBase.company.id;
    const id1 = v4();
    const id2 = v4();
    const id3 = v4();

    return [
      {
        section: documentAPRSection,
        type: 'PGR-APR',
        id: id1,
        name: 'Inventário de Risco por Função (APR)',
        link: `${process.env.APP_HOST}/download/pgr/anexos?ref1=${docId}&ref2=${id1}&ref3=${companyId}`,
      },
      {
        section: documentAPRGroupSection,
        type: 'PGR-APR-GSE',
        id: id2,
        name: 'Inventário de Risco por GSE (APR)',
        link: `${process.env.APP_HOST}/download/pgr/anexos?ref1=${docId}&ref2=${id2}&ref3=${companyId}`,
      },
      {
        section: documentActionPlanSection,
        type: 'PGR-PLANO_DE_ACAO',
        id: id3,
        name: 'Plano de Ação Detalhado',
        link: `${process.env.APP_HOST}/download/pgr/anexos?ref1=${docId}&ref2=${id3}&ref3=${companyId}`,
      },
    ];
  }

  public async getSections({ data, attachments }: IGetDocument<IDocumentPGRParams, DocumentPGRModel>) {
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

  public async save({ attachments, body, data, url }: ISaveDocument<IDocumentPGRParams, DocumentPGRModel>) {
    return await this.riskDocumentRepository.upsert({
      id: data.docId,
      status: StatusEnum.DONE,
      fileUrl: url,
      attachments: attachments,
    });
  }

  public async error({ body }: ISaveErrorDocument<IDocumentPGRParams, DocumentPGRModel>,) {
    if (body.documentVersionId)
      await this.riskDocumentRepository.upsert({
        id: body.id,
        status: StatusEnum.ERROR,
      });
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
