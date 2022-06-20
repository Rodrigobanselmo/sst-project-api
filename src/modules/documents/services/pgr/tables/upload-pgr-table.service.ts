import { Injectable } from '@nestjs/common';
import { ISectionOptions, Packer } from 'docx';
import { Readable } from 'stream';

import { RiskDocumentRepository } from '../../../../../modules/checklist/repositories/implementations/RiskDocumentRepository';
import { RiskGroupDataRepository } from '../../../../../modules/checklist/repositories/implementations/RiskGroupDataRepository';
import { CompanyEntity } from '../../../../../modules/company/entities/company.entity';
import { HierarchyRepository } from '../../../../../modules/company/repositories/implementations/HierarchyRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { UpsertPgrDto } from '../../../dto/pgr.dto';
import { createBaseDocument } from '../../../docx/base/document';
import { hierarchyConverter } from '../../../docx/sections/converter/hierarchy.converter';
import { actionPlanTableSection } from '../../../docx/sections/tables/actionPlan/actionPlan.section';
import { hierarchyPlanTableSection } from '../../../docx/sections/tables/hierarchyOrg/hierarchyPlan.section';
import { hierarchyPrioritizationTableSections } from '../../../docx/sections/tables/hierarchyPrioritization/hierarchyPrioritization.section';
import { hierarchyRisksTableSections } from '../../../docx/sections/tables/hierarchyRisks/hierarchyRisks.section';
import { riskCharacterizationTableSection } from '../../../docx/sections/tables/riskCharacterization/riskCharacterization.section';
import { riskInventoryTableSection } from '../../../docx/sections/tables/riskInventory/riskInventory.section';

@Injectable()
export class PgrUploadTableService {
  constructor(
    private readonly riskGroupDataRepository: RiskGroupDataRepository,
    private readonly riskDocumentRepository: RiskDocumentRepository,
    private readonly amazonStorageProvider: AmazonStorageProvider,
    private readonly hierarchyRepository: HierarchyRepository,
  ) {}
  async execute(upsertPgrDto: UpsertPgrDto, userPayloadDto: UserPayloadDto) {
    const companyId = userPayloadDto.targetCompanyId;
    const workspaceId = upsertPgrDto.workspaceId;

    const riskGroupData = await this.riskGroupDataRepository.findAllDataById(
      upsertPgrDto.riskGroupId,
      companyId,
    );

    const hierarchyHierarchy =
      await this.hierarchyRepository.findAllDataHierarchyByCompany(
        companyId,
        workspaceId,
      );

    const { hierarchyData, homoGroupTree } =
      hierarchyConverter(hierarchyHierarchy);

    const sections: ISectionOptions[] = [
      riskCharacterizationTableSection(riskGroupData),
      ...hierarchyPrioritizationTableSections(riskGroupData, hierarchyData),
      ...hierarchyRisksTableSections(riskGroupData, hierarchyData),
      hierarchyPlanTableSection(hierarchyData, homoGroupTree),
      actionPlanTableSection(riskGroupData),
      ...riskInventoryTableSection(riskGroupData, hierarchyData),
    ];

    const doc = createBaseDocument(sections);

    const b64string = await Packer.toBase64String(doc);
    const buffer = Buffer.from(b64string, 'base64');
    const docName = upsertPgrDto.name.replace(/\s+/g, '');

    const fileName = `${
      docName.length > 0 ? docName + '-' : ''
    }${riskGroupData.company.name.replace(/\s+/g, '')}-v${
      upsertPgrDto.version
    }.docx`;

    await this.upload(buffer, fileName, upsertPgrDto, riskGroupData.company);

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
