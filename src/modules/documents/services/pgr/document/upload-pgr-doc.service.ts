import { AttachmentEntity } from './../../../../checklist/entities/attachment.entity';
import { APPRTableSection } from './../../../docx/components/tables/appr/appr.section';
import { actionPlanTableSection } from './../../../docx/components/tables/actionPlan/actionPlan.section';
import { RiskFactorGroupDataEntity } from './../../../../checklist/entities/riskGroupData.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ISectionOptions, Packer } from 'docx';
import fs from 'fs';
import { Readable } from 'stream';
import { v4 } from 'uuid';

import { CompanyRepository } from '../../../../../modules/company/repositories/implementations/CompanyRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import {
  downloadImageFile,
  getExtensionFromUrl,
} from '../../../../../shared/utils/downloadImageFile';
import { RiskDocumentEntity } from '../../../../checklist/entities/riskDocument.entity';
import { RiskDocumentRepository } from '../../../../checklist/repositories/implementations/RiskDocumentRepository';
import { RiskGroupDataRepository } from '../../../../checklist/repositories/implementations/RiskGroupDataRepository';
import { CompanyEntity } from '../../../../company/entities/company.entity';
import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { ProfessionalRepository } from '../../../../users/repositories/implementations/ProfessionalRepository';
import { createBaseDocument } from '../../../docx/base/config/document';
import { DocumentBuildPGR } from '../../../docx/builders/pgr/create';
import { UpsertPgrDto } from '../../../dto/pgr.dto';
import { WorkspaceRepository } from './../../../../company/repositories/implementations/WorkspaceRepository';
import {
  hierarchyConverter,
  HierarchyMapData,
  IHierarchyMap,
  IHomoGroupMap,
} from './../../../docx/converter/hierarchy.converter';

@Injectable()
export class PgrUploadService {
  constructor(
    private readonly riskGroupDataRepository: RiskGroupDataRepository,
    private readonly riskDocumentRepository: RiskDocumentRepository,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly amazonStorageProvider: AmazonStorageProvider,
    private readonly hierarchyRepository: HierarchyRepository,
    private readonly professionalRepository: ProfessionalRepository,
    private readonly dayJSProvider: DayJSProvider,
  ) {}
  async execute(upsertPgrDto: UpsertPgrDto, userPayloadDto: UserPayloadDto) {
    const companyId = userPayloadDto.targetCompanyId;
    const workspaceId = upsertPgrDto.workspaceId;

    // eslint-disable-next-line prettier/prettier
    const riskGroupData = await this.riskGroupDataRepository.findAllDataById(upsertPgrDto.riskGroupId, companyId);
    // eslint-disable-next-line prettier/prettier
    const hierarchyHierarchy =  await this.hierarchyRepository.findAllDataHierarchyByCompany(companyId, workspaceId);
    // eslint-disable-next-line prettier/prettier
    const versions = await this.riskDocumentRepository.findByRiskGroupAndCompany(upsertPgrDto.riskGroupId, companyId);

    const workspace = await this.workspaceRepository.findById(workspaceId);
    const company = await this.companyRepository.findByIdAll(
      companyId,
      workspaceId,
      {
        include: {
          address: true,
          environments: {
            include: {
              photos: true,
              homogeneousGroup: {
                include: { riskFactorData: { include: { riskFactor: true } } },
              },
            },
            where: { workspaceId },
          },
          characterization: {
            include: {
              photos: true,
              homogeneousGroup: {
                include: { riskFactorData: { include: { riskFactor: true } } },
              },
            },
            where: { workspaceId },
          },
          professionals: true,
        },
      },
    );

    const logo = company.logoUrl
      ? await downloadImageFile(
          company.logoUrl,
          `tmp/${v4()}.${getExtensionFromUrl(company.logoUrl)}`,
        )
      : '';

    const { environments, characterizations, photosPath } =
      await this.downloadPhotos(company);
    // const environments = [];
    // const characterizations = [];
    // const photosPath = [];

    try {
      const { hierarchyData, homoGroupTree, hierarchyTree } =
        hierarchyConverter(hierarchyHierarchy, environments);

      // const actionPlanUrl = ' ';
      // const urlAPR = ' ';
      const { actionPlanUrl, urlAPR } = await this.generateAttachment(
        riskGroupData,
        hierarchyData,
        hierarchyTree,
        homoGroupTree,
        upsertPgrDto,
      );

      const version = new RiskDocumentEntity({
        version: upsertPgrDto.version,
        description: upsertPgrDto.description,
        validity: riskGroupData.validity,
        approvedBy: riskGroupData.approvedBy,
        revisionBy: riskGroupData.revisionBy,
        created_at: new Date(),
      });

      versions.unshift(version);

      const attachments = [
        new AttachmentEntity({
          name: 'Inventário de Risco por Função (APR)',
          url: urlAPR,
        }),
        new AttachmentEntity({
          name: 'Plano de Ação Detalhado',
          url: actionPlanUrl,
        }),
      ];

      const versionString = `${this.dayJSProvider.format(
        version.created_at,
      )} - REV. ${version.version}`;

      const sections: ISectionOptions[] = new DocumentBuildPGR({
        version: versionString,
        document: riskGroupData,
        attachments,
        logo,
        company,
        workspace,
        versions,
        environments,
        hierarchy: hierarchyData,
        homogeneousGroup: homoGroupTree,
        characterizations,
        hierarchyTree,
      }).build();

      const doc = createBaseDocument(sections);

      const b64string = await Packer.toBase64String(doc);
      const buffer = Buffer.from(b64string, 'base64');
      const fileName = this.getFileName(upsertPgrDto, riskGroupData);

      const url = await this.upload(buffer, fileName, upsertPgrDto);

      await this.riskDocumentRepository.upsert({
        ...upsertPgrDto,
        companyId: company.id,
        fileUrl: url,
        attachments: attachments,
      });

      // return doc;

      [logo, ...photosPath].forEach((path) => path && fs.unlinkSync(path));

      return { buffer, fileName };
    } catch (error) {
      [logo, ...photosPath].forEach((path) => path && fs.unlinkSync(path));
      throw error;
    }
  }

