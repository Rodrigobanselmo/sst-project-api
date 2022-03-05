import { PrismaService } from 'src/prisma/prisma.service';

export interface IExcelReadData {
  name: string;
  data: (string | number | null)[][];
}

export interface ITableSchema {
  databaseName: string;
  excelName: string;
  required: boolean;
  checkHandler: (value: any) => string | false;
  isId?: boolean;
  isArray?: boolean;
  notes?: (prisma: PrismaService, companyId: string) => Promise<string[]>;
}

interface IExcelProvider {
  read(buffer: Buffer): Promise<IExcelReadData[]>;
}

export { IExcelProvider };
