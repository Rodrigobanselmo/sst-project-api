import { ActivityRepository } from './../../company/repositories/implementations/ActivityRepository';
import { IRiskSheet } from '../../../shared/constants/workbooks/sheets/risk/riskSheet.constant';
import { ExcelProvider } from '../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
export declare const findAllCnaes: (excelProvider: ExcelProvider, activityRepository: ActivityRepository, riskSheet: IRiskSheet) => Promise<{
    sheetName: string;
    rows: any[];
    tableHeader: import("../../../shared/providers/ExcelProvider/models/IExcelProvider.types").ITableSchema[];
}>;
