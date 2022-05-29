import { Injectable } from '@nestjs/common';
import { Document, Packer } from 'docx';
import { RiskDocumentRepository } from 'src/modules/checklist/repositories/implementations/RiskDocumentRepository';
import { RiskGroupDataRepository } from 'src/modules/checklist/repositories/implementations/RiskGroupDataRepository';
import { CompanyEntity } from 'src/modules/company/entities/company.entity';
import { HierarchyRepository } from 'src/modules/company/repositories/implementations/HierarchyRepository';
import { AmazonStorageProvider } from 'src/shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { Readable } from 'stream';

import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { UpsertPgrDto } from '../../dto/pgr.dto';
import { actionPlanTableSection } from '../../utils/sections/tables/actionPlan/actionPlan.section';
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

    const riskGroupData = await this.riskGroupDataRepository.findAllDataById(
      upsertPgrDto.riskGroupId,
      companyId,
    );

    const hierarchyData =
      await this.hierarchyRepository.findAllHierarchyByCompany(companyId, {
        include: { employees: true, workplace: true, homogeneousGroups: true },
      });

    const doc = new Document({
      sections: [
        actionPlanTableSection(riskGroupData),
        ...riskInventoryTableSection(riskGroupData, hierarchyData),
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
      fileName,
    });

    const doc = await this.riskDocumentRepository.upsert({
      ...upsertPgrDto,
      companyId: company.id,
      fileUrl: url,
    });

    return doc;
  }
}