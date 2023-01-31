import { PrismaService } from './../../../../../prisma/prisma.service';
import { IExcelReadData } from './../../../../../shared/providers/ExcelProvider/models/IExcelProvider.types';
import { ExcelProvider } from '../../../../../shared/providers/ExcelProvider/implementations/ExcelProvider';
import { IColumnRuleMap, IFileFactoryProduct, ISheetData, ISheetExtractedData } from '../types/IFileFactory.types';
import { BadRequestException } from '@nestjs/common';

export abstract class FileFactoryAbstractionCreator<T, R extends keyof any> {
  public abstract factoryMethod(): IFileFactoryProduct<T, R>;
  private readonly excelProvider: ExcelProvider;
  private readonly prismaService: PrismaService;

  constructor(excelProvider, prisma) {
    this.excelProvider = excelProvider;
    this.prismaService = prisma;
  }

  public create() {
    const product = this.factoryMethod();

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

    await product.saveData(sheetsRows, body);
  }

  public async read({ buffer }) {
    const readFileData = await this.excelProvider.read(buffer);
    return readFileData;
  }

  public getHeaderInfo(sheet: ISheetData) {
    const headerStartIndex = sheet.rows.findIndex((row) => row[0] && sheet.columnsMap[row[0]]);
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

  public validationTransform(sheet: ISheetData) {
    const { columnHandlerOrder, headerStartIndex } = this.getHeaderInfo(sheet);

    const databaseRows = [] as ISheetExtractedData<R>;

    sheet.rows.slice(headerStartIndex + 1).forEach((excelRow, indexRow) => {
      if (!excelRow.length) return;

      const databaseRow = {} as Record<R, any>;

      columnHandlerOrder.forEach((columnHandler, indexCell) => {
        const errorMessageMissing = `Esta faltando um campo obrigatório na linha "${indexRow + 1}", coluna "${this.excelProvider.getColumnByIndex(
          indexCell,
        )}" da planilha ${sheet.sheetName}"`;

        const errorMessageInvalid = `Dado inválido na linha "${indexRow + 1}", coluna "${this.excelProvider.getColumnByIndex(indexCell)}" da planilha ${
          sheet.sheetName
        }"`;

        const excelCell = excelRow[indexCell];
        const isEmptyCell = excelCell === null || excelCell === undefined;
        const isEmptyRequired = isEmptyCell && columnHandler.required;

        if (isEmptyRequired) throw new BadRequestException(errorMessageMissing);
        if (isEmptyCell) {
          if (columnHandler.requiredIf) {
            const isRequiredIf = columnHandler.requiredIf.find((schemaCell) => {
              const isRequiredIf_ColumnHandler = columnHandlerOrder.findIndex((columnOrder) => schemaCell == columnOrder.field);
              const isRequiredIf_ExcelCell = excelRow[isRequiredIf_ColumnHandler];

              if (isRequiredIf_ExcelCell) return true;
            });
            if (isRequiredIf) throw new BadRequestException(errorMessageMissing);
          }

          return;
        }

        let checkedData = columnHandler.checkHandler(excelCell);
        if (checkedData === false) throw new BadRequestException(errorMessageInvalid);
        if (checkedData === 'false') checkedData = false;

        if (columnHandler.transform) checkedData = columnHandler.transform(checkedData);

        if (columnHandler.isArray) {
          databaseRow[columnHandler.field] = checkedData.split('; ');
        }

        if (!columnHandler.isArray) {
          databaseRow[columnHandler.field] = checkedData;
        }
      });

      databaseRows.push(databaseRow);
    });

    return databaseRows;
  }
}
