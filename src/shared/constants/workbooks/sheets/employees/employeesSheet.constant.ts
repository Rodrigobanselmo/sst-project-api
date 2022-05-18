import { ITableSchema } from '../../../../providers/ExcelProvider/models/IExcelProvider.types';
import { employeesColumnsConstant } from './employeesColumns.constant';

import { EmployeesUniqueSheetEnum } from './employees.enum';

export interface IEmployeeSheet {
  name: string;
  id: EmployeesUniqueSheetEnum;
  columns: ITableSchema[];
}

export const employeesSheetConstant = {
  [EmployeesUniqueSheetEnum.EMPLOYEES]: {
    name: 'Empregados',
    id: EmployeesUniqueSheetEnum.EMPLOYEES,
    columns: employeesColumnsConstant,
  },
} as Record<EmployeesUniqueSheetEnum, IEmployeeSheet>;
