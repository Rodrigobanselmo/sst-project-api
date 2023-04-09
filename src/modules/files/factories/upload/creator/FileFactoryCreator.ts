import { PrismaService } from './../../../../../prisma/prisma.service';
import { IExcelReadData } from './../../../../../shared/providers/ExcelProvider/models/IExcelProvider.types';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { IColumnRule, IColumnRuleMap, IFileFactoryProduct, ISheetData, ISheetExtractedData } from '../types/IFileFactory.types';
import { BadRequestException } from '@nestjs/common';
import { IReportCell } from '../../report/types/IReportFactory.types';

export abstract class FileFactoryAbstractionCreator<T, R extends keyof any> {
  public abstract factoryMethod(): IFileFactoryProduct<T, R>;
  private readonly excelProvider: ExcelProvider;
  private readonly prismaService: PrismaService;
  private splitter = '; ';

  constructor(excelProvider, prisma) {
    this.excelProvider = excelProvider;
    this.prismaService = prisma;
  }

  public create() {
    const product = this.factoryMethod();

    if (product.splitter) this.splitter = product.splitter;

    return product;
  }

  public async execute(buffer: Buffer, body: T) {
    const product = this.create();
    const readFileData = await this.read({ buffer });

    const sheets = await product.getSheets(readFileData);

    const sheetsRows = sheets.map((sheet) => {
      const sheetRows = this.validationTransform(sheet);

      return sheetRows;
    });

    return await product.saveData(sheetsRows, body);
  }

  public async read({ buffer }) {
    const readFileData = await this.excelProvider.read(buffer);
    return readFileData;
  }

  public getHeaderInfo(sheet: ISheetData) {
    const headerStartIndex = sheet.rows.findIndex((row) => row[0] && row[1] && sheet.columnsMap[row[0]] && sheet.columnsMap[row[1]]);
    if (headerStartIndex == -1) throw new BadRequestException(`Não foi encontrado a cabeçario da tabela na planilha "${sheet.sheetName}"`);

    const columnHandlerOrder = sheet.rows[headerStartIndex].map((cell, columnsIndex) => {
      const columnType = sheet.columnsMap[cell];

      if (!columnType)
        throw new BadRequestException(
          `Não foi possivel identificar a coluna "${this.excelProvider.getColumnByIndex(columnsIndex)}" no cabeçario da tabela na planilha "${sheet.sheetName}"`,
        );

      return columnType;
    });

    return { headerStartIndex, columnHandlerOrder };
  }

  private checkIfOneExists(excelRow: (string | number)[], arrayCheck: string[], columnHandlerOrder: (IColumnRule & Partial<IReportCell>)[]) {
    const foundData = arrayCheck.find((schemaCell) => {
      const columnIndex = columnHandlerOrder.findIndex((columnOrder) => schemaCell == columnOrder.field);
      const cell = excelRow[columnIndex];

      if (cell) return true;
    });

    return !!foundData;
  }

  public validationTransform(sheet: ISheetData) {
    const { columnHandlerOrder, headerStartIndex } = this.getHeaderInfo(sheet);

    const databaseRows = [] as ISheetExtractedData<R>;
    const errors = [] as string[];

    sheet.rows.slice(headerStartIndex + 1).forEach((excelRow, indexRow) => {
      if (!excelRow.length) return;

      const databaseRow = {} as Record<R, any>;
      const rowIndex = indexRow + 1 + (headerStartIndex + 1);

      columnHandlerOrder.forEach((columnHandler, indexCell) => {
        const errorMessageMissing = `Esta faltando um campo obrigatório na linha "${rowIndex}", coluna "${this.excelProvider.getColumnByIndex(indexCell)}" (${
          columnHandler.field
        }) da planilha ${sheet.sheetName}"`;

        const errorMessageInvalid = `Dado inválido na linha "${rowIndex}", coluna "${this.excelProvider.getColumnByIndex(indexCell)}" da planilha ${
          sheet.sheetName
        }" \nDado: ${excelRow[indexCell]} `;

        const excelCell = excelRow[indexCell];
        const isEmptyCell = excelCell === null || excelCell === undefined;
        const isEmptyRequired = isEmptyCell && columnHandler.required;

        if (isEmptyRequired) return errors.push(errorMessageMissing);
        if (isEmptyCell) {
          if (columnHandler.requiredIfOneExist) {
            const isRequiredIf = this.checkIfOneExists(excelRow, columnHandler.requiredIfOneExist, columnHandlerOrder);
            if (isRequiredIf) return errors.push(errorMessageMissing);
          }

          return;
        }

        let checkedData = columnHandler.checkHandler(excelCell);
        if (checkedData === false) return errors.push(errorMessageInvalid);
        if (checkedData === 'false') checkedData = false;
        if (checkedData === 'true') checkedData = true;

        if (columnHandler.transform) checkedData = columnHandler.transform(checkedData);

        if (columnHandler.isArray) {
          databaseRow[columnHandler.field] = checkedData.split(this.splitter);
        }

        if (!columnHandler.isArray) {
          databaseRow[columnHandler.field] = checkedData;
        }
      });

      databaseRows.push(databaseRow);
    });

    if (errors.length) throw new BadRequestException(errors);

    return databaseRows;
  }
}
