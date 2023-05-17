import { CompanyEntity } from '../../../../company/entities/company.entity';
import { ReportDownloadTypeEnum } from '../../../dto/base-report.dto';
import ExcelJS from 'exceljs';

export type IReportHeader = IReportHeaderCell[];

export interface IReportFactoryProduct<T> {
  getSheetName(): string;
  getFilename(company: CompanyEntity): string;
  findTableData(companyId: string, query: T): Promise<IReportFactoryProductFindData>;
  sanitizeData(...data: any): IReportSanitizeData[];
  getHeader(...data: any): IReportHeader;
  getTitle(header: IReportHeader, ...data: any): IReportCell[][];
  getEndInformation(...data: any): IReportCell[][];
}

export interface IReportFactoryProductFindData {
  sanitizeData: IReportSanitizeData[];
  titleRows: IReportCell[][];
  endRows: IReportCell[][];
  headerRow: IReportHeader;
}

export interface IReportFactoryCreatorConstructor { }

export interface IReportCell {
  fill?: ReportFillColorEnum;
  color?: ReportColorEnum;
  content: string | number | Date;
  mergeRight?: number | 'all';
  width?: number;
  borders?: Partial<ExcelJS.Borders>;
  font?: Partial<ExcelJS.Font>;
  align?: {
    horizontal?: 'left' | 'center' | 'right' | 'fill' | 'justify' | 'centerContinuous' | 'distributed';
    vertical?: 'top' | 'middle' | 'bottom' | 'distributed' | 'justify';
    wrapText?: boolean;
    shrinkToFit?: boolean;
    indent?: number;
    readingOrder?: 'rtl' | 'ltr';
    textRotation?: number | 'vertical';
  };
}

export interface IReportHeaderCell extends IReportCell {
  database: string;
}

export type IReportRows = IReportCell[][];
export type IReportSanitizeData = Record<string, IReportCell>;
export type IReportGenerateType<T> = {
  downloadType: ReportDownloadTypeEnum;
  companyId: string;
  body?: T;
};

export enum ReportFillColorEnum {
  BLUE = '#1ea5ff',
  YELLOW = '#d9d10b',
  RED = '#F44336',
  GREEN = '#3cbe7d',
  HEADER = '#faffae',
  HEADER_BLUE = '#d5e6f5',
  HEADER_YELLOW = '#fdb409',
  HEADER_PURPLE = '#c0b1d1',
  HEADER_RED = '#f0a072',
  HEADER_GREEN = '#dbecd1',
  TITLE = '#a1a1a1',
  TITLE_LIGHT = '#d3d3d3',
  END = '#faffae',

  EXPIRED = '#F44336',
  CLOSE_TO_EXPIRED = '#d9d10b',
}

export enum ReportColorEnum {
  LIGHT_GREY = '#d3d3d3',
  BLUE = '#1ea5ff',
  YELLOW = '#d9d10b',
  RED = '#F44336',
  GREEN = '#3cbe7d',
  WHITE = '#ffffff',

  EXPIRED = '#F44336',
  CLOSE_TO_EXPIRED = '#d9d10b',
}
