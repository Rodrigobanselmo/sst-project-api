import { BadRequestException, Injectable } from '@nestjs/common';
import { CoverTypeEnum, DocumentTypeEnum, HomoTypeEnum, StatusEnum } from '@prisma/client';
import { ISectionOptions } from 'docx';
import { v4 } from 'uuid';
import { asyncBatch } from '../../../../../../shared/utils/asyncBatch';
import { DocumentDataPGRDto } from '../../../../../sst/dto/document-data-pgr.dto';
import { ServerlessLambdaProvider } from './../../../../../../shared/providers/ServerlessFunctionsProvider/implementations/ServerlessLambda/ServerlessLambdaProvider';
import { FindExamByHierarchyService } from './../../../../../sst/services/exam/find-by-hierarchy /find-exam-by-hierarchy.service';
import { DocumentSectionChildrenTypeEnum, IImage } from './../../../../docx/builders/pgr/types/elements.types';
import { DocumentSectionTypeEnum } from './../../../../docx/builders/pgr/types/section.types';
import { parseModelData } from './../../helpers/parseModelData';

import { PromiseInfer } from '../../../../../../shared/interfaces/promise-infer.types';
import { dayjs } from '../../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { AmazonStorageProvider } from '../../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { downloadPathImage, downloadPathImages, getPathImage } from '../../../../../../shared/utils/downloadPathImages';
import { getConsultantCompany } from '../../../../../../shared/utils/getConsultantCompany';
import { getDocxFileName } from '../../../../../../shared/utils/getFileName';
import { getRiskDoc } from '../../../../../../shared/utils/getRiskDoc';
import { isEnvironment } from '../../../../../../shared/utils/isEnvironment';
import { removeDuplicate } from '../../../../../../shared/utils/removeDuplicate';
import { CharacterizationEntity } from '../../../../../company/entities/characterization.entity';
import { CompanyEntity } from '../../../../../company/entities/company.entity';
import { HierarchyEntity } from '../../../../../company/entities/hierarchy.entity';
import { HomoGroupEntity } from '../../../../../company/entities/homoGroup.entity';
import { CompanyRepository } from '../../../../../company/repositories/implementations/CompanyRepository';
import { HierarchyRepository } from '../../../../../company/repositories/implementations/HierarchyRepository';
import { HomoGroupRepository } from '../../../../../company/repositories/implementations/HomoGroupRepository';
import { WorkspaceRepository } from '../../../../../company/repositories/implementations/WorkspaceRepository';
import { RiskDocumentEntity } from '../../../../../sst/entities/riskDocument.entity';
import { RiskDocumentRepository } from '../../../../../sst/repositories/implementations/RiskDocumentRepository';
import { RiskGroupDataRepository } from '../../../../../sst/repositories/implementations/RiskGroupDataRepository';
import { DocumentBuildPGR } from '../../../../docx/builders/pgr/create';
import { hierarchyConverter } from '../../../../docx/converter/hierarchy.converter';
import { DocumentModelRepository } from '../../../../repositories/implementations/DocumentModelRepository';
import { DocumentFactoryAbstractionCreator } from '../../creator/DocumentFactoryCreator';
import {
  IDocumentFactoryProduct,
  IGetDocument,
  IImagesMap,
  ISaveDocument,
  IUnlinkPaths,
} from '../../types/IDocumentFactory.types';
import { IDocumentPGRBody } from './types/pgr.types';
import { DocumentCoverEntity } from '@/modules/company/entities/document-cover.entity';

@Injectable()
export class DocumentPGRFactory extends DocumentFactoryAbstractionCreator<IDocumentPGRBody, any> {
  constructor(
    private readonly riskGroupDataRepository: RiskGroupDataRepository,
    private readonly riskDocumentRepository: RiskDocumentRepository,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly homoGroupRepository: HomoGroupRepository,
    private readonly hierarchyRepository: HierarchyRepository,
    private readonly documentModelRepository: DocumentModelRepository,
    protected readonly findExamByHierarchyService: FindExamByHierarchyService,
    private readonly storageProvider: AmazonStorageProvider,
    private readonly lambdaProvider: ServerlessLambdaProvider,
  ) {
    super(storageProvider, lambdaProvider);
  }

  public factoryMethod(): IDocumentFactoryProduct {
    return new DocumentPGRFactoryProduct(
      this.riskGroupDataRepository,
      this.riskDocumentRepository,
      this.workspaceRepository,
      this.companyRepository,
      this.homoGroupRepository,
      this.hierarchyRepository,
      this.documentModelRepository,
      this.findExamByHierarchyService,
    );
  }
}

