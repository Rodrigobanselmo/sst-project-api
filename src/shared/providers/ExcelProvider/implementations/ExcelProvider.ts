import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import ExcelJS from 'exceljs';
import xlsx from 'node-xlsx';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ErrorMessageEnum } from '../../../../shared/constants/enum/errorMessage';
import { sheetStylesConstant } from '../../../../shared/constants/workbooks/styles/sheet-styles.constant';
import { IWorkbookExcel } from '../../../../shared/interfaces/worksheet.types';
import {
  getObjectValueFromString,
  transformStringToObject,
} from '../../../../shared/utils/transformStringToObject';

import {
  IExcelProvider,
  IExcelReadData,
  ITableSchema,
} from '../models/IExcelProvider.types';

const addVersion = (
  worksheet: ExcelJS.Worksheet,
  version: number,
  lastUpdate: Date,
) => {
  worksheet.addRow(['Versão', version, new Date(lastUpdate)]);

  const row = worksheet.lastRow;
  row.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'b6a371' },
    };
  });
};

const addRules = (worksheet: ExcelJS.Worksheet) => {
  worksheet.addRow(['Obrigarótio', 'Opcinal']);

  const row = worksheet.lastRow;

  row.height = 25;
  row.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

  row.getCell(1).fill = sheetStylesConstant.fill.required;
  row.getCell(2).fill = sheetStylesConstant.fill.optional;
  row.getCell(3).value = `Possivel adicionar \n + abaixo`;
  row.getCell(3).border = sheetStylesConstant.border.addMore;
};

const addHeader = async (
  worksheet: ExcelJS.Worksheet,
  columns: ITableSchema[],
  prisma?: PrismaService,
  companyId?: string,
) => {
  const rows = columns.map((row) => row.excelName);
  const columnsWidth = columns.map((row) => ({
    width: row.excelName.length > 20 ? row.excelName.length : 18,
  }));

  worksheet.addRow(rows);

  worksheet.columns = columnsWidth;

  const row = worksheet.lastRow;

  row.alignment = { vertical: 'middle', horizontal: 'center' };

  const notes = {} as Record<string, string[]>;

  await Promise.all(
    columns.map(async (column) => {
      if (column.notes) {
        if (Array.isArray(column.notes)) {
          notes[column.excelName] = column.notes;
        } else if (typeof column.notes === 'string') {
          notes[column.excelName] = column.notes;
        } else {
          const notesCell = await column.notes(prisma, companyId);
          notes[column.excelName] = notesCell;
        }
      }
    }),
  );

  row.eachCell(async (cell, colNumber) => {
    const excelName = columns[colNumber - 1].excelName;
    const isRequired = columns[colNumber - 1].required;
    const isArray = columns[colNumber - 1].isArray;

    if (isArray) cell.border = sheetStylesConstant.border.addMore;

    if (notes[excelName]) {
      const notesTexts = [] as ExcelJS.RichText[];

      if (Array.isArray(notes[excelName])) {
        notesTexts.push(
          {
            font: {
              size: 6,
              bold: true,
              color: { theme: 1 },
              name: 'Calibri',
            },
            text: 'Opções de valores: \n',
          },
          ...notes[excelName].map((note) => {
            return {
              font: {
                size: 8,
                color: { theme: 1 },
                name: 'Calibri',
              },
              text: note + '\n',
            } as ExcelJS.RichText;
          }),
        );
      }

      if (typeof notes[excelName] === 'string') {
        notesTexts.push({
          font: {
            size: 12,
            color: { theme: 1 },
            name: 'Calibri',
          },
          text: notes[excelName] + '\n',
        } as ExcelJS.RichText);
      }

      cell.note = {
        editAs: 'oneCells',
        texts: notesTexts,
      };
    }

    if (isRequired) cell.fill = sheetStylesConstant.fill.required;
    if (!isRequired) cell.fill = sheetStylesConstant.fill.optional;
  });
};

const addEmptyRow = (worksheet: ExcelJS.Worksheet) => {
  worksheet.addRow([]);
};

@Injectable()
class ExcelProvider implements IExcelProvider {
  constructor(private readonly prisma?: PrismaService) {}

  async create(workbookExcel: IWorkbookExcel, companyId?: string) {
    const workbook = new ExcelJS.Workbook();

    await Promise.all(
      workbookExcel.sheets.map(async (sheet) => {
        const worksheet = workbook.addWorksheet(sheet.sheetName, {
          properties: { defaultColWidth: 18 },
        });

        if (workbookExcel.version) {
          addVersion(
            worksheet,
            workbookExcel.version,
            workbookExcel.lastUpdate,
          );
          addEmptyRow(worksheet);
        }

        addRules(worksheet);
        addEmptyRow(worksheet);

        await addHeader(worksheet, sheet.tableHeader, this.prisma, companyId);

        sheet.rows.forEach((row) => {
          worksheet.addRow(
            row.map((row) =>
              typeof row === 'boolean' ? (row ? 'VERDADEIRO' : 'FALSO') : row,
            ),
          );
        });
      }),
    );

    return {
      workbook,
      filename: `${workbookExcel.fileName}-${workbookExcel.version}.xlsx`,
    };
  }

