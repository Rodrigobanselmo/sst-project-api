import { FindExamByHierarchyService, filterOriginsByHierarchy } from './../../../../../sst/services/exam/find-by-hierarchy /find-exam-by-hierarchy.service';
import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { ServerlessLambdaProvider } from '../../../../../../shared/providers/ServerlessFunctionsProvider/implementations/ServerlessLambda/ServerlessLambdaProvider';
import { DocumentSectionTypeEnum } from '../../../../docx/builders/pgr/types/section.types';

import { PromiseInfer } from '../../../../../../shared/interfaces/promise-infer.types';
import { AmazonStorageProvider } from '../../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { CompanyRepository } from '../../../../../company/repositories/implementations/CompanyRepository';
import { HierarchyRepository } from '../../../../../company/repositories/implementations/HierarchyRepository';
import { HomoGroupRepository } from '../../../../../company/repositories/implementations/HomoGroupRepository';
import { WorkspaceRepository } from '../../../../../company/repositories/implementations/WorkspaceRepository';
import { RiskDocumentRepository } from '../../../../../sst/repositories/implementations/RiskDocumentRepository';
import { RiskGroupDataRepository } from '../../../../../sst/repositories/implementations/RiskGroupDataRepository';
import { DocumentBuildPGR } from '../../../../docx/builders/pgr/create';
import { DocumentModelRepository } from '../../../../repositories/implementations/DocumentModelRepository';
import { DocumentFactoryAbstractionCreator } from '../../creator/DocumentFactoryCreator';
import { IDocumentFactoryProduct, IGetDocument } from '../../types/IDocumentFactory.types';
import { DocumentPGRFactoryProduct } from './DocumentPGRFactory';
import { IDocumentPGRBody } from './types/pgr.types';
import { DocumentSectionChildrenTypeEnum } from 'src/modules/documents/docx/builders/pgr/types/elements.types';

@Injectable()
export class DocumentPCMSOFactory extends DocumentFactoryAbstractionCreator<IDocumentPGRBody, any> {
  constructor(
    private readonly riskGroupDataRepository: RiskGroupDataRepository,
    private readonly riskDocumentRepository: RiskDocumentRepository,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly homoGroupRepository: HomoGroupRepository,
    private readonly hierarchyRepository: HierarchyRepository,
    private readonly documentModelRepository: DocumentModelRepository,
    private readonly findExamByHierarchyService: FindExamByHierarchyService,
    private readonly storageProvider: AmazonStorageProvider,
    private readonly lambdaProvider: ServerlessLambdaProvider,
  ) {
    super(storageProvider, lambdaProvider);
  }

  public factoryMethod(): IDocumentFactoryProduct {
    return new DocumentPCMSOFactoryProduct(
      this.riskGroupDataRepository,
      this.riskDocumentRepository,
      this.workspaceRepository,
      this.companyRepository,
      this.homoGroupRepository,
      this.hierarchyRepository,
      this.documentModelRepository,
      this.findExamByHierarchyService
    );
  }

  // async upload() {
  //   return { url: ' ', key: ' ' };
  // }

  // async unlinkFiles() {
  //   //
  // }
}

export class DocumentPCMSOFactoryProduct extends DocumentPGRFactoryProduct {
  public type = 'PCMSO';


  // public async error() {
  //   return;
  // }

  // public async downloadLogos() {
  //   return { logo: 'images/logo/logo-main.png', consultantLogo: 'images/logo/logo-simple.png' };
  // }

  // public async downloadPathImage() {
  //   return 'images/mock/placeholder-image.png';
  // }


  constructor(
    protected readonly riskGroupDataRepository: RiskGroupDataRepository,
    protected readonly riskDocumentRepository: RiskDocumentRepository,
    protected readonly workspaceRepository: WorkspaceRepository,
    protected readonly companyRepository: CompanyRepository,
    protected readonly homoGroupRepository: HomoGroupRepository,
    protected readonly hierarchyRepository: HierarchyRepository,
    protected readonly documentModelRepository: DocumentModelRepository,
    protected readonly findExamByHierarchyService: FindExamByHierarchyService,
  ) {
    super(riskGroupDataRepository, riskDocumentRepository, workspaceRepository, companyRepository, homoGroupRepository, hierarchyRepository, documentModelRepository, findExamByHierarchyService);
  }

