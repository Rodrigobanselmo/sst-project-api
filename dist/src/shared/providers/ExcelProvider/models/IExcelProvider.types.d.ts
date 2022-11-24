/// <reference types="node" />
import { PrismaService } from '../../../../prisma/prisma.service';
export interface IExcelReadData {
    name: string;
    data: (string | number | null)[][];
}
export interface ITableSchema {
    databaseName: string;
    excelName: string;
    required: boolean;
    checkHandler: (value: any) => string | false | true;
    isId?: boolean;
    isArray?: boolean | string;
    notes?: (prisma: PrismaService, companyId: string) => Promise<string[]> | string[];
}
interface IExcelProvider {
    read(buffer: Buffer): Promise<IExcelReadData[]>;
}
export { IExcelProvider };
