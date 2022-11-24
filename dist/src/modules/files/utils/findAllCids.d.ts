import { IRiskSheet } from '../../../shared/constants/workbooks/sheets/risk/riskSheet.constant';
import { ExcelProvider } from '../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { CidRepository } from './../../company/repositories/implementations/CidRepository';
export declare const findAllCids: (excelProvider: ExcelProvider, cidRepository: CidRepository, riskSheet: IRiskSheet) => Promise<{
    sheetName: string;
    rows: any[];
    tableHeader: import("../../../shared/providers/ExcelProvider/models/IExcelProvider.types").ITableSchema[];
}>;