  private async upload(
    fileBuffer: Buffer,
    fileName: string,
    company: Partial<CompanyEntity>,
  ) {
    const stream = Readable.from(fileBuffer);

    const { url } = await this.amazonStorageProvider.upload({
      file: stream,
      fileName: company.id + '/pgr/' + fileName,
      isPublic: true,
    });

    return url;
  }

  private async downloadPhotos(company: Partial<CompanyEntity>) {
    const photosPath = [];
    // return { environments: [], photosPath };
    try {
      const environments = await Promise.all(
        company.environments.map(async (environment) => {
          const photos = await Promise.all(
            environment.photos.map(async (photo) => {
              const path = await downloadImageFile(
                photo.photoUrl,
                `tmp/${v4()}.${getExtensionFromUrl(photo.photoUrl)}`,
              );
              photosPath.push(path);
              return { ...photo, photoUrl: path };
            }),
          );

          return { ...environment, photos };
        }),
      );

      const characterizations = await Promise.all(
        company.characterization.map(async (environment) => {
          const photos = await Promise.all(
            environment.photos.map(async (photo) => {
              const path = await downloadImageFile(
                photo.photoUrl,
                `tmp/${v4()}.${getExtensionFromUrl(photo.photoUrl)}`,
              );
              photosPath.push(path);
              return { ...photo, photoUrl: path };
            }),
          );

          return { ...environment, photos };
        }),
      );
      return { environments, characterizations, photosPath };
    } catch (error) {
      photosPath.forEach((path) => fs.unlinkSync(path));

      throw new InternalServerErrorException(error);
    }
  }

  private async generateAttachment(
    riskGroupData: RiskFactorGroupDataEntity,
    hierarchyData: Map<string, HierarchyMapData>,
    hierarchyTree: IHierarchyMap,
    homoGroupTree: IHomoGroupMap,
    upsertPgrDto: UpsertPgrDto,
  ) {
    // APRs
    const aprSection: ISectionOptions[] = [
      ...APPRTableSection(riskGroupData, hierarchyData, homoGroupTree),
    ];

    const aprDoc = createBaseDocument(aprSection);

    const b64APRstring = await Packer.toBase64String(aprDoc);
    const bufferApr = Buffer.from(b64APRstring, 'base64');

    const fileAprName = this.getFileName(upsertPgrDto, riskGroupData, '--APR');

    const urlAPR = await this.upload(bufferApr, fileAprName, upsertPgrDto);

    // ACTION PLAN
    const actionPlanSections: ISectionOptions[] = [
      actionPlanTableSection(riskGroupData, hierarchyTree),
    ];

    const planDoc = createBaseDocument(actionPlanSections);

    const b64PlanString = await Packer.toBase64String(planDoc);
    const bufferPlan = Buffer.from(b64PlanString, 'base64');

    const filePlanName = this.getFileName(
      upsertPgrDto,
      riskGroupData,
      '-PLANO_DE_ACAO',
    );

    const actionPlanUrl = await this.upload(
      bufferPlan,
      filePlanName,
      upsertPgrDto,
    );

    return { urlAPR, actionPlanUrl };
  }

  private getFileName = (
    upsertPgrDto: UpsertPgrDto,
    riskGroupData: RiskFactorGroupDataEntity,
    typeName = '',
  ) => {
    const docName = upsertPgrDto.name.replace(/\s+/g, '');
    const fileAprName = `${docName.length > 0 ? docName + '-' : ''}${
      riskGroupData.company.name
    }${typeName}-v${upsertPgrDto.version}.docx`
      .normalize('NFD')
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9s_/.!\\={}?()-]/g, '');

    return fileAprName;
  };
}
