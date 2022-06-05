import { ITableSchema } from '../providers/ExcelProvider/models/IExcelProvider.types';
interface IWorksheetsExcel {
    rows: (string | number | Date | null)[][];
    sheetName: string;
    tableHeader: ITableSchema[];
}
export interface IWorkbookExcel {
    version?: number;
    lastUpdate?: Date;
    fileName: string;
    sheets: IWorksheetsExcel[];
}
export {};
