import { ClinicScheduleTypeEnum, CompanyPaymentTypeEnum } from '@prisma/client';

export type IReportHeader = IReportHeaderCell[];

export interface IReportFactoryProduct {
  getSheetName(): string;
  getFilename(): string;
  findTableData(): Promise<IReportFactoryProductFindData>;
  sanitizeData(data: any[]): IReportSanitizeData[];
  getHeader(data?: any): IReportHeader;
  getTitle(header: IReportHeader): IReportCell[][];
  getEndInformation(data?: any): IReportCell[][];
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

export enum ReportFillColorEnum {
  BLUE = '#1ea5ff',
  YELLOW = '#1ea5ff',
  RED = '#1ea5ff',
  GREEN = '#1ea5ff',
  HEADER = '#faffae',
  TITLE = '#a1a1a1',
  END = '#faffae',
}

export enum ReportColorEnum {
  BLUE = '#1ea5ff',
  YELLOW = '#1ea5ff',
  RED = '#1ea5ff',
  GREEN = '#1ea5ff',
}
