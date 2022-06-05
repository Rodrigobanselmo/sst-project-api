/// <reference types="node" />
import ExcelJS from 'exceljs';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IWorkbookExcel } from '../../../../shared/interfaces/worksheet.types';
import { IExcelProvider, IExcelReadData, ITableSchema } from '../models/IExcelProvider.types';
declare class ExcelProvider implements IExcelProvider {
    private readonly prisma?;
    constructor(prisma?: PrismaService);
    create(workbookExcel: IWorkbookExcel, companyId?: string): Promise<{
        workbook: ExcelJS.Workbook;
        filename: string;
    }>;
    read(buffer: Buffer): Promise<IExcelReadData[]>;
    transformToExcelData(databaseData: any[], tableSchema: ITableSchema[]): Promise<any[]>;
    transformToTableData(excelReadData: IExcelReadData, tableSchema: ITableSchema[], options?: {
        isArrayWithMissingFirstData?: boolean;
    }): Promise<{
        rows: any[];
        version: number;
    }>;
}
export { ExcelProvider };
