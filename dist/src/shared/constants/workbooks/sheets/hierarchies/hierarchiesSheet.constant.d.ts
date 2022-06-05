import { ITableSchema } from '../../../../providers/ExcelProvider/models/IExcelProvider.types';
import { HierarchiesSheetEnum } from './hierarchies.enum';
export interface IEmployeeSheet {
    name: string;
    id: HierarchiesSheetEnum;
    columns: ITableSchema[];
}
export declare const hierarchiesSheetConstant: Record<HierarchiesSheetEnum, IEmployeeSheet>;
