import { ExcelProvider } from '../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { DatabaseTableRepository } from '../repositories/implementations/DatabaseTableRepository';
export declare class UploadExcelProvider {
    private readonly databaseTableRepository;
    private readonly excelProvider;
    constructor(databaseTableRepository: DatabaseTableRepository, excelProvider: ExcelProvider);
    getAllData({ buffer, Workbook, read, DatabaseTable }: {
        buffer: any;
        Workbook: any;
        read: any;
        DatabaseTable: any;
    }): Promise<any[]>;
    newTableData({ findAll, Workbook, system, companyId, DatabaseTable }: {
        findAll: any;
        Workbook: any;
        system: any;
        companyId: any;
        DatabaseTable: any;
    }): Promise<{
        workbook: import("exceljs").Workbook;
        filename: string;
    }>;
}
