import { CreatePgr } from './../../../docx/docs/pgr/create';
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

@Injectable()
export class PgrUploadService {
  constructor(
    private readonly riskGroupDataRepository: RiskGroupDataRepository,
    private readonly riskDocumentRepository: RiskDocumentRepository,
    private readonly amazonStorageProvider: AmazonStorageProvider,
    private readonly hierarchyRepository: HierarchyRepository,
  ) {}
  async execute(upsertPgrDto: UpsertPgrDto, userPayloadDto: UserPayloadDto) {
    // const companyId = userPayloadDto.targetCompanyId;
    // const workspaceId = upsertPgrDto.workspaceId;

    // const riskGroupData = await this.riskGroupDataRepository.findAllDataById(
    //   upsertPgrDto.riskGroupId,
    //   companyId,
    // );

    // const hierarchyHierarchy =
    //   await this.hierarchyRepository.findAllDataHierarchyByCompany(
    //     companyId,
    //     workspaceId,
    //   );

    // const { hierarchyData, homoGroupTree } =
    //   hierarchyConverter(hierarchyHierarchy);

    const url =
      'https://prod-simplesst-docs.s3.amazonaws.com/b8635456-334e-4d6e-ac43-cfe5663aee17/environment/dcf93c91-815a-4b12-8a68-a6f39d86711b.png';

    const example_image_1 = await downloadImageFile(
      url,
      `tmp/${v4()}.${getExtensionFromUrl(url)}`,
    );

    console.log(example_image_1);

    const version = 'Março/2022 – REV. 03';

    const sections: ISectionOptions[] = new CreatePgr({
      version,
      logo: example_image_1,
    }).create();

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
