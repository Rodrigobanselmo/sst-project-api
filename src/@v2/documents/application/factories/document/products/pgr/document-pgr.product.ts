import { BadRequestException, Injectable, Scope } from '@nestjs/common';
import { ISectionOptions } from 'docx';
import { v4 } from 'uuid';
import { IDocumentFactoryProduct, IUnlinkPaths } from '../../types/document-factory.types';
import { IDocumentPGRParams } from './document-pgr.types';
import { dateUtils } from '@/@v2/shared/utils/helpers/date-utils';
import { DocumentTypeEnum } from '@/@v2/documents/domain/enums/document-type.enum';
import { DocumentBuildPGR } from '@/@v2/documents/application/libs/docx/builders/pgr/create';
import { PromiseInfer } from '@/@v2/shared/interfaces/promise-infer.types';
import { DocumentPGRModel } from '@/@v2/documents/domain/models/document-pgr.model';
import { DocumentDAO } from '@/@v2/documents/database/dao/document/document.dao';

@Injectable({ scope: Scope.REQUEST })
export class DocumentPGRFactory implements IDocumentFactoryProduct<IDocumentPGRParams> {
  public unlinkPaths: IUnlinkPaths[] = [];
  public type = 'PGR';

  constructor(protected readonly documentDAO: DocumentDAO) { }

  public async getData({ documentVersionId }: IDocumentPGRParams) {
    const document = await this.documentDAO.findDocumentPGR({ documentVersionId });
    if (!document) throw new BadRequestException('Nenhum documento PGR cadastrado');

    // const { imagesMap } = await this.downloadImages(images);
    // const { consultantLogo, logo } = await this.downloadLogos(company, consultant);
    // const { characterizations } = await this.downloadCharPhotos(homogeneousGroups);

    return document
  }

  public async getAttachments(data: DocumentPGRModel) {
    const documentBaseBuild = await this.getDocumentBuild(options);

    const documentAprBuild: typeof documentBaseBuild = {
      ...documentBaseBuild,

      attachments: [],
      docSections: {
        sections: [{ data: [{ type: DocumentSectionTypeEnum.APR }] }],
        variables: {},
      },
    } as typeof documentBaseBuild;

    const documentAprGroupBuild: typeof documentBaseBuild = {
      ...documentBaseBuild,
      attachments: [],
      docSections: {
        sections: [{ data: [{ type: DocumentSectionTypeEnum.APR_GROUP }] }],
        variables: {},
      },
    } as typeof documentBaseBuild;

    const documentActionPlanBuild: typeof documentBaseBuild = {
      ...documentBaseBuild,
      attachments: [],
      docSections: {
        sections: [{ data: [{ type: DocumentSectionTypeEnum.ACTION_PLAN }] }],
        variables: {},
      },
    };

    const docId = options.data.docId;
    const companyId = options.data.company.id;
    const id1 = v4();
    const id2 = v4();
    const id3 = v4();

    return [
      {
        buildData: documentAprBuild,
        section: new DocumentBuildPGR(documentAprBuild).build(),
        type: 'PGR-APR',
        id: id1,
        name: 'Inventário de Risco por Função (APR)',
        link: `${process.env.APP_HOST}/download/pgr/anexos?ref1=${docId}&ref2=${id1}&ref3=${companyId}`,
      },
      {
        buildData: documentAprGroupBuild,
        section: new DocumentBuildPGR(documentAprGroupBuild).build(),
        type: 'PGR-APR-GSE',
        id: id2,
        name: 'Inventário de Risco por GSE (APR)',
        link: `${process.env.APP_HOST}/download/pgr/anexos?ref1=${docId}&ref2=${id2}&ref3=${companyId}`,
      },
      {
        buildData: documentActionPlanBuild,
        section: new DocumentBuildPGR(documentActionPlanBuild).build(),
        type: 'PGR-PLANO_DE_ACAO',
        id: id3,
        name: 'Plano de Ação Detalhado',
        link: `${process.env.APP_HOST}/download/pgr/anexos?ref1=${docId}&ref2=${id3}&ref3=${companyId}`,
      },
    ];
  }

  public async getSections(data: DocumentPGRModel) {
    const sections: ISectionOptions[] = new DocumentBuildPGR({ data }).build();

    return sections;
  }

  public async save(
    options: ISaveDocument<IDocumentPGRBody, PromiseInfer<ReturnType<DocumentPGRFactoryProduct['getData']>>>,
  ) {
    const data = options.data;
    const body = options.body;
    const url = options.url;
    const attachments = options.attachments;

    return await this.riskDocumentRepository.upsert({
      id: data.docId,
      companyId: data.company.id,
      fileUrl: url,
      status: StatusEnum.DONE,
      attachments: attachments,
      name: body.name,
      version: body.version,
      documentDataId: body.documentDataId,
      description: body.description,
      workspaceId: body.workspaceId,
      workspaceName: data.workspace.name,
    });
  }

  public async error(
    options: Pick<
      ISaveDocument<IDocumentPGRBody, PromiseInfer<ReturnType<DocumentPGRFactoryProduct['getData']>>>,
      'body'
    >,
  ) {
    const body = options.body;

    if (body.id)
      await this.riskDocumentRepository.upsert({
        id: body.id,
        companyId: body.companyId,
        name: body.name,
        version: body.version,
        documentDataId: body.documentDataId,
        description: body.description,
        workspaceId: body.workspaceId,
        workspaceName: body.workspaceName,
        status: StatusEnum.ERROR,
      });
  }

  public getVersionName = (data: DocumentPGRModel) => {
    if (!data.documentVersion) return `${dateUtils().format('MM_DD_YYYY')}`;
    return `${dateUtils(data.documentVersion.createdAt).format('MM_DD_YYYY')} - REV. ${data.documentVersion.version}`;
  };

  public getFileName = (data: DocumentPGRModel, type = 'PGR') => {
    return getDocxFileName({
      name: info.name,
      companyName: this.company.initials || this.company?.fantasy || this.company.name,
      version: info.version,
      typeName: type,
      date: dateUtils().format('MMMM-YYYY'),
    });
  };

  public async downloadLogos(company: CompanyModel, consultant: CompanyModel) {
    const [logo, consultantLogo] = await this.downloadPathLogoImage(company?.logoUrl, consultant?.logoUrl);

    if (logo) this.unlinkPaths.push({ path: logo, url: company?.logoUrl });
    if (consultantLogo) this.unlinkPaths.push({ path: consultantLogo, url: consultant?.logoUrl });

    return { logo, consultantLogo: consultantLogo || 'images/logo/logo-simple.png' };
  }

  public async downloadPathLogoImage(logoUrl: string, consultLogoUrl: string) {
    const [logo, consultantLogo] = await downloadPathImages([logoUrl, consultLogoUrl]);
    return [logo, consultantLogo];
  }

  public async downloadPathImage(url: string) {
    return downloadPathImage(url);
  }

  public async downloadInlinePathImage(url: string) {
    return downloadPathImage(url);
  }
}