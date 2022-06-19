import { Injectable } from '@nestjs/common';
import {
  Bookmark,
  Document,
  HeadingLevel,
  ImageRun,
  InternalHyperlink,
  Packer,
  PageReference,
  Paragraph,
  StyleLevel,
  TableOfContents,
  TextRun,
} from 'docx';
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
import { hierarchyPlanTableSection } from '../../utils/sections/tables/hierarchyOrg/hierarchyPlan.section';
import { hierarchyPrioritizationTableSections } from '../../utils/sections/tables/hierarchyPrioritization/hierarchyPrioritization.section';
import { hierarchyRisksTableSections } from '../../utils/sections/tables/hierarchyRisks/hierarchyRisks.section';
import { riskCharacterizationTableSection } from '../../utils/sections/tables/riskCharacterization/riskCharacterization.section';
import { riskInventoryTableSection } from '../../utils/sections/tables/riskInventory/riskInventory.section';

import fs from 'fs';
import { v4 } from 'uuid';
import {
  downloadImageFile,
  getExtensionFromUrl,
} from '../../../../shared/utils/downloadImageFile';

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

    const url =
      'https://prod-simplesst-docs.s3.amazonaws.com/b8635456-334e-4d6e-ac43-cfe5663aee17/environment/dcf93c91-815a-4b12-8a68-a6f39d86711b.png';

    const example_image_1 = await downloadImageFile(
      url,
      `tmp/${v4()}.${getExtensionFromUrl(url)}`,
    );

    console.log(example_image_1);
    // http
    //   .request(url, function (response) {
    //     const data = new Transform();

    //     response.on('data', function (chunk) {
    //       data.push(chunk);
    //     });

    //     response.on('end', function () {
    //       fs.writeFileSync('image.png', data.read());
    //     });
    //   })
    //   .end();

    const image = new ImageRun({
      data: fs.readFileSync(example_image_1),
      transformation: {
        width: 600,
        height: 338,
      },
    });

    const chapter1 = new Paragraph({
      heading: HeadingLevel.TITLE,
      children: [
        new Bookmark({
          id: 'anchorForChapter1',
          children: [new TextRun('Chapter 1')],
        }),
      ],
    });

    const internalHyperlink = new Paragraph({
      children: [
        new InternalHyperlink({
          children: [
            new TextRun({
              text: 'See Chapter 1',
            }),
          ],
          anchor: 'anchorForChapter1',
        }),
        new TextRun('Chapter 1 can be seen on page '),
        new PageReference('anchorForChapter1'),
      ],
    });

    const doc = new Document({
      features: {
        updateFields: true,
      },
      styles: {
        paragraphStyles: [
          {
            id: 'TableHeader',
            name: 'Table Header Styles',
            quickFormat: true,
            link: '',
            run: {
              italics: true,
              color: 'ff0000',
              bold: true,
            },
          },
        ],
      },
      sections: [
        {
          children: [
            new TableOfContents('Summary', {
              hyperlink: true,
              headingStyleRange: '1-3',
            }),
          ],
        },
        {
          children: [internalHyperlink],
        },
        {
          children: [
            new TableOfContents('Tables', {
              hyperlink: true,
              entriesFromBookmark: '[anchorForChapter1]',
            }),
          ],
        },
        {
          children: [
            new Paragraph({
              text: 'Header #1',
              heading: HeadingLevel.HEADING_1,
              pageBreakBefore: true,
            }),
            new Paragraph({
              text: 'Header #2',
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              text: 'Header #3',
              heading: HeadingLevel.HEADING_3,
            }),
            new Paragraph({
              text: 'Header #4',
              heading: HeadingLevel.HEADING_4,
            }),
            new Paragraph({
              // children: [image],
              heading: HeadingLevel.HEADING_5,
              text: 'HEADING_5',
            }),
            new Paragraph({
              text: 'HEADING_6',
              heading: HeadingLevel.HEADING_6,
            }),
            new Paragraph({
              heading: HeadingLevel.HEADING_5,
              text: 'HEADING_5 again',
            }),
            new Paragraph({
              text: 'TableHeader',
              style: 'TableHeader',
              pageBreakBefore: true,
            }),
            chapter1,
          ],
        },
        // riskCharacterizationTableSection(riskGroupData),
        // ...hierarchyPrioritizationTableSections(riskGroupData, hierarchyData),
        // ...hierarchyRisksTableSections(riskGroupData, hierarchyData),
        // hierarchyPlanTableSection(hierarchyData, homoGroupTree),
        // actionPlanTableSection(riskGroupData),
        // ...riskInventoryTableSection(riskGroupData, hierarchyData),
      ],
    });

    fs.unlinkSync(example_image_1);

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
