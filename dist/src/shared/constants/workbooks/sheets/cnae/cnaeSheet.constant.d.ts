import { ITableSchema } from '../../../../providers/ExcelProvider/models/IExcelProvider.types';
import { CnaeSheetEnum } from './cnaeSheet.enum';
export interface ICnaeSheet {
    name: string;
    id: CnaeSheetEnum;
    columns: ITableSchema[];
}
export declare const cnaeSheetConstant: Record<CnaeSheetEnum, ICnaeSheet>;
