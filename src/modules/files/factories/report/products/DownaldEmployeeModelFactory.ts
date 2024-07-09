import { Injectable } from '@nestjs/common';
import { CompanyEntity } from './../../../../company/entities/company.entity';
import { EmployeeColumnList } from '../../upload/products/CompanyStructure/constants/headersList/EmployeeColumnList';

import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { CompanyRepository } from '../../../../company/repositories/implementations/CompanyRepository';
import { ReportFactoryAbstractionCreator } from '../creator/ReportFactoryCreator';
import { convertHeaderUpload } from '../helpers/convertHeaderUpload';
import { convertTitleUpload } from '../helpers/convertTitleUpload';
import { getCompany, getCompanyInfo } from '../helpers/getCompanyInfo';
import { getWorkspaceInfoTable } from '../helpers/getWorkspaceInfoTable';
import {
  IReportCell,
  IReportFactoryProduct,
  IReportFactoryProductFindData,
  IReportHeader,
  IReportSanitizeData,
} from '../types/IReportFactory.types';

@Injectable()
export class DownaldEmployeeModelFactory extends ReportFactoryAbstractionCreator<any> {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly excelProv: ExcelProvider,
  ) {
    super(excelProv, companyRepository);
  }

  public factoryMethod(): IReportFactoryProduct<any> {
    return new DownloadFactoryProduct(this.companyRepository);
  }
}

export class DownloadFactoryProduct implements IReportFactoryProduct<any> {
  constructor(private readonly companyRepository: CompanyRepository) {}
  public company: CompanyEntity;

  public async findTableData(companyId: string) {
    const company = await getCompany(companyId, this.companyRepository);

    const sanitizeData = this.sanitizeData({});
    const headerData = this.getHeader(company);
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

  public sanitizeData({}: any): IReportSanitizeData[] {
    const rows: IReportSanitizeData[] = [];
    return rows;
  }

  public getFilename(company: CompanyEntity): string {
    const filename = `Planilha de Importação Funcionários (${company.fantasy || company.name})`;
    return filename;
  }

  public getSheetName(): string {
    const name = `Funcionários`;

    return name;
  }

  public getHeader(company: CompanyEntity): IReportHeader {
    const header: IReportHeader = convertHeaderUpload(
      EmployeeColumnList({ workspaceLength: company.workspace.length }),
    );
    return header;
  }

  public getTitle(_: IReportHeader, company: CompanyEntity): IReportCell[][] {
    const { main, sub } = getCompanyInfo(company);
    const row: IReportCell[] = [
      {
        content: 'Tabela de Funcionários',
        mergeRight: 'all',
        font: { size: 11, bold: true, color: { theme: 1 }, name: 'Calibri' },
      },
    ];
    const emptyRow: IReportCell[] = [{ content: '', fill: undefined }];
    const headerTitle = convertTitleUpload(EmployeeColumnList({ workspaceLength: company.workspace.length }));

    const tables = company.workspace.length > 1 ? this.getWorkspaces(company) : [];

    const rows: IReportCell[][] = [...main, row, ...sub, emptyRow, ...tables, headerTitle];
    return rows;
  }

  public getWorkspaces(company: CompanyEntity): IReportCell[][] {
    const rows = getWorkspaceInfoTable(company);
    const emptyRow: IReportCell[] = [{ content: '', fill: undefined }];

    rows.push(emptyRow);
    rows.push(emptyRow);

    return rows;
  }

  public getEndInformation(): IReportCell[][] {
    const rows = [];

    return rows;
  }
}
