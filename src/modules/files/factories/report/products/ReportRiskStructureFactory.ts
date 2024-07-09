import { RiskFactorGroupDataEntity } from './../../../../sst/entities/riskGroupData.entity';
import { DownloadRiskStructureReportDto } from './../../../dto/risk-structure-report.dto';
import {
  DocumentPGRFactory,
  DocumentPGRFactoryProduct,
} from './../../../../documents/factories/document/products/PGR/DocumentPGRFactory';
import { BadRequestException, Injectable } from '@nestjs/common';
import { clothesList } from './../../../../../shared/constants/maps/ibtu-clothes.map';

import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { CompanyRepository } from '../../../../company/repositories/implementations/CompanyRepository';
import { CompanyStructColumnList } from '../../upload/products/CompanyStructure/constants/headersList/CompanyStructColumnList';
import { IColumnRule } from '../../upload/types/IFileFactory.types';
import { ReportFactoryAbstractionCreator } from '../creator/ReportFactoryCreator';
import {
  IReportCell,
  IReportFactoryProduct,
  IReportFactoryProductFindData,
  IReportHeader,
  IReportSanitizeData,
  ReportFillColorEnum,
} from '../types/IReportFactory.types';
import { PromiseInfer } from '../../../../../shared/interfaces/promise-infer.types';
import { hierarchyMap } from '../../upload/products/CompanyStructure/maps/hierarchyMap';
import { sortString } from '../../../../../shared/utils/sorts/string.sort';
import { FileCompanyStructureFactory } from '../../upload/products/CompanyStructure/FileCompanyStructureFactory';
import { convertHeaderUpload } from '../helpers/convertHeaderUpload';
import { convertTitleUpload } from '../helpers/convertTitleUpload';
import { getCompany, getCompanyInfo } from '../helpers/getCompanyInfo';
import { CompanyEntity } from 'src/modules/company/entities/company.entity';
import { HomoTypeEnum } from '@prisma/client';
import { originRiskMap } from 'src/shared/constants/maps/origin-risk';
import { HierarchyMapData } from 'src/modules/documents/docx/converter/hierarchy.converter';
import { isRiskValidForHierarchyData } from 'src/modules/documents/docx/components/tables/appr/parts/third/third.converter';
import { RiskFactorDataEntity } from 'src/modules/sst/entities/riskData.entity';

@Injectable()
export class ReportRiskStructureFactory extends ReportFactoryAbstractionCreator<DownloadRiskStructureReportDto> {
  constructor(
    private readonly documentPGRFactory: DocumentPGRFactory,
    private readonly companyRepository: CompanyRepository,
    private readonly excelProv: ExcelProvider,
  ) {
    super(excelProv, companyRepository);
  }

  public factoryMethod(): IReportFactoryProduct<any> {
    return new ReportRiskStructureProduct(this.documentPGRFactory, this.companyRepository);
  }
}

export class ReportRiskStructureProduct implements IReportFactoryProduct<any> {
  constructor(
    readonly documentPGRFactory: DocumentPGRFactory,
    readonly companyRepository: CompanyRepository,
  ) {}

  public async findTableData(companyId: string, params: DownloadRiskStructureReportDto) {
    const company = await getCompany(companyId, this.companyRepository);
    const documentPGRFactoryProduct = this.documentPGRFactory.factoryMethod() as DocumentPGRFactoryProduct;

    const workspaceId = params.workspaceId || company.workspace?.[0]?.id;
    if (!workspaceId) throw new BadRequestException('Estabelecimento não cadastrado');

    const riskData = await documentPGRFactoryProduct.getPrgRiskData({
      type: 'PGR',
      companyId,
      includeCharPhotos: false,
      workspaceId,
    });

    const sanitizeData = this.sanitizeData(riskData, params);
    const headerData = this.getHeader();
    const titleData = this.getTitle(headerData, company);
    const infoData = [];

    const returnData: IReportFactoryProductFindData = {
      headerRow: headerData,
      titleRows: titleData,
      endRows: infoData,
      sanitizeData,
    };

    return returnData;
  }

  public normalizeContent(content: any) {
    if (typeof content === 'boolean') {
      return content ? 'Sim' : 'Não';
    }

    return content;
  }

  public getRiskDataByHierarchy({
    riskData,
    hierarchy,
  }: {
    hierarchy: HierarchyMapData;
    riskData: Partial<RiskFactorDataEntity>[];
  }) {
    return riskData.filter((riskData) =>
      isRiskValidForHierarchyData({ hierarchyData: hierarchy, riskData, isByGroup: true }),
    );
  }

