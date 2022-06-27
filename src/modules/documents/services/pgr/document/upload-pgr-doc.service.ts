import { quantityResultsQTable } from '../../../docx/components/tables/mock/components/quantityResults/tables/quantityResultsQTable';
import { expositionDegreeFQTable } from '../../../docx/components/tables/mock/components/expositionDegree/tables/expositionDegreeFQTable';
import {
  borderNoneStyle,
  sectionProperties,
} from './../../../docx/base/config/styles';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  ImageRun,
  ISectionOptions,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import fs from 'fs';
import { Readable } from 'stream';
import { v4 } from 'uuid';
import sizeOf from 'image-size';

import { CompanyRepository } from '../../../../../modules/company/repositories/implementations/CompanyRepository';
import { UserPayloadDto } from '../../../../../shared/dto/user-payload.dto';
import { DayJSProvider } from '../../../../../shared/providers/DateProvider/implementations/DayJSProvider';
import { AmazonStorageProvider } from '../../../../../shared/providers/StorageProvider/implementations/AmazonStorage/AmazonStorageProvider';
import {
  downloadImageFile,
  getExtensionFromUrl,
} from '../../../../../shared/utils/downloadImageFile';
import { RiskDocumentEntity } from '../../../../checklist/entities/riskDocument.entity';
import { RiskDocumentRepository } from '../../../../checklist/repositories/implementations/RiskDocumentRepository';
import { RiskGroupDataRepository } from '../../../../checklist/repositories/implementations/RiskGroupDataRepository';
import { CompanyEntity } from '../../../../company/entities/company.entity';
import { HierarchyRepository } from '../../../../company/repositories/implementations/HierarchyRepository';
import { ProfessionalRepository } from '../../../../users/repositories/implementations/ProfessionalRepository';
import { createBaseDocument } from '../../../docx/base/config/document';
import { DocumentBuildPGR } from '../../../docx/builders/pgr/create';
import { UpsertPgrDto } from '../../../dto/pgr.dto';
import { WorkspaceRepository } from './../../../../company/repositories/implementations/WorkspaceRepository';
import { VFullWidthImage } from 'src/modules/documents/docx/base/elements/imagesLayout/vFullWidthImage';
import { expositionDegreeBTable } from 'src/modules/documents/docx/components/tables/mock/components/expositionDegree/tables/expositionDegreeBTable';
import { expositionDegreeETable } from 'src/modules/documents/docx/components/tables/mock/components/expositionDegree/tables/expositionDegreeETable';
import { expositionDegreeATable } from 'src/modules/documents/docx/components/tables/mock/components/expositionDegree/tables/expositionDegreeATable';
import { matrizTable } from 'src/modules/documents/docx/components/tables/mock/components/matriz/table.component';
import { quantityResultsRTable } from 'src/modules/documents/docx/components/tables/mock/components/quantityResults/tables/quantityResultsRTable';
import { quantityResultsR2Table } from 'src/modules/documents/docx/components/tables/mock/components/quantityResults/tables/quantityResultsR2Table';
import { quantityResultsHTable } from 'src/modules/documents/docx/components/tables/mock/components/quantityResults/tables/quantityResultsHTable';
import { quantityResultsFBVTable } from 'src/modules/documents/docx/components/tables/mock/components/quantityResults/tables/quantityResultsFBVTable';
import { quantityResultsLVTable } from 'src/modules/documents/docx/components/tables/mock/components/quantityResults/tables/quantityResultsLV';
import { annualDoseTable } from 'src/modules/documents/docx/components/tables/mock/components/annualDose/table.component';

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
    const company = await this.companyRepository.findByIdAll(companyId, {
      include: {
        address: true,
        environments: { include: { photos: true } },
        professional: true,
      },
    });

    const logo = company.logoUrl
      ? await downloadImageFile(
          company.logoUrl,
          `tmp/${v4()}.${getExtensionFromUrl(company.logoUrl)}`,
        )
      : '';

    // throw new Error('');
    // const dimensions = sizeOf(logo);
    // console.log(dimensions.width, dimensions.height);

    const { environments, photosPath } = await this.downloadPhotos(company);
    // const environments = [];
    // const photosPath = [];

    // eslint-disable-next-line prettier/prettier
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

    const versionString = `${this.dayJSProvider.format(
      version.created_at,
    )} - REV. ${version.version}`;

    const sections: ISectionOptions[] = new DocumentBuildPGR({
      version: versionString,
      document: riskGroupData,
      logo,
      company,
      workspace,
      versions,
      environments,
    }).build();

    // const sections: ISectionOptions[] = [
    //   {
    //     // children: [...vTwoImages(logo, 'qw')],
    //     children: [annualDoseTable()],
    //     properties: sectionProperties,
    //   },
    // ];

    const doc = createBaseDocument(sections);

    const b64string = await Packer.toBase64String(doc);
    [logo, ...photosPath].forEach((path) => path && fs.unlinkSync(path));

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

  private async downloadPhotos(company: Partial<CompanyEntity>) {
    const photosPath = [];
    // return { environments: [], photosPath };
    try {
      const environments = await Promise.all(
        company.environments.map(async (environment) => {
          const photos = await Promise.all(
            environment.photos.map(async (photo) => {
              const path = await downloadImageFile(
                photo.photoUrl,
                `tmp/${v4()}.${getExtensionFromUrl(photo.photoUrl)}`,
              );
              photosPath.push(path);
              return { ...photo, photoUrl: path };
            }),
          );

          return { ...environment, photos };
        }),
      );
      return { environments, photosPath };
    } catch (error) {
      photosPath.forEach((path) => fs.unlinkSync(path));

      throw new InternalServerErrorException(error);
    }
  }
}