export class DocumentPGRFactoryProduct implements IDocumentFactoryProduct {
  public unlinkPaths: IUnlinkPaths[] = [];
  public localCreation = true;
  public type = 'PGR';

  protected company: CompanyEntity;

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
    //
  }

  public async getData({ companyId, workspaceId, ...body }: IDocumentPGRBody) {
    return await this.getPrgData({ companyId, workspaceId, includeCharPhotos: true, ...body });
  }

  protected async getPrgData({
    companyId,
    workspaceId,
    includeCharPhotos = true,
    type = 'PGR',
    ...body
  }: IDocumentPGRBody & { includeCharPhotos?: boolean }) {
    const {
      company,
      riskGroupId,
      workspace,
      riskGroupData,
      hierarchies,
      homogeneousGroups,
      hierarchyData,
      hierarchyHighLevelsData,
      homoGroupTree,
      hierarchyTree,
      characterizations,
      riskMap,
      exams,
    } = await this.getPrgRiskData({ companyId, workspaceId, includeCharPhotos, type, ...body });

    if (company.documentData?.length == 0) throw new BadRequestException('Nenhum documento PGR cadastrado');

    const versionsPromise = this.riskDocumentRepository.findDocumentData(riskGroupId, companyId, DocumentTypeEnum.PGR);
    const modelDataPromise = this.documentModelData(company.documentData[0].modelId, companyId);

    const [versions, modelData] = await Promise.all([versionsPromise, modelDataPromise]);

    const consultant = getConsultantCompany(company);
    const documentData = company?.documentData?.[0];

    this.company = company;
    const model = parseModelData(modelData);

    // const { characterizations } = await this.downloadPhotos(homogeneousGroups);
    const images = removeDuplicate(
      model.sections
        .map((section) =>
          section.data.map(
            (sectionData) =>
              'children' in sectionData &&
              sectionData.children.map((child) => (child.type == DocumentSectionChildrenTypeEnum.IMAGE ? child : null)),
          ),
        )
        .flat(2)
        .filter((i) => i),
      { removeById: 'url' },
    );

    const { imagesMap } = await this.downloadImages(images);

    const version = new RiskDocumentEntity({
      version: body.version,
      description: body.description,
      validity: documentData.validity,
      approvedBy: documentData.approvedBy,
      revisionBy: documentData.revisionBy,
      created_at: new Date(),
    });

    const { consultantLogo, logo } = await this.downloadLogos(company, consultant);

    versions.unshift(version);

    const docId = body.id || v4();
    const cover =
      company?.covers?.[0] ||
      consultant?.covers?.[0] ||
      new DocumentCoverEntity({
        name: 'Capa PGR',
        companyId,
        description: 'Capa padrão do PGR',
        id: 1,
        acceptType: [CoverTypeEnum.PGR, CoverTypeEnum.PCSMO],
        json: {
          coverProps: {
            logoProps: { x: 200, y: 58, maxLogoWidth: 212, maxLogoHeight: 141 },
            titleProps: { x: 103, y: 310, boxX: 464, boxY: 0, size: 28, color: 'FFFFFF' },
            companyProps: { x: 103, y: 510, boxX: 464, boxY: 0, size: 14, color: 'FFFFFF' },
            versionProps: { x: 103, y: 480, boxX: 464, boxY: 0, size: 14, color: 'FFFFFF' },
            backgroundImagePath: 'images/cover/simple.png',
          },
        },
      });

    return {
      company,
      workspace,
      riskGroupData,
      documentData,
      hierarchies,
      homogeneousGroups,
      consultant,
      hierarchyData,
      hierarchyHighLevelsData,
      homoGroupTree,
      hierarchyTree,
      versions,
      docId,
      consultantLogo,
      logo,
      characterizations,
      cover,
      imagesMap,
      modelData: model,
      riskMap,
      exams,
    };
  }

  public async getPrgRiskData({
    companyId,
    workspaceId,
    includeCharPhotos = true,
    type = 'PGR',
    ghoIds,
  }: Pick<IDocumentPGRBody, 'companyId' | 'workspaceId' | 'type' | 'ghoIds'> & { includeCharPhotos?: boolean }) {
    const company = await this.companyRepository.findDocumentData(companyId, { workspaceId, type, ghoIds });
    const riskGroupId = company.riskFactorGroupData?.[0]?.id;

    if (!riskGroupId) throw new BadRequestException('Nenhum sistema de gestão cadastrado');

    const workspacePromise = this.workspaceRepository.findById(workspaceId);
    const riskGroupDataPromise = this.riskGroupDataRepository.findDocumentData(riskGroupId, companyId, {
      workspaceId,
      ghoIds,
    }); // add homo
    const hierarchyPromise = this.hierarchyRepository.findDocumentData(companyId, { workspaceId, ghoIds }); // add homo
    const homogeneousGroupPromise = this.homoGroupRepository.findDocumentData(companyId, {
      workspaceId,
      includePhotos: includeCharPhotos,
      ghoIds,
    });

    const [workspace, riskGroupData, hierarchies, homogeneousGroupsFound] = await Promise.all([
      workspacePromise,
      riskGroupDataPromise,
      hierarchyPromise,
      homogeneousGroupPromise,
    ]);

    const riskMap: Record<string, { name: string }> = {};

    riskGroupData.data = riskGroupData.data.map((riskData) => {
      const homo = homogeneousGroupsFound.find((homo) => homo.id == riskData.homogeneousGroupId);
      const isEnv = isEnvironment(homo.characterization?.type);

      if (!riskMap[riskData.riskId]) riskMap[riskData.riskId] = { name: riskData.riskFactor.name };

      return {
        homogeneousGroup: {
          ...homo,
          ...(homo.characterization &&
            !isEnv && { characterization: { ...homo.characterization, homogeneousGroup: homo } }),
          ...(homo.characterization && isEnv && { environment: { ...homo.characterization, homogeneousGroup: homo } }),
        },
        ...riskData,
      };
    });

    const homogeneousGroups = homogeneousGroupsFound
      .map((h) => ({
        riskFactorData: riskGroupData.data.filter((riskData) => riskData.homogeneousGroupId == h.id) as any,
        ...h,
      }))
      .map((h) => ({
        ...h,
        ...(h.characterization && { characterization: { ...h.characterization, homogeneousGroup: h } }),
        ...(h.characterization &&
          isEnvironment(h.characterization.type) && { environment: { ...h.characterization, homogeneousGroup: h } }),
      }));

    const characterization = homogeneousGroups.filter((i) => i.characterization);
    company.characterization = characterization as any;
    company.environments = characterization as any;

    const { characterizations } = await this.downloadCharPhotos(homogeneousGroups);
    const { hierarchyData, hierarchyHighLevelsData, homoGroupTree, hierarchyTree } = this.getHierarchyData(
      homogeneousGroups,
      hierarchies,
      characterizations,
    );

    riskGroupData.data = riskGroupData.data.filter((riskData) => {
      if (riskData.homogeneousGroup.type == HomoTypeEnum.HIERARCHY) {
        const foundHierarchyDoc = riskData.riskFactor.docInfo.find(
          (doc) => doc.hierarchyId == riskData.homogeneousGroupId,
        );

        if (foundHierarchyDoc) return foundHierarchyDoc.isPGR;
      }

      const isHierarchyPgr = riskData.riskFactor.docInfo.find((riskData) => riskData.hierarchyId && riskData.isPGR);

      const docInfo = getRiskDoc(riskData.riskFactor, { companyId });
      if (docInfo.isPGR || isHierarchyPgr) return true;

      return false;
    });

    const exams = await this.findExamByHierarchyService.execute(
      { targetCompanyId: companyId },
      { getAllExamToRiskWithoutHierarchy: true },
    );

    return {
      company,
      workspace,
      riskGroupData,
      hierarchies,
      homogeneousGroups,
      hierarchyData,
      hierarchyHighLevelsData,
      homoGroupTree,
      hierarchyTree,
      characterizations,
      riskMap,
      exams,
      riskGroupId,
    };
  }

  public async getAttachments(
    options: IGetDocument<IDocumentPGRBody, PromiseInfer<ReturnType<DocumentPGRFactoryProduct['getData']>>>,
  ) {
    const documentBaseBuild = await this.getDocumentBuild(options);

    // add on file text from(JSON.stringify(documentBaseBuild));
    // writeFileSync('tmp/buildData.txt', JSON.stringify(documentBaseBuild));

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

  public async getDocumentBuild(
    options: IGetDocument<IDocumentPGRBody, PromiseInfer<ReturnType<DocumentPGRFactoryProduct['getData']>>>,
  ) {
    return await this.getDocumentPgrBuild(options);
  }

  protected async getDocumentPgrBuild(
    options: IGetDocument<IDocumentPGRBody, PromiseInfer<ReturnType<DocumentPGRFactoryProduct['getData']>>>,
  ) {
    const data = options.data;
    const version = options.version;
    const attachments = options.attachments;
    const imagesMap = options.data?.imagesMap;

    // writeFileSync('tmp/buildData.txt', JSON.stringify({
    //   version,
    //   document: { ...data.riskGroupData, ...data.documentData, ...(data.documentData.json && ((data.documentData as any).json as DocumentDataPGRDto)) },
    //   attachments: attachments.map((attachment) => {
    //     return {
    //       ...attachment,
    //       url: attachment.link,
    //     };
    //   }),
    //   logo: data.logo,
    //   consultantLogo: data.consultantLogo,
    //   company: data.company,
    //   workspace: data.workspace,
    //   versions: data.versions,
    //   environments: data.characterizations,
    //   hierarchy: data.hierarchyData,
    //   homogeneousGroup: data.homoGroupTree,
    //   characterizations: data.characterizations,
    //   hierarchyTree: data.hierarchyTree,
    //   cover: data.cover,
    //   docSections: data.modelData,
    //   imagesMap,
    //   hierarchyHighLevelsData: data.hierarchyHighLevelsData,
    // }));

    return {
      version,
      document: {
        ...data.riskGroupData,
        ...data.documentData,
        ...(data.documentData.json && ((data.documentData as any).json as DocumentDataPGRDto)),
      },
      attachments: attachments.map((attachment) => {
        return {
          ...attachment,
          url: attachment.link,
        };
      }),
      logo: data.logo,
      consultantLogo: data.consultantLogo,
      company: data.company,
      workspace: data.workspace,
      versions: data.versions,
      environments: data.characterizations,
      hierarchy: data.hierarchyData,
      homogeneousGroup: data.homoGroupTree,
      characterizations: data.characterizations,
      hierarchyTree: data.hierarchyTree,
      cover: data.cover,
      docSections: data.modelData,
      imagesMap,
      hierarchyHighLevelsData: data.hierarchyHighLevelsData,
      exams: data.exams.data,
    };
  }

  public async getDocumentSections(
    options: IGetDocument<IDocumentPGRBody, PromiseInfer<ReturnType<DocumentPGRFactoryProduct['getData']>>>,
  ) {
    const sections: ISectionOptions[] = new DocumentBuildPGR(await this.getDocumentBuild(options)).build();

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

  public getVersionName = (data: PromiseInfer<ReturnType<DocumentPGRFactoryProduct['getData']>>) => {
    const version = data.versions?.[0];

    if (!version) return `${dayjs().format('MM_DD_YYYY')}`;
    return `${dayjs(data.versions[0].created_at).format('MM_DD_YYYY')} - REV. ${version.version}`;
  };

  public getFileName = (info: IDocumentPGRBody, type = 'PGR') => {
    return getDocxFileName({
      name: info.name,
      companyName: this.company.initials || this.company?.fantasy || this.company.name,
      version: info.version,
      typeName: type,
      date: dayjs(new Date()).format('MMMM-YYYY'),
    });
  };

  public async downloadLogos(company: CompanyEntity, consultant: CompanyEntity) {
    const [logo, consultantLogo] = await this.downloadPathLogoImage(company?.logoUrl, consultant?.logoUrl);

    if (logo) this.unlinkPaths.push({ path: logo, url: company?.logoUrl });
    if (consultantLogo) this.unlinkPaths.push({ path: consultantLogo, url: consultant?.logoUrl });

    return { logo, consultantLogo: consultantLogo || 'images/logo/logo-simple.png' };
  }

  private getHierarchyData(
    homogeneousGroups: HomoGroupEntity[],
    hierarchies: HierarchyEntity[],
    characterizations: CharacterizationEntity[],
  ) {
    const homoMap: Record<string, HomoGroupEntity> = {};

    homogeneousGroups.forEach((homogeneousGroup) => {
      const isEnv = isEnvironment(homogeneousGroup?.characterization?.type);

      const homo = {
        ...homogeneousGroup,
        characterization: homogeneousGroup?.characterization && !isEnv ? homogeneousGroup.characterization : undefined,
        environment: homogeneousGroup?.characterization && isEnv ? homogeneousGroup.characterization : undefined,
      };
      homoMap[homogeneousGroup.id] = homo;
    });

    const hierarchiesData = hierarchies
      .map((hierarchy) => ({
        ...hierarchy,
        ...(hierarchy.hierarchyOnHomogeneous?.length && {
          hierarchyOnHomogeneous: hierarchy.hierarchyOnHomogeneous.map((hh) => {
            const homogeneousGroup = homoMap[hh.homogeneousGroupId];

            return { ...hh, homogeneousGroup };
          }),
        }),
      }))
      .map((hierarchy) => {
        const hierarchyCopy = { ...hierarchy } as HierarchyEntity;

        if (hierarchy.hierarchyOnHomogeneous)
          hierarchyCopy.homogeneousGroups = hierarchy.hierarchyOnHomogeneous.map((homo) => ({
            ...homo.homogeneousGroup,
            characterization:
              homo.homogeneousGroup?.characterization && !isEnvironment(homo.homogeneousGroup.characterization.type)
                ? homo.homogeneousGroup.characterization
                : undefined,
            environment:
              homo.homogeneousGroup?.environment && isEnvironment(homo.homogeneousGroup.environment.type)
                ? homo.homogeneousGroup.environment
                : undefined,
          }));

        return new HierarchyEntity(hierarchyCopy);
      });

    const { hierarchyData, hierarchyHighLevelsData, homoGroupTree, hierarchyTree } = hierarchyConverter(
      hierarchiesData,
      characterizations,
    );

    return { hierarchyData, hierarchyHighLevelsData, homoGroupTree, hierarchyTree };
  }

  private async downloadCharPhotos(homoGroups: HomoGroupEntity[]) {
    const photosPath: IUnlinkPaths[] = [];
    const characterizations: CharacterizationEntity[] = [];

    const promises = homoGroups
      .filter((homo) => !!homo.characterization || !!homo.environment)
      .map(async (homo) => {
        let photosUrl = (homo.characterization || homo.environment)?.photos;

        if (photosUrl?.length) {
          photosUrl = (
            await Promise.all(
              photosUrl.map(async (photo) => {
                if (!photo.photoUrl) return;

                try {
                  const path = await this.downloadPathImage(photo.photoUrl);

                  if (path) photosPath.push({ path, url: photo.photoUrl });
                  return { ...photo, photoUrl: path };
                } catch (error) {
                  return { ...photo, photoUrl: null };
                }
              }),
            )
          ).filter((photo) => photo.photoUrl);
        }

        characterizations.push({ ...(homo.characterization || homo.environment), photos: photosUrl });
      });

    await asyncBatch(promises, 50, async (promise) => await promise);

    this.unlinkPaths.push(...photosPath);

    return { characterizations };
  }

  private async downloadImages(images: IImage[]) {
    const photosPath: IUnlinkPaths[] = [];
    const imagesMap: IImagesMap = {};

    const promises = images.map(async (image) => {
      if (!image.url) return;

      try {
        const path = await this.downloadInlinePathImage(image.url);
        if (path) photosPath.push({ path, url: image.url });

        imagesMap[image.url] = { path: path || null };
      } catch (error) {
        imagesMap[image.url] = { path: null };
      }
    });

    await asyncBatch(promises, 50, async (promise) => await promise);

    this.unlinkPaths.push(...photosPath);

    return { imagesMap };
  }

  public async downloadPathLogoImage(logoUrl: string, consultLogoUrl: string) {
    if (!this.localCreation) {
      const logo = getPathImage(logoUrl);
      const consultantLogo = getPathImage(consultLogoUrl);

      return [logo, consultantLogo];
    }

    const [logo, consultantLogo] = await downloadPathImages([logoUrl, consultLogoUrl]);
    return [logo, consultantLogo];
  }

  public async downloadPathImage(url: string) {
    if (!this.localCreation) return getPathImage(url);

    return downloadPathImage(url);
  }

  public async downloadInlinePathImage(url: string) {
    if (!this.localCreation) return getPathImage(url);

    return downloadPathImage(url);
  }

  public async documentModelData(id: number, companyId: string) {
    const doc = await this.documentModelRepository.find(
      { id: [id], companyId, all: true, showInactive: true },
      { skip: 0, take: 1 },
      { select: { data: true } },
    );

    const docData = doc.data?.[0]?.dataJson;
    if (!docData) throw new BadRequestException('Modelo não encontrado');

    return doc.data?.[0]?.dataJson;
  }
}
