import { WorkspaceRepository } from './../../../../company/repositories/implementations/WorkspaceRepository';
import { DocumentBuildPGR } from '../../../docx/builders/pgr/create';
import { Injectable } from '@nestjs/common';
import { ISectionOptions, Packer } from 'docx';
import fs from 'fs';
import { Readable } from 'stream';
import { v4 } from 'uuid';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import {
  downloadImageFile,
  getExtensionFromUrl,
} from '../../../../../shared/utils/downloadImageFile';
import { RiskDocumentRepository } from '../../../../checklist/repositories/implementations/RiskDocumentRepository';
import { RiskGroupDataRepository } from '../../../../checklist/repositories/implementations/RiskGroupDataRepository';
import { CompanyEntity } from '../../../../company/entities/company.entity';
import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { createBaseDocument } from '../../../docx/base/config/document';
import { UpsertPgrDto } from '../../../dto/pgr.dto';
import { CompanyRepository } from '../../../../../modules/company/repositories/implementations/CompanyRepository';
import { RiskDocumentEntity } from '../../../../checklist/entities/riskDocument.entity';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { ProfessionalRepository } from '../../../../users/repositories/implementations/ProfessionalRepository';

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
    // const hierarchyHierarchy =  await this.hierarchyRepository.findAllDataHierarchyByCompany(companyId, workspaceId);
    // eslint-disable-next-line prettier/prettier
    const versions = await this.riskDocumentRepository.findByRiskGroupAndCompany(upsertPgrDto.riskGroupId, companyId);


    const workspace = await this.workspaceRepository.findById(workspaceId);
    const company = await this.companyRepository.findById(companyId);
    // eslint-disable-next-line prettier/prettier
    const professionals = await this.professionalRepository.findByCompanyId(companyId);

    // const { hierarchyData, homoGroupTree } =
    //   hierarchyConverter(hierarchyHierarchy);

    const version = new RiskDocumentEntity({
      version: upsertPgrDto.version,
      description: upsertPgrDto.description,
      validity: riskGroupData.validity,
      approvedBy: riskGroupData.approvedBy,
      revisionBy: riskGroupData.revisionBy,
      created_at: new Date(),
    });

    versions.push(version);

    const url =
      'https://prod-simplesst-docs.s3.amazonaws.com/b8635456-334e-4d6e-ac43-cfe5663aee17/environment/dcf93c91-815a-4b12-8a68-a6f39d86711b.png';

    const example_image_1 = await downloadImageFile(
      url,
      `tmp/${v4()}.${getExtensionFromUrl(url)}`,
    );

    const versionString = `${this.dayJSProvider.format(
      version.created_at,
    )} - REV. ${version.version}`;

    const sections: ISectionOptions[] = new DocumentBuildPGR({
      version: versionString,
      logo: example_image_1,
      company,
      workspace,
      versions,
      professionals,
    }).build();

    const doc = createBaseDocument(sections);

    fs.unlinkSync(example_image_1);

    const b64string = await Packer.toBase64String(doc);
    const buffer = Buffer.from(b64string, 'base64');

    const fileName = 'delete.docx';

    return { buffer, fileName };
  }

  private async upload(
    fileBuffer: Buffer,
    fileName: string,
    upsertPgrDto: UpsertPgrDto,
    company: Partial<CompanyEntity>,
  ) {
    const stream = Readable.from(fileBuffer);

    const { url } = await this.amazonStorageProvider.upload({
      file: stream,
      fileName: company.id + '/pgr/' + fileName,
    });

    const doc = await this.riskDocumentRepository.upsert({
      ...upsertPgrDto,
      companyId: company.id,
      fileUrl: url,
    });

    return doc;
  }
}
