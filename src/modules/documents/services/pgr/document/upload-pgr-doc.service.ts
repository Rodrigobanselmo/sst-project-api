import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { StatusEnum } from '@prisma/client';
import { ISectionOptions, Packer } from 'docx';
import fs from 'fs';
import { removeDuplicate } from '../../../../../shared/utils/removeDuplicate';
import { v4 } from 'uuid';

import { CompanyRepository } from '../../../../../modules/company/repositories/implementations/CompanyRepository';
import {
  dayjs,
  DayJSProvider,
} from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
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
import { getDocxFileName } from './../../../../../shared/utils/getFileName';
import { AttachmentEntity } from './../../../../checklist/entities/attachment.entity';
import { RiskFactorGroupDataEntity } from './../../../../checklist/entities/riskGroupData.entity';
import { WorkspaceRepository } from './../../../../company/repositories/implementations/WorkspaceRepository';
import { actionPlanTableSection } from './../../../docx/components/tables/actionPlan/actionPlan.section';
import { APPRTableSection } from './../../../docx/components/tables/appr/appr.section';
import { APPRByGroupTableSection } from './../../../docx/components/tables/apprByGroup/appr-group.section';
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
  async execute(upsertPgrDto: UpsertPgrDto) {
    const companyId = upsertPgrDto.companyId;
    const workspaceId = upsertPgrDto.workspaceId;

    console.log('start: query data');
    // eslint-disable-next-line prettier/prettier
    const riskGroupData = await this.riskGroupDataRepository.findAllDataById(upsertPgrDto.riskGroupId, workspaceId, companyId);
    // eslint-disable-next-line prettier/prettier
    const hierarchyHierarchy = (await this.hierarchyRepository.findAllDataHierarchyByCompany(companyId, workspaceId)).map(hierarchy=>({
      ...hierarchy,
      employees: [
        ...hierarchy.employees,
        ...hierarchy.subOfficeEmployees
          ?.map((employee) => {
            return employee?.subOffices?.map((subOffice) => ({
              hierarchyId: subOffice.id,
              ...employee,
            }));
          })
          .reduce((acc, curr) => [...acc, ...curr], []),
      ],
    }));
    // eslint-disable-next-line prettier/prettier
    const versions = (await this.riskDocumentRepository.findByRiskGroupAndCompany(upsertPgrDto.riskGroupId, companyId)).filter(riskDocument => riskDocument.version.includes('.0.0'));

    const workspace = await this.workspaceRepository.findById(workspaceId);
    const company = await this.companyRepository.findByIdAll(
      companyId,
      workspaceId,
      {
        include: {
          primary_activity: true,
          address: true,
          covers: true,
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
              profiles: true,
              homogeneousGroup: {
                include: { riskFactorData: { include: { riskFactor: true } } },
              },
            },
            where: { workspaceId },
          },
          professionals: true,
          receivingServiceContracts: {
            include: {
              applyingServiceCompany: {
                include: { address: true, covers: true },
              },
            },
          },
        },
      },
    );

    const getConsultant = () => {
      if (company.receivingServiceContracts?.length == 1) {
        //! make it work for many contract companies
        return company.receivingServiceContracts[0]?.applyingServiceCompany;
      }

      if (company.receivingServiceContracts?.length > 1) {
        return;
      }
    };

    const consultant = getConsultant();
    const consultantLogo = consultant
      ? await downloadImageFile(
          consultant?.logoUrl,
          `tmp/${v4()}.${getExtensionFromUrl(consultant?.logoUrl)}`,
        )
      : '';

    const logo = company.logoUrl
      ? await downloadImageFile(
          company.logoUrl,
          `tmp/${v4()}.${getExtensionFromUrl(company.logoUrl)}`,
        )
      : '';

    const cover = company?.covers?.[0] || consultant?.covers?.[0];

    console.log('start: photos');
    const { environments, characterizations, photosPath } =
      await this.downloadPhotos(company);
    console.log('end: photos');
    // const environments = [];
    // const characterizations = [];
    // const photosPath = [];

    try {
      const {
        hierarchyData,
        hierarchyHighLevelsData,
        homoGroupTree,
        hierarchyTree,
      } = hierarchyConverter(hierarchyHierarchy, environments, { workspaceId });

      // const actionPlanUrl = ' ';
      // const urlAPR = ' ';
      // const urlGroupAPR = ' ';
      console.log('start: attachment');
      const { actionPlanUrl, urlAPR, urlGroupAPR } =
        await this.generateAttachment(
          riskGroupData,
          hierarchyData,
          hierarchyHighLevelsData,
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

      const docId = upsertPgrDto.id || v4();

      const actionPlanName = 'Plano de Ação Detalhado';

      const attachments = [
        new AttachmentEntity({
          id: v4(),
          name: 'Inventário de Risco por Função (APR)',
          url: urlAPR,
        }),
        new AttachmentEntity({
          id: v4(),
          name: 'Inventário de Risco por GSE (APR)',
          url: urlGroupAPR,
        }),
        new AttachmentEntity({
          id: v4(),
          name: actionPlanName,
          url: actionPlanUrl,
        }),
      ];

      const versionString = `${this.dayJSProvider.format(
        version.created_at,
      )} - REV. ${version.version}`;

      console.log('start: build document');
      const sections: ISectionOptions[] = new DocumentBuildPGR({
        version: versionString,
        document: riskGroupData,
        attachments: attachments.map((attachment) => {
          if (actionPlanName === attachment.name) {
            return {
              ...attachment,
              url: `${process.env.APP_HOST}/dashboard/empresas/${companyId}/${workspaceId}/plano-de-acao/${riskGroupData.id}`,
            };
          }

          return {
            ...attachment,
            url: `${process.env.APP_HOST}/download/pgr/anexos?ref1=${docId}&ref2=${attachment.id}&ref3=${companyId}`,
          };
        }),
        logo,
        consultantLogo,
        company,
        workspace,
        versions,
        environments,
        hierarchy: hierarchyData,
        homogeneousGroup: homoGroupTree,
        characterizations,
        hierarchyTree,
        cover,
      }).build();

      const doc = createBaseDocument(sections);

      const b64string = await Packer.toBase64String(doc);
      const buffer = Buffer.from(b64string, 'base64');

      const fileName = this.getFileName(upsertPgrDto, riskGroupData);

      const url = await this.upload(buffer, fileName, upsertPgrDto);

      await this.riskDocumentRepository.upsert({
        ...upsertPgrDto,
        id: docId,
        companyId: company.id,
        fileUrl: url,
        status: StatusEnum.DONE,
        attachments: attachments,
      });

      // return doc; //?remove

      [logo, consultantLogo, ...photosPath].forEach(
        (path) => path && fs.unlinkSync(path),
      );
      console.log('done: unlink photos');

      return { buffer, fileName };
    } catch (error) {
      [logo, consultantLogo, cover, ...photosPath].forEach(
        (path) => path && fs.unlinkSync(path),
      );
      console.log('error: unlink photos', error);

      if (upsertPgrDto.id)
        await this.riskDocumentRepository.upsert({
          ...upsertPgrDto,
          status: StatusEnum.ERROR,
        });

      throw error;
    }
  }

  private async upload(
    fileBuffer: Buffer,
    fileName: string,
    upsertPgrDto: UpsertPgrDto,
  ) {
    const { url } = await this.amazonStorageProvider.upload({
      file: fileBuffer,
      fileName: upsertPgrDto.companyId + '/pgr/' + fileName,
      // isPublic: true,
    });

    return url;
  }

  private async downloadPhotos(company: Partial<CompanyEntity>) {
    const photosPath = [];

    try {
      const environments = await Promise.all(
        company.environments.map(async (environment) => {
          const photos = (
            await Promise.all(
              environment.photos.map(async (photo) => {
                try {
                  const path = await downloadImageFile(
                    photo.photoUrl,
                    `tmp/${v4()}.${getExtensionFromUrl(photo.photoUrl)}`,
                  );
                  if (path) photosPath.push(path);
                  return { ...photo, photoUrl: path };
                } catch (error) {
                  return { ...photo, photoUrl: null };
                }
              }),
            )
          ).filter((photo) => photo.photoUrl);

          return { ...environment, photos };
        }),
      );

      const characterizations = await Promise.all(
        company.characterization.map(async (environment) => {
          const photos = (
            await Promise.all(
              environment.photos.map(async (photo) => {
                try {
                  const path = await downloadImageFile(
                    photo.photoUrl,
                    `tmp/${v4()}.${getExtensionFromUrl(photo.photoUrl)}`,
                  );
                  if (path) photosPath.push(path);
                  return { ...photo, photoUrl: path };
                } catch (error) {
                  return { ...photo, photoUrl: null };
                }
              }),
            )
          ).filter((photo) => photo.photoUrl);

          return { ...environment, photos };
        }),
      );
      const allChar = removeDuplicate([...characterizations, ...environments], {
        removeById: 'id',
      });

      return {
        environments: allChar,
        characterizations: allChar,
        photosPath,
      };
    } catch (error) {
      console.log('unlink photo on error');
      photosPath.forEach((path) => fs.unlinkSync(path));
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  private async generateAttachment(
    riskGroupData: RiskFactorGroupDataEntity,
    hierarchyData: Map<string, HierarchyMapData>,
    hierarchyHighLevelsData: Map<string, HierarchyMapData>,
    hierarchyTree: IHierarchyMap,
    homoGroupTree: IHomoGroupMap,
    upsertPgrDto: UpsertPgrDto,
  ) {
    // APRs
    const aprSection: ISectionOptions[] = [
      ...APPRTableSection(riskGroupData, hierarchyData, homoGroupTree),
    ];

    const urlAPR = await this.save(
      riskGroupData,
      upsertPgrDto,
      aprSection,
      'PGR-APR',
    );

    // APRs Groups
    const aprGroupSection: ISectionOptions[] = [
      ...APPRByGroupTableSection(
        riskGroupData,
        hierarchyHighLevelsData,
        hierarchyTree,
        homoGroupTree,
      ),
    ];

    const urlGroupAPR = await this.save(
      riskGroupData,
      upsertPgrDto,
      aprGroupSection,
      'PGR-APR-GSE',
    );

    // ACTION PLAN
    const actionPlanSections: ISectionOptions[] = [
      actionPlanTableSection(riskGroupData, hierarchyTree),
    ];

    const actionPlanUrl = await this.save(
      riskGroupData,
      upsertPgrDto,
      actionPlanSections,
      'PGR-PLANO_DE_ACAO',
    );

    return { urlAPR, urlGroupAPR, actionPlanUrl };
  }

  private getFileName = (
    upsertPgrDto: UpsertPgrDto,
    riskGroupData: RiskFactorGroupDataEntity,
    typeName = 'PGR',
  ) => {
    return getDocxFileName({
      name: upsertPgrDto.name,
      companyName:
        (riskGroupData.company?.fantasy || riskGroupData.company.name) +
        (riskGroupData.company.initials
          ? '-' + riskGroupData.company.initials
          : ''),
      version: upsertPgrDto.version,
      typeName,
      date: dayjs(riskGroupData.documentDate || new Date()).format('MMMM-YYYY'),
    });
  };

  private async save(
    riskGroupData: RiskFactorGroupDataEntity,
    upsertPgrDto: UpsertPgrDto,
    sections: ISectionOptions[],
    text: string,
  ) {
    const Doc = createBaseDocument(sections);

    const b64string = await Packer.toBase64String(Doc);
    const buffer = Buffer.from(b64string, 'base64');

    const fileName = this.getFileName(upsertPgrDto, riskGroupData, text);

    const url = await this.upload(buffer, fileName, upsertPgrDto);

    return url;
  }
}
