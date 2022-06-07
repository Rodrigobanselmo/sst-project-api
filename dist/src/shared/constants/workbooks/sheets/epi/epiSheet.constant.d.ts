import { ITableSchema } from '../../../../providers/ExcelProvider/models/IExcelProvider.types';
import { EpiSheetEnum } from './epiSheet.enum';
export interface IEpiSheet {
    name: string;
    id: EpiSheetEnum;
    columns: ITableSchema[];
}
export declare const epiSheetConstant: Record<EpiSheetEnum, IEpiSheet>;
