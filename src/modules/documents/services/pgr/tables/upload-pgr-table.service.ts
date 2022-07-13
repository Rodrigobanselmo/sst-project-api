import { APPRByGroupTableSection } from './../../../docx/components/tables/apprByGroup/appr-group.section';
import { Injectable } from '@nestjs/common';
import { ISectionOptions, Packer } from 'docx';

import { RiskDocumentRepository } from '../../../../../modules/checklist/repositories/implementations/RiskDocumentRepository';
import { RiskGroupDataRepository } from '../../../../../modules/checklist/repositories/implementations/RiskGroupDataRepository';
import { CompanyEntity } from '../../../../../modules/company/entities/company.entity';
import { HierarchyRepository } from '../../../../../modules/company/repositories/implementations/HierarchyRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { createBaseDocument } from '../../../docx/base/config/document';
import { actionPlanTableSection } from '../../../docx/components/tables/actionPlan/actionPlan.section';
import { APPRTableSection } from '../../../docx/components/tables/appr/appr.section';
import { hierarchyHomoOrgSection } from '../../../docx/components/tables/hierarchyHomoOrg/hierarchyHomoOrg.section';
import { hierarchyPrioritizationTableSections } from '../../../docx/components/tables/hierarchyPrioritization/hierarchyPrioritization.section';
import { hierarchyRisksTableSections } from '../../../docx/components/tables/hierarchyRisks/hierarchyRisks.section';
import { riskCharacterizationTableSection } from '../../../docx/components/tables/riskCharacterization/riskCharacterization.section';
import { hierarchyConverter } from '../../../docx/converter/hierarchy.converter';
import { UpsertPgrDto } from '../../../dto/pgr.dto';

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

    const { hierarchyData, homoGroupTree, hierarchyTree } =
      hierarchyConverter(hierarchyHierarchy);

    const sections: ISectionOptions[] = [
      riskCharacterizationTableSection(riskGroupData),
      ...hierarchyPrioritizationTableSections(
        riskGroupData,
        hierarchyData,
        hierarchyTree,
      ),
      ...hierarchyRisksTableSections(
        riskGroupData,
        hierarchyData,
        hierarchyTree,
      ),
      hierarchyHomoOrgSection(hierarchyData, homoGroupTree),
      actionPlanTableSection(riskGroupData, hierarchyTree),
      ...APPRTableSection(riskGroupData, hierarchyData, homoGroupTree),
      ...APPRByGroupTableSection(
        riskGroupData,
        hierarchyData,
        hierarchyTree,
        homoGroupTree,
        { isByGroup: true },
      ),
    ];

    const doc = createBaseDocument(sections);

    const b64string = await Packer.toBase64String(doc);
    const buffer = Buffer.from(b64string, 'base64');
    const docName = upsertPgrDto.name.replace(/\s+/g, '');

    const fileName = `${docName.length > 0 ? docName + '-' : ''}${
      riskGroupData.company.name
    }-v${upsertPgrDto.version}.docx`
      .normalize('NFD')
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9s_/.!\\={}?()-]/g, '');

    await this.upload(buffer, fileName, upsertPgrDto, riskGroupData.company);

    return { buffer, fileName };
  }

  private async upload(
    fileBuffer: Buffer,
    fileName: string,
    upsertPgrDto: UpsertPgrDto,
    company: Partial<CompanyEntity>,
  ) {
    const { url } = await this.amazonStorageProvider.upload({
      file: fileBuffer,
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
