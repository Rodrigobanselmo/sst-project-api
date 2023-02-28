import { Injectable } from '@nestjs/common';
import { ISectionOptions, Packer } from 'docx';
import { sortData } from '../../../../../shared/utils/sorts/data.sort';

import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import { getDocxFileName } from '../../../../../shared/utils/getFileName';
import { RiskDocumentRepository } from '../../../../sst/repositories/implementations/RiskDocumentRepository';
import { RiskGroupDataRepository } from '../../../../sst/repositories/implementations/RiskGroupDataRepository';
import { CompanyEntity } from '../../../../company/entities/company.entity';
import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { createBaseDocument } from '../../../docx/base/config/document';
import { actionPlanTableSection } from '../../../docx/components/tables/actionPlan/actionPlan.section';
import { hierarchyConverter } from '../../../docx/converter/hierarchy.converter';
import { UploadPgrActionPlanDto } from '../../../dto/document.dto';
import { dayjs } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';

@Injectable()
export class PgrActionPlanUploadTableService {
  constructor(
    private readonly riskGroupDataRepository: RiskGroupDataRepository,
    private readonly riskDocumentRepository: RiskDocumentRepository,
    private readonly amazonStorageProvider: AmazonStorageProvider,
    private readonly hierarchyRepository: HierarchyRepository,
  ) {}
  async execute(upsertPgrDto: UploadPgrActionPlanDto, userPayloadDto: UserPayloadDto) {
    const companyId = userPayloadDto.targetCompanyId;
    const workspaceId = upsertPgrDto.workspaceId;

    const riskGroupData = await this.riskGroupDataRepository.findAllDataById(upsertPgrDto.riskGroupId, workspaceId, companyId);

    const version = (await this.riskDocumentRepository.findByRiskGroupAndCompany(upsertPgrDto.riskGroupId, companyId)).sort((a, b) => sortData(b, a, 'created_at')) || [];

    const hierarchyHierarchy = await this.hierarchyRepository.findAllDataHierarchyByCompany(companyId, workspaceId);

    const { hierarchyTree } = hierarchyConverter(hierarchyHierarchy, [], {
      workspaceId,
    });

    const sections: ISectionOptions[] = [actionPlanTableSection(riskGroupData as any, hierarchyTree)];

    const doc = createBaseDocument(sections);

    const b64string = await Packer.toBase64String(doc);
    const buffer = Buffer.from(b64string, 'base64');

    const fileName = getDocxFileName({
      name: version[0] ? version[0]?.name || '' : '',
      companyName: (riskGroupData.company?.fantasy || riskGroupData.company.name) + (riskGroupData.company.initials ? '-' + riskGroupData.company.initials : ''),
      typeName: 'PGR-PLANO_DE_ACAO',
      version: version[0] ? version[0]?.version || '0.0.0' : '0.0.0',
      date: dayjs((riskGroupData as any).validityEnd || new Date()).format('MMMM-YYYY'),
    });

    await this.upload(buffer, fileName, riskGroupData.company);

    return { buffer, fileName };
  }

  private async upload(fileBuffer: Buffer, fileName: string, company: Partial<CompanyEntity>) {
    const { url } = await this.amazonStorageProvider.upload({
      file: fileBuffer,
      // fileName: company.id + '/pgr/' + fileName,
      fileName: 'temp-files-7-days/' + fileName,
    });

    return url;
  }
}