  async read(buffer: Buffer) {
    try {
      const workSheetsFromBuffer = xlsx.parse(buffer);
      return workSheetsFromBuffer as IExcelReadData[];
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Error occurred when reading the file',
      );
    }
  }

  async transformToExcelData(databaseData: any[], tableSchema: ITableSchema[]) {
    const rowsData = [] as any[];
    databaseData.forEach((data) => {
      const rows = [] as any[][];
      tableSchema.forEach((cellSchema, indexCell) => {
        let cellValue = data[cellSchema.databaseName.split('.')[0]];
        if (!rows[0]) rows[0] = [];

        if (cellSchema.isArray === true) {
          if (typeof cellValue === 'string') cellValue = [cellValue];
          (cellValue || []).forEach((value, indexRow) => {
            if (!rows[indexRow]) rows[indexRow] = [];
            if (typeof value === 'object') {
              if (indexRow !== 0) rows[indexRow][0] = '-';

              rows[indexRow][indexCell] = getObjectValueFromString(
                cellSchema.databaseName.split('.').slice(1).join('.'),
                value,
              );
            } else {
              rows[indexRow][indexCell] = value;
            }
          });
        } else if (typeof cellSchema.isArray === 'string') {
          //! should get array and add separator on join string
          rows[0][indexCell] = cellValue;
        } else {
          rows[0][indexCell] = cellValue;
        }
      });

      rowsData.push(...rows.filter((i) => i));
    });

    return rowsData;
  }

  async transformToTableData(
    excelReadData: IExcelReadData,
    tableSchema: ITableSchema[],
    options?: { isArrayWithMissingFirstData?: boolean },
  ) {
    const transformStep = {
      startMap: false,
      row: 0,
      version: 0,
    };

    const databaseRows = [] as any[];
    let databaseRow = {} as any;

    excelReadData.data.forEach((excelRow, indexRow) => {
      const isArrayData =
        excelRow[0] === '-' ||
        (options && options.isArrayWithMissingFirstData && !excelRow[0]);

      const isNextArrayData =
        excelReadData.data[indexRow + 1] &&
        (excelReadData.data[indexRow + 1][0] === '-' ||
          (options &&
            options.isArrayWithMissingFirstData &&
            excelReadData.data[indexRow + 1].some((row) => row)));

      const saveIndexes = {
        hasSaved: false,
        indexDatabase: 0,
      };

      if (!isArrayData) databaseRow = {};
      if (!excelRow.length) return;

      if (transformStep.startMap) {
        tableSchema.forEach((tableSchemaCell, indexCell) => {
          const actualCell = ` spreadsheet ${excelReadData.name}, linha ${
            indexRow + 1
          } e coluna ${indexCell + 1}`;

          const excelCell = excelRow[indexCell];
          const isEmptyCell =
            excelCell === null ||
            excelCell === undefined ||
            (excelCell === '-' && indexCell == 0);

          const isMissingField =
            isEmptyCell && !isArrayData && tableSchemaCell.required;

          const isMissingArrayField =
            isEmptyCell &&
            isArrayData &&
            tableSchemaCell.required &&
            tableSchemaCell.isArray &&
            !tableSchema.every((tCell, idxCell) => {
              return (
                tCell.databaseName.split('.')[0] !==
                  tableSchemaCell.databaseName.split('.')[0] ||
                excelRow[idxCell] === null ||
                excelRow[idxCell] === undefined
              );
            });

          if (isMissingField || isMissingArrayField)
            throw new BadRequestException(
              `Esta faltando um campo obrigatório na ${actualCell}`,
            );

          if (isArrayData && !tableSchemaCell.isArray && !isEmptyCell)
            throw new BadRequestException(
              `This is not an array property on ${actualCell}`,
            );

          if (isEmptyCell) return;

          let checkedData = tableSchemaCell.checkHandler(excelCell);

          if (checkedData === false && excelCell != '-')
            throw new BadRequestException(`Dado inválido na ${actualCell}`);

          if (checkedData === 'false') checkedData = false;

          const nestedObject = transformStringToObject(
            tableSchemaCell.databaseName,
            checkedData,
          );

          const firstParam = tableSchemaCell.databaseName.split('.')[0];
          const isMultipleParams =
            tableSchemaCell.databaseName.split('.').length > 1;

          if (tableSchemaCell.isArray) {
            if (!databaseRow[firstParam]) databaseRow[firstParam] = [];

            if (saveIndexes.hasSaved === false) {
              saveIndexes.indexDatabase = databaseRow[firstParam].length;
              saveIndexes.hasSaved = true;
            }

            const indexRowArray = saveIndexes.indexDatabase;

            if (isMultipleParams) {
              if (!databaseRow[firstParam][indexRowArray])
                databaseRow[firstParam][indexRowArray] = {};

              return (databaseRow[firstParam][indexRowArray] = {
                ...databaseRow[firstParam][indexRowArray],
                ...nestedObject[firstParam],
              });
            }

            if (!isMultipleParams) {
              return (databaseRow[firstParam][indexRowArray] =
                nestedObject[firstParam]);
            }
          }

          if (!tableSchemaCell.isArray) {
            if (isMultipleParams) {
              if (!databaseRow[firstParam]) databaseRow[firstParam] = {};

              return (databaseRow[firstParam] = {
                ...databaseRow[firstParam],
                ...nestedObject[firstParam],
              });
            }

            if (!isMultipleParams) {
              return (databaseRow[firstParam] = nestedObject[firstParam]);
            }
          }
        });

        if (!isNextArrayData) {
          transformStep.row = transformStep.row + 1;
          return databaseRows.push(databaseRow);
        }
      }

      const excelHeader = tableSchema.map((row) => row.excelName);
      const sameLength = excelRow.length === excelHeader.length;

      if (indexRow === 0) transformStep.version = Number(excelRow[1]);

      if (!sameLength) return;

      const isTableHeader = excelHeader.every(
        (column, i) => excelRow[i] == column,
      );

      if (isTableHeader) transformStep.startMap = true;
    });

    if (databaseRows.length === 0 && !transformStep.startMap)
      throw new BadRequestException(ErrorMessageEnum.FILE_WRONG_TABLE_HEAD);

    return {
      rows: databaseRows,
      version: transformStep.version,
    };
  }
}

export { ExcelProvider };
