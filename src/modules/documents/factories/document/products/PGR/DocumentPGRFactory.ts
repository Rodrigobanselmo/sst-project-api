import { parseModelData } from './../../helpers/parseModelData';
import { IDocumentPGRSectionGroups, IDocVariables } from './../../../../docx/builders/pgr/types/section.types';
import { IDocumentModelData } from './../../../../types/document-mode.types';
import { DocumentDataPGRDto } from '../../../../../sst/dto/document-data-pgr.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DocumentTypeEnum, HomoTypeEnum, StatusEnum } from '@prisma/client';
import { ISectionOptions } from 'docx';
import { asyncBatch } from '../../../../../../shared/utils/asyncBatch';
import { v4 } from 'uuid';

import { actionPlanTableSection } from '../../../../docx/components/tables/actionPlan/actionPlan.section';
import { APPRByGroupTableSection } from '../../../../docx/components/tables/apprByGroup/appr-group.section';
import { dayjs } from '../../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { DocumentFactoryAbstractionCreator } from '../../creator/DocumentFactoryCreator';
import { IDocumentFactoryProduct as IDocumentFactoryProduct } from '../../types/IDocumentFactory.types';
import { PromiseInfer } from '../../../../../../shared/interfaces/promise-infer.types';
import { AmazonStorageProvider } from '../../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { downloadPathImage, downloadPathImages } from '../../../../../../shared/utils/downloadPathImages';
import { getConsultantCompany } from '../../../../../../shared/utils/getConsultantCompany';
import { getDocxFileName } from '../../../../../../shared/utils/getFileName';
import { getRiskDoc } from '../../../../../../shared/utils/getRiskDoc';
import { CharacterizationEntity } from '../../../../../company/entities/characterization.entity';
import { CompanyEntity } from '../../../../../company/entities/company.entity';
import { HierarchyEntity } from '../../../../../company/entities/hierarchy.entity';
import { HomoGroupEntity } from '../../../../../company/entities/homoGroup.entity';
import { isEnvironment } from '../../../../../company/repositories/implementations/CharacterizationRepository';
import { CompanyRepository } from '../../../../../company/repositories/implementations/CompanyRepository';
import { HierarchyRepository } from '../../../../../company/repositories/implementations/HierarchyRepository';
import { HomoGroupRepository } from '../../../../../company/repositories/implementations/HomoGroupRepository';
import { WorkspaceRepository } from '../../../../../company/repositories/implementations/WorkspaceRepository';
import { RiskDocumentEntity } from '../../../../../sst/entities/riskDocument.entity';
import { RiskDocumentRepository } from '../../../../../sst/repositories/implementations/RiskDocumentRepository';
import { RiskGroupDataRepository } from '../../../../../sst/repositories/implementations/RiskGroupDataRepository';
import { DocumentBuildPGR } from '../../../../docx/builders/pgr/create';
import { APPRTableSection } from '../../../../docx/components/tables/appr/appr.section';
import { hierarchyConverter } from '../../../../docx/converter/hierarchy.converter';
import { IGetDocument, ISaveDocument } from '../../types/IDocumentFactory.types';
import { IDocumentPGRBody } from './types/pgr.types';
import { DocumentModelRepository } from '../../../../repositories/implementations/DocumentModelRepository';

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
    private readonly storageProvider: AmazonStorageProvider,
  ) {
    super(storageProvider);
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
    );
  }
}

export class DocumentPGRFactoryProduct implements IDocumentFactoryProduct {
  public unlinkPaths = [];
  private company: CompanyEntity;

  constructor(
    protected readonly riskGroupDataRepository: RiskGroupDataRepository,
    protected readonly riskDocumentRepository: RiskDocumentRepository,
    protected readonly workspaceRepository: WorkspaceRepository,
    protected readonly companyRepository: CompanyRepository,
    protected readonly homoGroupRepository: HomoGroupRepository,
    protected readonly hierarchyRepository: HierarchyRepository,
    protected readonly documentModelRepository: DocumentModelRepository,
  ) {
    //
  }

