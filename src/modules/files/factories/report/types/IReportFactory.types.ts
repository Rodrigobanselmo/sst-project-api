import { ReportDownloadtypeEnum } from '../../../../../modules/files/dto/base-report.dto';

export type IReportHeader = IReportHeaderCell[];

export interface IReportFactoryProduct<T> {
  getSheetName(): string;
  getFilename(): string;
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

export interface IReportFactoryCreatorConstructor {}

export interface IReportCell {
  fill?: ReportFillColorEnum;
  color?: ReportColorEnum;
  content: string | number | Date;
  mergeRight?: number | 'all';
  width?: number;
}

export interface IReportHeaderCell extends IReportCell {
  database: string;
}

export type IReportRows = IReportCell[][];
export type IReportSanitizeData = Record<string, IReportCell>;
export type IReportGenerateType<T> = {
  downloadType: ReportDownloadtypeEnum;
  companyId: string;
  body: T;
};

export enum ReportFillColorEnum {
  BLUE = '#1ea5ff',
  YELLOW = '#d9d10b',
  RED = '#F44336',
  GREEN = '#3cbe7d',
  HEADER = '#faffae',
  TITLE = '#a1a1a1',
  END = '#faffae',
}

export enum ReportColorEnum {
  BLUE = '#1ea5ff',
  YELLOW = '#d9d10b',
  RED = '#F44336',
  GREEN = '#3cbe7d',
}
