import { ITableSchema } from '../../../../providers/ExcelProvider/models/IExcelProvider.types';
export interface IHierarchiesColumns {
    directory: string;
    management: string;
    office: string;
    sub_office: string;
    sub_sector: string;
    realDescription: string;
    ghoDescription: string;
    description: string;
    status: string;
    sector: string;
    workspaceIds: string[];
    abbreviation?: string;
    ghoName?: string;
}
export declare const hierarchiesColumnsConstant: ITableSchema[];