  public async getData({ companyId, workspaceId, ...body }: IDocumentPGRBody) {
    const company = await this.companyRepository.findDocumentData(companyId, { workspaceId, type: 'PGR' });
    const riskGroupId = company.riskFactorGroupData?.[0]?.id;

    if (company.documentData?.length == 0) throw new BadRequestException('Nenhum documento PGR cadastrado');
    if (!riskGroupId) throw new BadRequestException('Nenhum sistema de gestão cadastrado');

    const workspacePromise = this.workspaceRepository.findById(workspaceId);
    const riskGroupDataPromise = this.riskGroupDataRepository.findDocumentData(riskGroupId, companyId, { workspaceId }); // add homo
    const hierarchyPromise = this.hierarchyRepository.findDocumentData(companyId, { workspaceId }); // add homo
    const homogeneousGroupPromise = this.homoGroupRepository.findDocumentData(companyId, { workspaceId });
    const versionsPromise = this.riskDocumentRepository.findDocumentData(riskGroupId, companyId, DocumentTypeEnum.PGR);
    const modelDataPromise = this.documentModelData(company.documentData[0].modelId, companyId);

    const [workspace, riskGroupData, hierarchies, homogeneousGroupsFound, versions, modelData] = await Promise.all([
      workspacePromise,
      riskGroupDataPromise,
      hierarchyPromise,
      homogeneousGroupPromise,
      versionsPromise,
      modelDataPromise,
    ]);

    riskGroupData.data = riskGroupData.data.map((riskData) => {
      const homo = homogeneousGroupsFound.find((homo) => homo.id == riskData.homogeneousGroupId);
      return {
        homogeneousGroup: {
          ...homo,
          ...(homo.characterization && !isEnvironment(homo.characterization.type) && { characterization: { ...homo.characterization, homogeneousGroup: homo } }),
          ...(homo.characterization &&
            isEnvironment(homo.characterization.type) && { characterization: null, environment: { ...homo.characterization, homogeneousGroup: homo } }),
        },
        ...riskData,
      };
    });

    const homogeneousGroups = homogeneousGroupsFound
      .map((h) => ({ riskFactorData: riskGroupData.data.filter((riskData) => riskData.homogeneousGroupId == h.id) as any, ...h }))
      .map((h) => ({ ...h, ...(h.characterization && { characterization: { ...h.characterization, homogeneousGroup: h } }) }));

    const characterization = homogeneousGroups.filter((i) => i.characterization);
    company.characterization = characterization as any;
    company.environments = characterization as any;

    const consultant = getConsultantCompany(company);
    const documentData = company?.documentData?.[0];

    this.company = company;

    const { characterizations } = await this.downloadPhotos(homogeneousGroups);
    const { hierarchyData, hierarchyHighLevelsData, homoGroupTree, hierarchyTree } = this.getHierarchyData(homogeneousGroups, hierarchies, characterizations);

    riskGroupData.data = riskGroupData.data.filter((riskData) => {
      if (riskData.homogeneousGroup.type == HomoTypeEnum.HIERARCHY) {
        const foundHierarchyDoc = riskData.riskFactor.docInfo.find((doc) => doc.hierarchyId == riskData.homogeneousGroupId);

        if (foundHierarchyDoc) return foundHierarchyDoc.isPGR;
      }

      const isHierarchyPgr = riskData.riskFactor.docInfo.find((riskData) => riskData.hierarchyId && riskData.isPGR);

      const docInfo = getRiskDoc(riskData.riskFactor, { companyId });
      if (docInfo.isPGR || isHierarchyPgr) return true;

      return false;
    });

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
    const cover = company?.covers?.[0] || consultant?.covers?.[0];

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
      modelData: parseModelData(modelData),
    };
  }

  public async getAttachments(data: PromiseInfer<ReturnType<DocumentPGRFactoryProduct['getData']>>) {
    // APRs
    const aprSection: ISectionOptions[] = [
      ...APPRTableSection(
        { ...data.riskGroupData, ...data.documentData, ...(data.documentData.json && ((data.documentData as any).json as DocumentDataPGRDto)) },
        data.hierarchyData,
        data.homoGroupTree,
      ),
    ];

    // APRs Groups
    const aprGroupSection: ISectionOptions[] = [
      ...APPRByGroupTableSection(
        { ...data.riskGroupData, ...data.documentData, ...(data.documentData.json && ((data.documentData as any).json as DocumentDataPGRDto)) },
        data.hierarchyHighLevelsData,
        data.hierarchyTree,
        data.homoGroupTree,
      ),
    ];

    // ACTION PLAN
    const actionPlanSections: ISectionOptions[] = [
      actionPlanTableSection(
        { ...data.riskGroupData, ...data.documentData, ...(data.documentData.json && ((data.documentData as any).json as DocumentDataPGRDto)) },
        data.hierarchyTree,
      ),
    ];

    const docId = data.docId;
    const companyId = data.company.id;
    const id1 = v4();
    const id2 = v4();
    const id3 = v4();

    return [
      {
        section: aprSection,
        type: 'PGR-APR',
        id: id1,
        name: 'Inventário de Risco por Função (APR)',
        link: `${process.env.APP_HOST}/download/pgr/anexos?ref1=${docId}&ref2=${id1}&ref3=${companyId}`,
      },
      {
        section: aprGroupSection,
        type: 'PGR-APR-GSE',
        id: id2,
        name: 'Inventário de Risco por GSE (APR)',
        link: `${process.env.APP_HOST}/download/pgr/anexos?ref1=${docId}&ref2=${id2}&ref3=${companyId}`,
      },
      {
        section: actionPlanSections,
        type: 'PGR-PLANO_DE_ACAO',
        id: id3,
        name: 'Plano de Ação Detalhado',
        link: `${process.env.APP_HOST}/download/pgr/anexos?ref1=${docId}&ref2=${id3}&ref3=${companyId}`,
      },
    ];
  }

  public async getDocument(options: IGetDocument<IDocumentPGRBody, PromiseInfer<ReturnType<DocumentPGRFactoryProduct['getData']>>>) {
    const data = options.data;
    const version = options.version;
    const attachments = options.attachments;

    const sections: ISectionOptions[] = new DocumentBuildPGR({
      version,
      document: { ...data.riskGroupData, ...data.documentData, ...(data.documentData.json && ((data.documentData as any).json as DocumentDataPGRDto)) },
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
    }).build();

    return sections;
  }

  public async save(options: ISaveDocument<IDocumentPGRBody, PromiseInfer<ReturnType<DocumentPGRFactoryProduct['getData']>>>) {
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

  public async error(options: Pick<ISaveDocument<IDocumentPGRBody, PromiseInfer<ReturnType<DocumentPGRFactoryProduct['getData']>>>, 'body'>) {
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

  public getFileName = (info: IDocumentPGRBody, type: string) => {
    return getDocxFileName({
      name: info.name,
      companyName: this.company.initials || this.company?.fantasy || this.company.name,
      version: info.version,
      typeName: type || 'PGR',
      date: dayjs(new Date()).format('MMMM-YYYY'),
    });
  };

  public async downloadLogos(company: CompanyEntity, consultant: CompanyEntity) {
    const [logo, consultantLogo] = await downloadPathImages([company?.logoUrl, consultant?.logoUrl]);

    if (logo) this.unlinkPaths.push(logo);
    if (consultantLogo) this.unlinkPaths.push(consultantLogo);

    return { logo, consultantLogo };
  }

  private getHierarchyData(homogeneousGroups: HomoGroupEntity[], hierarchies: HierarchyEntity[], characterizations: CharacterizationEntity[]) {
    const homoMap: Record<string, HomoGroupEntity> = {};

    homogeneousGroups.forEach((homogeneousGroup) => {
      const homo = {
        ...homogeneousGroup,
        characterization: homogeneousGroup?.characterization && !isEnvironment(homogeneousGroup.characterization.type) ? homogeneousGroup.characterization : undefined,
        environment: homogeneousGroup?.characterization && isEnvironment(homogeneousGroup.characterization.type) ? homogeneousGroup.characterization : undefined,
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
              homo.homogeneousGroup?.characterization && !isEnvironment(homo.homogeneousGroup.characterization.type) ? homo.homogeneousGroup.characterization : undefined,
            environment:
              homo.homogeneousGroup?.characterization && isEnvironment(homo.homogeneousGroup.characterization.type) ? homo.homogeneousGroup.characterization : undefined,
          }));

        return new HierarchyEntity(hierarchyCopy);
      });

    const { hierarchyData, hierarchyHighLevelsData, homoGroupTree, hierarchyTree } = hierarchyConverter(hierarchiesData, characterizations);

    return { hierarchyData, hierarchyHighLevelsData, homoGroupTree, hierarchyTree };
  }

  private async downloadPhotos(homoGroups: HomoGroupEntity[]) {
    const photosPath: string[] = [];
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
                  if (path) photosPath.push(path);
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

  public async downloadPathImage(url: string) {
    return downloadPathImage(url);
  }

  public async documentModelData(id: number, companyId: string) {
    const doc = await this.documentModelRepository.find({ id: [id], companyId, all: true, showInactive: true }, { skip: 0, take: 1 }, { select: { data: true } });

    const docData = doc.data?.[0]?.dataJson;
    if (!docData) throw new BadRequestException('Modelo não encontrado');

    return doc.data?.[0]?.dataJson;
  }
}
