import { RiskRepository } from '../../sst/repositories/implementations/RiskRepository';
import { IRiskSheet } from '../../../shared/constants/workbooks/sheets/risk/riskSheet.constant';
import { ExcelProvider } from '../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
export declare const findAllRisks: (excelProvider: ExcelProvider, riskRepository: RiskRepository, riskSheet: IRiskSheet, companyId: string) => Promise<{
    sheetName: string;
    rows: any[];
    tableHeader: import("../../../shared/providers/ExcelProvider/models/IExcelProvider.types").ITableSchema[];
}>;
