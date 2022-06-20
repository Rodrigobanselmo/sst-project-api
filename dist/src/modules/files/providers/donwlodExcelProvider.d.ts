import { ExcelProvider } from '../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { DatabaseTableRepository } from '../repositories/implementations/DatabaseTableRepository';
export declare class DownloadExcelProvider {
    private readonly databaseTableRepository;
    private readonly excelProvider;
    constructor(databaseTableRepository: DatabaseTableRepository, excelProvider: ExcelProvider);
    newTableData({ findAll, Workbook, companyId }: {
        findAll: any;
        Workbook: any;
        companyId: any;
    }): Promise<{
        workbook: import("exceljs").Workbook;
        filename: string;
    }>;
}
