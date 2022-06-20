import { Injectable } from '@nestjs/common';
import docx, {
  Bookmark,
  Document,
  HeadingLevel,
  ImageRun,
  InternalHyperlink,
  ISectionOptions,
  OutlineLevel,
  Packer,
  PageReference,
  Paragraph,
  SequentialIdentifier,
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
import { hierarchyConverter } from '../../docx/sections/converter/hierarchy.converter';
import { actionPlanTableSection } from '../../docx/sections/tables/actionPlan/actionPlan.section';
import { hierarchyPlanTableSection } from '../../docx/sections/tables/hierarchyOrg/hierarchyPlan.section';
import { hierarchyPrioritizationTableSections } from '../../docx/sections/tables/hierarchyPrioritization/hierarchyPrioritization.section';
import { hierarchyRisksTableSections } from '../../docx/sections/tables/hierarchyRisks/hierarchyRisks.section';
import { riskCharacterizationTableSection } from '../../docx/sections/tables/riskCharacterization/riskCharacterization.section';
import { riskInventoryTableSection } from '../../docx/sections/tables/riskInventory/riskInventory.section';

import fs from 'fs';
import { v4 } from 'uuid';
import {
  downloadImageFile,
  getExtensionFromUrl,
} from '../../../../shared/utils/downloadImageFile';
import { createBaseDocument } from '../../docx/base/document';
import { summarySections } from '../../docx/base/summary';
import { createFooter } from '../../docx/base/headerAndFooter/footer';
import { createHeader } from '../../docx/base/headerAndFooter/header';
import { sectionProperties } from '../../docx/base/styles';
import { coverSections } from '../../docx/base/cover';
import { chapterSection } from '../../docx/base/chapter';
import { headerAndFooter } from '../../docx/base/headerAndFooter/headerAndFooter';
import { h1, h2, title } from '../../docx/base/elements/heading';
import { paragraphNormal } from '../../docx/base/elements/paragraphs';
import { bulletsNormal } from '../../docx/base/elements/bullets';

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

    const sections: ISectionOptions[] = [
      coverSections({
        imgPath: example_image_1,
        version,
      }),
      ...summarySections,
      chapterSection({ version, chapter: 'PARTE 01 – DOCUMENTO BASE' }),
      {
        children: [
          title('PARTE 01 – DOCUMENTO BASE'),
          h1('INTRODUÇÃO'),
          paragraphNormal(
            'O Documento Base do PGR tem como finalidade sintetizar todos os aspectos estruturais do programa e definir as diretrizes relativas ao gerenciamento dos riscos ambientais, que possam afetar a saúde e a integridade física dos trabalhadores da **TOXILAB**. e de suas Contratadas (NR-01 Item 1.5.1).',
          ),
          h2('Objetivo'),
          paragraphNormal(
            'O PROGRAMA DE GERENCIAMENTO DE RISCO – PGR visa disciplinar os preceitos a serem observados na organização e no ambiente de trabalho, de forma a tornar compatível o planejamento e o desenvolvimento da atividade da empresa com a busca permanente da segurança e saúde dos trabalhadores em consonância com a NR-01 Subitem 1.5 Gerenciamento de Riscos Ocupacionais (GRO) em cumprimento ao determinado no subitem 1.5.3.1.1 que institui o PGR como ferramenta de Gerenciamento de Riscos Ocupacionais.',
          ),
          paragraphNormal('O PGR deve:'),
          ...bulletsNormal([
            [
              'Contemplar Riscos Físicos, Químicos, Biológicos, de Acidentes e Ergonômicos;',
            ],
            [
              'Providências quanto à eliminação ou minimização na maior extensão possível dos riscos ambientais;',
            ],
          ]),
        ],
        ...headerAndFooter({
          chapter: 'PARTE 01 – Documento Base',
          logoPath: example_image_1,
          version,
        }),
      },
      // riskCharacterizationTableSection(riskGroupData),
      // ...hierarchyPrioritizationTableSections(riskGroupData, hierarchyData),
      // ...hierarchyRisksTableSections(riskGroupData, hierarchyData),
      // hierarchyPlanTableSection(hierarchyData, homoGroupTree),
      // actionPlanTableSection(riskGroupData),
      // ...riskInventoryTableSection(riskGroupData, hierarchyData),
    ];

    const doc = createBaseDocument(sections);

    fs.unlinkSync(example_image_1);

    const b64string = await Packer.toBase64String(doc);
    const buffer = Buffer.from(b64string, 'base64');
    // const docName = upsertPgrDto.name.replace(/\s+/g, '');

    const fileName = 'delete.docx';
    // const fileName = `${
    //   docName.length > 0 ? docName + '-' : ''
    // }${riskGroupData.company.name.replace(/\s+/g, '')}-v${
    //   upsertPgrDto.version
    // }.docx`;

    // await this.upload(buffer, fileName, upsertPgrDto, riskGroupData.company);

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
