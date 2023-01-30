import { IExcelReadData } from './../../../../../shared/providers/ExcelProvider/models/IExcelProvider.types';

export type IColumnRuleMap<K extends keyof any = string> = {
  [P in K]: {
    required?: boolean;
    requiredIf?: string[];
    isArray?: boolean;
    field: string;
    checkHandler?: (...args: any[]) => any;
    transform?: (...args: any[]) => any;
    notes?: string[];
  };
};

export type ISheetRuleMap = Record<string, IColumnRuleMap>;
export type ISheetData = { sheetName: string; columnsMap: IColumnRuleMap; rows: IExcelReadData['data']; indexStartHeader?: number };

export interface IFileFactoryProduct {
  // getSheetName(): string;
  // getFilename(): string;
  // findTableData(companyId: string, query: T): Promise<IFileFactoryProductFindData>;
  // sanitizeData(...data: any): IFileSanitizeData[];
  // getHeaderIndex(readFileData: IExcelReadData, columnsMap: IColumnRuleMap): number;
  getSheets(readFileData: IExcelReadData[]): ISheetData[];
  saveData(data: any[]): any;
  // getTitle(header: IFileHeader, ...data: any): IFileCell[][];
  // getEndInformation(...data: any): IFileCell[][];
}

export interface IFileFactoryProductFindData {
  sanitizeData: IFileSanitizeData[];
  titleRows: IFileCell[][];
  endRows: IFileCell[][];
  // headerRow: IFileHeader;
}

export interface IFileFactoryCreatorConstructor {}

export interface IFileCell {
  fill?: FileFillColorEnum;
  color?: FileColorEnum;
  content: string | number | Date;
  mergeRight?: number | 'all';
  width?: number;
}

export interface IFileHeaderCell extends IFileCell {
  database: string;
}

export type IFileRows = IFileCell[][];
export type IFileSanitizeData = Record<string, IFileCell>;

export enum FileFillColorEnum {
  BLUE = '#1ea5ff',
  YELLOW = '#d9d10b',
  RED = '#F44336',
  GREEN = '#3cbe7d',
  HEADER = '#faffae',
  TITLE = '#a1a1a1',
  END = '#faffae',
}

export enum FileColorEnum {
  BLUE = '#1ea5ff',
  YELLOW = '#d9d10b',
  RED = '#F44336',
  GREEN = '#3cbe7d',
}
