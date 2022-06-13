import { Injectable } from '@nestjs/common';
import { Document, Packer } from 'docx';
import { RiskDocumentRepository } from '../../../../modules/checklist/repositories/implementations/RiskDocumentRepository';
import { RiskGroupDataRepository } from '../../../../modules/checklist/repositories/implementations/RiskGroupDataRepository';
import { CompanyEntity } from '../../../../modules/company/entities/company.entity';
import { HierarchyRepository } from '../../../../modules/company/repositories/implementations/HierarchyRepository';
import { AmazonStorageProvider } from '../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { Readable } from 'stream';
import fs from 'fs';

import { UserPayloadDto } from '../../../../shared/dto/user-payload.dto';
import { UpsertPgrDto } from '../../dto/pgr.dto';
import { actionPlanTableSection } from '../../utils/sections/tables/actionPlan/actionPlan.section';
import { riskInventoryTableSection } from '../../utils/sections/tables/riskInventory/riskInventory.section';
import { simulateAwait } from 'src/shared/utils/simulateAwait';

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
    console.log('companyId', 1);
    let riskGroupData = await this.riskGroupDataRepository.findAllDataById(
      upsertPgrDto.riskGroupId,
      companyId,
    );

    console.log('companyId', 2);
    let hierarchyData =
      await this.hierarchyRepository.findAllDataHierarchyByCompany(
        companyId,
        workspaceId,
      );

    const doc = new Document({
      sections: [
        actionPlanTableSection(riskGroupData),
        ...riskInventoryTableSection(riskGroupData, hierarchyData),
      ],
    });
    console.log('companyId', 3);
    hierarchyData = undefined;
    riskGroupData = undefined;

    await simulateAwait(3000);
    console.log('companyId', 3.1);

    Packer.toBuffer(doc).then((buffer) => {
      fs.writeFileSync('My Document.docx', buffer);
    });

    // const b64string = await Packer.toBase64String(doc);
    // const buffer = Buffer.from(b64string, 'base64');
    // const buffer = await Packer.toBuffer(doc);
    // fs.writeFileSync('My Document.docx', buffer);
    console.log('companyId', 4);
    // const docName = upsertPgrDto.name.replace(/\s+/g, '');

    // const fileName = `${
    //   docName.length > 0 ? docName + '-' : ''
    // }${riskGroupData.company.name.replace(/\s+/g, '')}-v${
    //   upsertPgrDto.version
    // }.docx`;

    // await this.upload(buffer, fileName, upsertPgrDto, riskGroupData.company);

    // return { buffer, fileName };
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
