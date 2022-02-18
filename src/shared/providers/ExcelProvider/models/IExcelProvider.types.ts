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
}

interface IExcelProvider {
  read(buffer: Buffer): Promise<IExcelReadData[]>;
}

export { IExcelProvider };
