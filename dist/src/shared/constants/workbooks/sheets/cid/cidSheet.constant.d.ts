import { ITableSchema } from '../../../../providers/ExcelProvider/models/IExcelProvider.types';
import { CidSheetEnum } from './cidSheet.enum';
export interface ICidSheet {
    name: string;
    id: CidSheetEnum;
    columns: ITableSchema[];
}
export declare const cidSheetConstant: Record<CidSheetEnum, ICidSheet>;
