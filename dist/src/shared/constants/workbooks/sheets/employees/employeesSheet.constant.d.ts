import { ITableSchema } from '../../../../providers/ExcelProvider/models/IExcelProvider.types';
import { EmployeesUniqueSheetEnum } from './employees.enum';
export interface IEmployeeSheet {
    name: string;
    id: EmployeesUniqueSheetEnum;
    columns: ITableSchema[];
}
export declare const employeesSheetConstant: Record<EmployeesUniqueSheetEnum, IEmployeeSheet>;
