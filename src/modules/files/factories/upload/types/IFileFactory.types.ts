import { IReportCell, IReportHeaderCell, ReportFillColorEnum } from '../../report/types/IReportFactory.types';
import { IExcelReadData } from './../../../../../shared/providers/ExcelProvider/models/IExcelProvider.types';

export type IColumnRule = {
  required?: boolean;
  requiredIfOneExist?: string[];
  isArray?: boolean;
  field: string;
  database?: string;
  checkHandler?: (...args: any[]) => any;
  transform?: (...args: any[]) => any;
  notes?: string[];
};

export type IColumnRuleMap<K extends keyof any = string> = {
  [P in K]: IColumnRule & Partial<IReportCell>;
};

export type ISheetRuleMap = Record<string, IColumnRuleMap>;
export type ISheetData = { sheetName: string; columnsMap: IColumnRuleMap; rows: IExcelReadData['data'] };
export type ISheetExtractedData<T extends keyof any> = Record<T, any>[];
export type ISheetHeaderList = ({
  group: IColumnRule[] | IColumnRule[][];
  name: string;
  fillColors?: ReportFillColorEnum[];
} & Partial<IReportCell>)[];

export interface IFileFactoryProduct<T = any, R extends keyof any = any> {
  splitter?: string;
  // getSheetName(): string;
  // getFilename(): string;
  // findTableData(companyId: string, query: T): Promise<IFileFactoryProductFindData>;
  // sanitizeData(...data: any): IFileSanitizeData[];
  // getHeaderIndex(readFileData: IExcelReadData, columnsMap: IColumnRuleMap): number;
  getSheets(readFileData: IExcelReadData[]): Promise<ISheetData[]>;
  getColumns(): Promise<IColumnRuleMap>;
  saveData(data: ISheetExtractedData<R>[], body: T): Promise<any>;
  // getTitle(header: IFileHeader, ...data: any): IFileCell[][];
  // getEndInformation(...data: any): IFileCell[][];
}
