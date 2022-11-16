import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HomoTypeEnum, StatusEnum } from '@prisma/client';
import { ISectionOptions, Packer } from 'docx';
import fs from 'fs';
import { RiskFactorsEntity } from '../../../../../modules/sst/entities/risk.entity';
import { v4 } from 'uuid';

import { dayjs, DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { downloadImageFile, getExtensionFromUrl } from '../../../../../shared/utils/downloadImageFile';
import { getDocxFileName } from '../../../../../shared/utils/getFileName';
import { removeDuplicate } from '../../../../../shared/utils/removeDuplicate';
import { AttachmentEntity } from '../../../../sst/entities/attachment.entity';
import { RiskDocumentEntity } from '../../../../sst/entities/riskDocument.entity';
import { RiskFactorGroupDataEntity } from '../../../../sst/entities/riskGroupData.entity';
import { RiskDocumentRepository } from '../../../../sst/repositories/implementations/RiskDocumentRepository';
import { RiskGroupDataRepository } from '../../../../sst/repositories/implementations/RiskGroupDataRepository';
import { CompanyEntity } from '../../../../company/entities/company.entity';
import { CompanyRepository } from '../../../../company/repositories/implementations/CompanyRepository';
import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { WorkspaceRepository } from '../../../../company/repositories/implementations/WorkspaceRepository';
import { ProfessionalRepository } from '../../../../users/repositories/implementations/ProfessionalRepository';
import { createBaseDocument } from '../../../docx/base/config/document';
import { DocumentBuildPGR } from '../../../docx/builders/pgr/create';
import { actionPlanTableSection } from '../../../docx/components/tables/actionPlan/actionPlan.section';
import { APPRTableSection } from '../../../docx/components/tables/appr/appr.section';
import { APPRByGroupTableSection } from '../../../docx/components/tables/apprByGroup/appr-group.section';
import { hierarchyConverter, HierarchyMapData, IHierarchyMap, IHomoGroupMap } from '../../../docx/converter/hierarchy.converter';
import { UpsertDocumentDto, UpsertPcmsoDocumentDto } from '../../../dto/pgr.dto';

export const getRiskDoc = (risk: RiskFactorsEntity, { companyId, hierarchyId }: { companyId?: string; hierarchyId?: string }) => {
  if (hierarchyId) {
    const data = risk?.docInfo?.find((i) => i.hierarchyId && i.hierarchyId == hierarchyId);
    if (data) return data;
  }

  if (companyId) {
    const first = risk?.docInfo?.find((i) => !i.hierarchyId && i.companyId === companyId);
    if (first) return first;
  }

  const second = risk?.docInfo?.find((i) => !i.hierarchyId);
  if (second) return second;

  return risk;
};

@Injectable()
export class PcmsoUploadService {
  private attachments_remove: any[] = []; //!

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
  async execute(upsertPgrDto: UpsertPcmsoDocumentDto) {
    this.attachments_remove = []; //!

    const companyId = upsertPgrDto.companyId;
    const workspaceId = upsertPgrDto.workspaceId;
    // throw new Error();
    console.log('start: query data');
    const company = await this.companyRepository.findByIdAll(companyId, workspaceId, {
      include: {
        riskFactorGroupData: true,
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
        // professionals: { include: { councils: true } },
        receivingServiceContracts: {
          include: {
            applyingServiceCompany: {
              include: { address: true, covers: true },
            },
          },
        },
      },
    });

    const riskGroupData = await this.riskGroupDataRepository.findAllDataById(company.riskFactorGroupData[0].id, workspaceId, companyId);

    const hierarchyHierarchy = (await this.hierarchyRepository.findAllDataHierarchyByCompany(companyId, workspaceId)).map((hierarchy) => ({
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

    const versions = (await this.riskDocumentRepository.findByRiskGroupAndCompany(upsertPgrDto.riskGroupId, companyId)).filter((riskDocument) =>
      riskDocument.version.includes('.0.0'),
    );

    const workspace = await this.workspaceRepository.findById(workspaceId);

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
    const consultantLogo = consultant ? await downloadImageFile(consultant?.logoUrl, `tmp/${v4()}.${getExtensionFromUrl(consultant?.logoUrl)}`) : '';

    const logo = company.logoUrl ? await downloadImageFile(company.logoUrl, `tmp/${v4()}.${getExtensionFromUrl(company.logoUrl)}`) : '';

    const cover = company?.covers?.[0] || consultant?.covers?.[0];

    const environments = [];
    const characterizations = [];
    const photosPath = [];

    try {
      const { hierarchyData, hierarchyHighLevelsData, homoGroupTree, hierarchyTree } = hierarchyConverter(hierarchyHierarchy, environments, { workspaceId });

      const actionPlanUrl = ' ';
      // console.log('start: attachment');
      // // const { actionPlanUrl } = await this.generateAttachment(
      // //   riskGroupData,
      // //   hierarchyData,
      // //   hierarchyHighLevelsData,
      // //   hierarchyTree,
      // //   homoGroupTree,
      // //   upsertPgrDto,
      // // );

      // return { buffer: this.attachments_remove[0], fileName: '1.docx' }; //!
      // return { buffer: this.attachments_remove[1], fileName: '2.docx' }; //!
      // return { buffer: this.attachments_remove[2], fileName: '3.docx' }; //!

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

      const attachments = [
        new AttachmentEntity({
          id: v4(),
          name: 'Relatório Analítico',
          url: actionPlanUrl,
        }),
      ];

      const versionString = `${this.dayJSProvider.format(version.created_at)} - REV. ${version.version}`;

      console.log('start: build document');
      const sections: ISectionOptions[] = new DocumentBuildPGR({
        version: versionString,
        document: riskGroupData,
        attachments: attachments.map((attachment) => {
          // if (actionPlanName === attachment.name) {
          //   return {
          //     ...attachment,
          //     url: `${process.env.APP_HOST}/dashboard/empresas/${companyId}/${workspaceId}/plano-de-acao/${riskGroupData.id}`,
          //   };
          // }

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
      console.log('end: build document part 1');

      const doc = createBaseDocument(sections);
      console.log('end: build document part 2');

      const b64string = await Packer.toBase64String(doc);
      const buffer = Buffer.from(b64string, 'base64');
      console.log('end: build document part 3');

      const fileName = this.getFileName(upsertPgrDto, riskGroupData);

      const url = await this.upload(buffer, fileName, upsertPgrDto);

      await this.riskDocumentRepository.upsert({
        id: docId,
        companyId: company.id,
        fileUrl: url,
        status: StatusEnum.DONE,
        attachments: attachments,
        name: upsertPgrDto.name,
        version: upsertPgrDto.version,
        riskGroupId: upsertPgrDto.riskGroupId,
        description: upsertPgrDto.description,
        workspaceId: upsertPgrDto.workspaceId,
        workspaceName: upsertPgrDto.workspaceName,
      });

      // return doc; //?remove

      this.unlinkFiles([logo, consultantLogo, ...photosPath]);
      console.log('done: unlink photos');

      return { buffer, fileName };
    } catch (error) {
      this.unlinkFiles([logo, consultantLogo, ...photosPath]);
      console.log('error: unlink photos', error);

      if (upsertPgrDto.id)
        await this.riskDocumentRepository.upsert({
          ...upsertPgrDto,
          status: StatusEnum.ERROR,
        });

      throw error;
    }
  }

  private async upload(fileBuffer: Buffer, fileName: string, upsertPgrDto: UpsertDocumentDto) {
    const { url } = await this.amazonStorageProvider.upload({
      file: fileBuffer,
      // fileName: upsertPgrDto.companyId + '/pgr/' + fileName,
      fileName: 'temp-files-7-days/' + fileName,
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
                  const path = await downloadImageFile(photo.photoUrl, `tmp/${v4()}.${getExtensionFromUrl(photo.photoUrl)}`);
                  if (path) photosPath.push(path);
                  return { ...photo, photoUrl: path };
                } catch (error) {
                  console.error(error);
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
                  const path = await downloadImageFile(photo.photoUrl, `tmp/${v4()}.${getExtensionFromUrl(photo.photoUrl)}`);
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
      this.unlinkFiles(photosPath);
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  private async generateAttachment(
    riskGroupData: RiskFactorGroupDataEntity,
    hierarchyData: Map<string, HierarchyMapData>,
    hierarchyHighLevelsData: Map<string, HierarchyMapData>,
    hierarchyTree: IHierarchyMap,
    homoGroupTree: IHomoGroupMap,
    upsertPgrDto: UpsertDocumentDto,
  ) {
    // ACTION PLAN
    const actionPlanSections: ISectionOptions[] = [actionPlanTableSection(riskGroupData, hierarchyTree)];

    const actionPlanUrl = await this.save(riskGroupData, upsertPgrDto, actionPlanSections, 'PGR-PLANO_DE_ACAO');

    return { actionPlanUrl };
  }

  private getFileName = (upsertPgrDto: UpsertDocumentDto, riskGroupData: RiskFactorGroupDataEntity, typeName = 'PGR') => {
    return getDocxFileName({
      name: upsertPgrDto.name,
      companyName: (riskGroupData.company?.fantasy || riskGroupData.company.name) + (riskGroupData.company.initials ? '-' + riskGroupData.company.initials : ''),
      version: upsertPgrDto.version,
      typeName,
      date: dayjs(riskGroupData.documentDate || new Date()).format('MMMM-YYYY'),
    });
  };

  private async save(riskGroupData: RiskFactorGroupDataEntity, upsertPgrDto: UpsertDocumentDto, sections: ISectionOptions[], text: string) {
    const Doc = createBaseDocument(sections);

    const b64string = await Packer.toBase64String(Doc);
    const buffer = Buffer.from(b64string, 'base64');

    this.attachments_remove.push(buffer); //!

    const fileName = this.getFileName(upsertPgrDto, riskGroupData, text);

    const url = await this.upload(buffer, fileName, upsertPgrDto);

    return url;
  }

  private async unlinkFiles(paths: string[]) {
    paths
      .filter((i) => !!i && typeof i == 'string')
      .forEach((path) => {
        try {
          console.log('paths', path);
          fs.unlinkSync(path);
        } catch (e) {}
      });
  }
}
