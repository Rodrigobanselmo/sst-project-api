import { PrismaService } from '../../../../prisma/prisma.service';
import ExcelJS from 'exceljs';

export interface IExcelReadData {
  name: string;
  data: (string | number | null)[][];
}

export interface ITableSchema {
  databaseName: string;
  excelName: string;
  required: boolean;
  isBoolean?: boolean;
  checkHandler: (value: any) => string | false | true;
  isId?: boolean;
  isArray?: boolean | string;
  notes?: (prisma: PrismaService, companyId: string) => Promise<string[]> | string[];
}

interface IExcelProvider {
  read(buffer: Buffer): Promise<IExcelReadData[]>;
}

export interface IReportExcellCell {
  fill?: string;
  color?: string;
  mergeRight?: number | 'all';
  width?: number;
  content: string | number | Date;
  notes?: string[];
  borders?: Partial<ExcelJS.Borders>;
  align?: {
    horizontal?: 'left' | 'center' | 'right' | 'fill' | 'justify' | 'centerContinuous' | 'distributed';
    vertical?: 'top' | 'middle' | 'bottom' | 'distributed' | 'justify';
    wrapText?: boolean;
    shrinkToFit?: boolean;
    indent?: number;
    readingOrder?: 'rtl' | 'ltr';
    textRotation?: number | 'vertical';
  };
}

export type IReportRow = IReportExcellCell[];
export type IReportTable = IReportRow[];
export type IReportSheet = { rows: IReportTable; name: string }[];

export { IExcelProvider };
