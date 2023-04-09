import { CompanyEntity } from './../../../../company/entities/company.entity';
import { Injectable } from '@nestjs/common';
import { clothesList } from '../../../../../shared/constants/maps/ibtu-clothes.map';

import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { CompanyRepository } from '../../../../company/repositories/implementations/CompanyRepository';
import { CompanyStructColumnList } from '../../upload/products/CompanyStructure/constants/headersList/CompanyStructColumnList';
import { ReportFactoryAbstractionCreator } from '../creator/ReportFactoryCreator';
import { convertHeaderUpload } from '../helpers/convertHeaderUpload';
import { convertTitleUpload } from '../helpers/convertTitleUpload';
import { getCompany, getCompanyInfo } from '../helpers/getCompanyInfo';
import {
  IReportCell,
  IReportFactoryProduct,
  IReportFactoryProductFindData,
  IReportHeader,
  IReportSanitizeData,
  ReportFillColorEnum,
} from '../types/IReportFactory.types';
import { getWorkspaceInfoTable } from '../helpers/getWorkspaceInfoTable';
import { allBorders, getBoxBorders } from '../constants/theme';
import { concatSideBySideTables } from '../helpers/concatSideBySideTables';

@Injectable()
export class DownaldRiskModelFactory extends ReportFactoryAbstractionCreator<any> {
  constructor(private readonly companyRepository: CompanyRepository, private readonly excelProv: ExcelProvider) {
    super(excelProv);
  }

  public factoryMethod(): IReportFactoryProduct<any> {
    return new DownloadFactoryProduct(this.companyRepository);
  }
}

class DownloadFactoryProduct implements IReportFactoryProduct<any> {
  constructor(private readonly companyRepository: CompanyRepository) {}

  public async findTableData(companyId: string) {
    const company = await getCompany(companyId, this.companyRepository);

    const sanitizeData = this.sanitizeData();
    const headerData = this.getHeader();
    const titleData = this.getTitle(headerData, company);
    const infoData = [];

    const returnData: IReportFactoryProductFindData = { headerRow: headerData, titleRows: titleData, endRows: infoData, sanitizeData };

    return returnData;
  }

  public sanitizeData(): IReportSanitizeData[] {
    const rows: IReportSanitizeData[] = [];
    return rows;
  }

  public getFilename(): string {
    const date = new Date();
    const filename = `Modelo Estrutura Ocupacional ${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    return filename;
  }

  public getSheetName(): string {
    const name = `Modelo Estrutura Ocupacional`;

    return name;
  }

  public getHeader(): IReportHeader {
    const header: IReportHeader = convertHeaderUpload(CompanyStructColumnList);
    return header;
  }

  public getTitle(_: IReportHeader, company: CompanyEntity): IReportCell[][] {
    const { main, sub } = getCompanyInfo(company);
    const row: IReportCell[] = [{ content: 'Estrutura Ocupacional', mergeRight: 'all', font: { size: 11, bold: true, color: { theme: 1 }, name: 'Calibri' } }];
    const emptyRow: IReportCell[] = [{ content: '', fill: undefined }];
    const headerTitle = convertTitleUpload(CompanyStructColumnList);

    //TODO concat tables
    // concatSideBySideTables() && this.getWorskpaces
    const tables = this.getClothesTable();

    const rows: IReportCell[][] = [...main, row, ...sub, emptyRow, ...tables, headerTitle];
    return rows;
  }

  public getClothesTable(): IReportCell[][] {
    const rowTitle: IReportCell[] = [{ content: 'Tipos de Vestimentas [IBUTG]', mergeRight: 1, fill: ReportFillColorEnum.HEADER_RED, borders: allBorders }];
    const emptyRow: IReportCell[] = [{ content: '', fill: undefined }];
    const headerTitle: IReportCell[] = [
      { content: 'Vestimenta', fill: ReportFillColorEnum.HEADER, borders: allBorders },
      { content: 'Valor', fill: ReportFillColorEnum.HEADER, borders: allBorders },
    ];

    const rows: IReportCell[][] = [emptyRow, rowTitle, headerTitle];

    clothesList.map((c, index) => {
      const row: IReportCell[] = [
        { content: c.content, fill: undefined, borders: getBoxBorders(index, 0, clothesList.length - 1, 1) },
        { content: c.value, fill: undefined, borders: getBoxBorders(index, 1, clothesList.length - 1, 1) },
      ];

      rows.push(row);
    });

    rows.push(emptyRow);

    return rows;
  }

  public getWorkspaces(company: CompanyEntity): IReportCell[][] {
    const rows = getWorkspaceInfoTable(company);

    return rows;
  }

  public getEndInformation(): IReportCell[][] {
    const rows = [];

    return rows;
  }
}
