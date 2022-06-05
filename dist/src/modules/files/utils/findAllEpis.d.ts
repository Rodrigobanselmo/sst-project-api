import { IRiskSheet } from '../../../shared/constants/workbooks/sheets/risk/riskSheet.constant';
import { ExcelProvider } from '../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { EpiRepository } from '../../checklist/repositories/implementations/EpiRepository';
export declare const findAllEpis: (excelProvider: ExcelProvider, epiRepository: EpiRepository, riskSheet: IRiskSheet) => Promise<{
    sheetName: string;
    rows: any[];
    tableHeader: import("../../../shared/providers/ExcelProvider/models/IExcelProvider.types").ITableSchema[];
}>;