  public sanitizeData(
    data: PromiseInfer<ReturnType<DocumentPGRFactoryProduct['getPrgRiskData']>>,
    ..._: any
  ): IReportSanitizeData[] {
    const rows: IReportSanitizeData[] = [];

    Array.from(data.hierarchyData.values())
      .map((hierarchy) => {
        return this.getRiskDataByHierarchy({ hierarchy, riskData: data.riskGroupData.data })
          .sort((a, b) => sortString(a.riskFactor.name, b.riskFactor.name))
          .map((riskData) => {
            const isQuimical = riskData.riskFactor.type === 'QUI';

            const sanitazeRow: IReportSanitizeData = {
              startDate: { content: riskData.startDate },
              endDate: { content: riskData.endDate },
              workspace: { content: data.workspace.name },
              officeDescription: { content: hierarchy.descRh },
              officeRealDescription: { content: hierarchy.descReal },
              risk: { content: riskData.riskFactor.name },
              probability: { content: riskData.probability },
              probabilityAfter: { content: riskData.probabilityAfter },
              generateSources: { content: this.joinArray(riskData.generateSources.map((gs) => gs.name)) },
              ...(isQuimical && {
                unit: isQuimical ? { content: Object(riskData?.json)?.unit || riskData.riskFactor.unit } : undefined,
              }),
              rec: { content: this.joinArray(riskData.recs.map((rec) => rec.recName)) },
              epc: { content: this.joinArray(riskData.engs.map((eng) => eng.medName)) },
              ...(riskData.engsToRiskFactorData.some((eng) => eng.efficientlyCheck) && {
                epcEfficiently: { content: 'Sim' },
              }),
              adm: { content: this.joinArray(riskData.adms.map((adm) => adm.medName)) },
              epiCa: { content: this.joinArray(riskData.epis.map((epi) => epi.ca)) },
              //epi
              ...(riskData.epiToRiskFactorData.some((epi) => epi.efficientlyCheck) && {
                ...[
                  'epiEfficiently',
                  'epiEpc',
                  'epiLongPeriods',
                  'epiValidation',
                  'epiTradeSign',
                  'epiSanitation',
                  'epiMaintenance',
                  'epiUnstopped',
                  'epiTraining',
                ].reduce(
                  (acc, epi) => ({
                    ...acc,
                    [epi]: { content: 'Sim' },
                  }),
                  {},
                ),
              }),
              //hierarchy
              ...hierarchy.org.reduce((acc, org) => {
                return {
                  ...acc,
                  [hierarchyMap[org.typeEnum].database]: { content: org.name },
                };
              }, {}),
              //risk json info
              ...Object.keys(Object(riskData.json)).reduce(
                (acc, key) => ({
                  ...acc,
                  ...(key != 'unit' && {
                    [key]: { content: this.normalizeContent(riskData.json[key]) },
                  }),
                }),
                {},
              ),
            };

            rows.push(sanitazeRow);
          });
      })
      .flat();

    return rows;
  }

  public joinArray(array: string[]): string {
    return array.join(FileCompanyStructureFactory.splitter);
  }

  public getFilename(): string {
    const date = new Date();
    const filename = `Estrutura Ocupacional ${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    return filename;
  }

  public getSheetName(): string {
    const name = `Estrutura Ocupacional`;

    return name;
  }

  public getHeader(): IReportHeader {
    const header: IReportHeader = convertHeaderUpload(CompanyStructColumnList);

    return header;
  }

  public getTitle(_: IReportHeader, company: CompanyEntity): IReportCell[][] {
    const { main, sub } = getCompanyInfo(company);
    const row: IReportCell[] = [
      {
        content: 'Estrutura Ocupacional',
        mergeRight: 'all',
        font: { size: 11, bold: true, color: { theme: 1 }, name: 'Calibri' },
      },
    ];
    const emptyRow: IReportCell[] = [{ content: '', fill: undefined }];
    const headerTitle = convertTitleUpload(CompanyStructColumnList);

    const tables = this.getClothesTable();

    const rows: IReportCell[][] = [...main, row, ...sub, emptyRow, ...tables, headerTitle];
    return rows;
  }

  public getClothesTable(): IReportCell[][] {
    const rowTitle: IReportCell[] = [
      { content: 'Tipos de Vestimentas [IBUTG]', mergeRight: 1, fill: ReportFillColorEnum.HEADER_RED },
    ];
    const emptyRow: IReportCell[] = [{ content: '', fill: undefined }];
    const headerTitle: IReportCell[] = [
      { content: 'Vestimenta', fill: ReportFillColorEnum.HEADER },
      { content: 'Valor', fill: ReportFillColorEnum.HEADER },
    ];

    const rows: IReportCell[][] = [emptyRow, rowTitle, headerTitle];

    clothesList.map((c) => {
      const row: IReportCell[] = [
        { content: c.content, fill: undefined },
        { content: c.value, fill: undefined },
      ];

      rows.push(row);
    });

    rows.push(emptyRow);

    return rows;
  }

  public getEndInformation(): IReportCell[][] {
    const rows = [];

    return rows;
  }
}