  public async getData({ companyId, workspaceId, ...body }: IDocumentPGRBody) {
    const allData = await this.getPrgData({ companyId, workspaceId, type: 'PCSMO', ...body })

    return { ...allData }
  }

  public async getAttachments(options: IGetDocument<IDocumentPGRBody, PromiseInfer<ReturnType<DocumentPCMSOFactoryProduct['getData']>>>) {
    const documentBaseBuild = await this.getDocumentBuild(options);


    const documentRiskExamGroupBuild: typeof documentBaseBuild = {
      ...documentBaseBuild,
      attachments: [],
      docSections: {
        sections: [{
          data: [{
            title: 'PCMSO',
            type: DocumentSectionTypeEnum.SECTION, children: [
              {
                type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE,
                text: "Relação de exames por GSE",
              },
              {
                type: DocumentSectionChildrenTypeEnum.TABLE_PCMSO_GHO,
              },
            ]
          }]
        }],
        variables: {}
      }
    } as typeof documentBaseBuild

    const documentRiskExamHierarchyBuild: typeof documentBaseBuild = {
      ...documentBaseBuild,
      attachments: [],
      docSections: {
        sections: [{
          data: [{
            title: 'PCMSO',
            type: DocumentSectionTypeEnum.SECTION, children: [
              {
                type: DocumentSectionChildrenTypeEnum.PARAGRAPH_TABLE,
                text: "Relação de exames por hierarquia",
              },
              {
                type: DocumentSectionChildrenTypeEnum.TABLE_PCMSO_HIERARCHY,
              },
            ]
          }]
        }],
        variables: {}
      }
    } as typeof documentBaseBuild


    const docId = options.data.docId;
    const companyId = options.data.company.id;
    const id1 = v4();
    const id2 = v4();

    return [
      {
        buildData: documentRiskExamGroupBuild,
        section: new DocumentBuildPGR(documentRiskExamGroupBuild).build(),
        type: 'PCMSO-EXAMES',
        id: id1,
        name: 'Relação de exames por GSE',
        link: `${process.env.APP_HOST}/download/pgr/anexos?ref1=${docId}&ref2=${id1}&ref3=${companyId}`,
      },
      {
        buildData: documentRiskExamHierarchyBuild,
        section: new DocumentBuildPGR(documentRiskExamHierarchyBuild).build(),
        type: 'PCMSO-EXAMES-HIERARQUIA',
        id: id2,
        name: 'Relação de exames por hierarquia',
        link: `${process.env.APP_HOST}/download/pgr/anexos?ref1=${docId}&ref2=${id2}&ref3=${companyId}`,
      },
      // {
      //   buildData: documentAprGroupBuild,
      //   section: new DocumentBuildPGR(documentAprGroupBuild).build(),
      //   type: 'PGR-APR-GSE',
      //   id: id2,
      //   name: 'Inventário de Risco por GSE (APR)',
      //   link: `${process.env.APP_HOST}/download/pgr/anexos?ref1=${docId}&ref2=${id2}&ref3=${companyId}`,
      // },
      // {
      //   buildData: documentActionPlanBuild,
      //   section: new DocumentBuildPGR(documentActionPlanBuild).build(),
      //   type: 'PGR-PLANO_DE_ACAO',
      //   id: id3,
      //   name: 'Plano de Ação Detalhado',
      //   link: `${process.env.APP_HOST}/download/pgr/anexos?ref1=${docId}&ref2=${id3}&ref3=${companyId}`,
      // },
    ];
  }

  public async getDocumentBuild(options: IGetDocument<IDocumentPGRBody, PromiseInfer<ReturnType<DocumentPCMSOFactoryProduct['getData']>>>) {
    const docData = await this.getDocumentPgrBuild(options)
    return { ...docData }
  }

}
