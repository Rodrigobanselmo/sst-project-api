import { Injectable } from '@nestjs/common';
import { Document, Packer } from 'docx';
import { Readable } from 'stream';

import { RiskDocumentRepository } from '../../../../modules/checklist/repositories/implementations/RiskDocumentRepository';
import { RiskGroupDataRepository } from '../../../../modules/checklist/repositories/implementations/RiskGroupDataRepository';
import { CompanyEntity } from '../../../../modules/company/entities/company.entity';
import { HierarchyRepository } from '../../../../modules/company/repositories/implementations/HierarchyRepository';
import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { UpsertPgrDto } from '../../dto/pgr.dto';
import { hierarchyConverter } from '../../utils/sections/converter/hierarchy.converter';
import { actionPlanTableSection } from '../../utils/sections/tables/actionPlan/actionPlan.section';
import { hierarchyPlanTableSection } from '../../utils/sections/tables/hierarchyPlan/hierarchyPlan.section';
import { hierarchyRisksTableSection } from '../../utils/sections/tables/hierarchyRisks/hierarchyRisks.section';
import { riskInventoryTableSection } from '../../utils/sections/tables/riskInventory/riskInventory.section';

@Injectable()
export class PgrUploadService {
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

    const doc = new Document({
      sections: [
        hierarchyPlanTableSection(hierarchyData, homoGroupTree),
        // hierarchyRisksTableSection(riskGroupData, hierarchyData),
        // actionPlanTableSection(riskGroupData),
        // ...riskInventoryTableSection(riskGroupData, hierarchyData),
      ],
    });

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
