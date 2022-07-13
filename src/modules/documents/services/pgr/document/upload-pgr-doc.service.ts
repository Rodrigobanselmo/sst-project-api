import { APPRByGroupTableSection } from './../../../docx/components/tables/apprByGroup/appr-group.section';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ISectionOptions, Packer } from 'docx';
import fs from 'fs';
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
import { AttachmentEntity } from './../../../../checklist/entities/attachment.entity';
import { RiskFactorGroupDataEntity } from './../../../../checklist/entities/riskGroupData.entity';
import { WorkspaceRepository } from './../../../../company/repositories/implementations/WorkspaceRepository';
import { actionPlanTableSection } from './../../../docx/components/tables/actionPlan/actionPlan.section';
import { APPRTableSection } from './../../../docx/components/tables/appr/appr.section';
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

    // console.log(sizeOf(fs.readFileSync(logo)));
    // return;

    // const { environments, characterizations, photosPath } =
    //   await this.downloadPhotos(company);
    const environments = [];
    const characterizations = [];
    const photosPath = [];

    try {
      const { hierarchyData, homoGroupTree, hierarchyTree } =
        hierarchyConverter(hierarchyHierarchy, environments);

      const actionPlanUrl = ' ';
      const urlAPR = ' ';
      const urlGroupAPR = ' ';
      // const { actionPlanUrl, urlAPR,urlGroupAPR } = await this.generateAttachment(
      //   riskGroupData,
      //   hierarchyData,
      //   hierarchyTree,
      //   homoGroupTree,
      //   upsertPgrDto,
      // );

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
          name: 'Inventário de Risco por GSE (APR)',
          url: urlGroupAPR,
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

      // const url = await this.upload(buffer, fileName, upsertPgrDto);

      // await this.riskDocumentRepository.upsert({
      //   ...upsertPgrDto,
      //   companyId: company.id,
      //   fileUrl: url,
      //   attachments: attachments,
      // });

      // return doc; //?remove

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
    const { url } = await this.amazonStorageProvider.upload({
      file: fileBuffer,
      fileName: company.id + '/pgr/' + fileName,
      // isPublic: true,
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
    const save = async (sections: ISectionOptions[], text: string) => {
      const Doc = createBaseDocument(sections);

      const b64string = await Packer.toBase64String(Doc);
      const buffer = Buffer.from(b64string, 'base64');

      const fileName = this.getFileName(upsertPgrDto, riskGroupData, text);

      const url = await this.upload(buffer, fileName, upsertPgrDto);

      return url;
    };

    // APRs
    const aprSection: ISectionOptions[] = [
      ...APPRTableSection(riskGroupData, hierarchyData, homoGroupTree),
    ];

    const urlAPR = await save(aprSection, '--APR');

    const aprGroupSection: ISectionOptions[] = [
      ...APPRByGroupTableSection(
        riskGroupData,
        hierarchyData,
        hierarchyTree,
        homoGroupTree,
      ),
    ];

    const urlGroupAPR = await save(aprGroupSection, '--APR');

    // ACTION PLAN
    const actionPlanSections: ISectionOptions[] = [
      actionPlanTableSection(riskGroupData, hierarchyTree),
    ];

    const actionPlanUrl = await save(actionPlanSections, '--PLANO_DE_ACAO');

    return { urlAPR, urlGroupAPR, actionPlanUrl };
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
