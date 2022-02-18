import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import ExcelJS from 'excelJS';
import xlsx from 'node-xlsx';
import { transformStringToObject } from 'src/shared/utils/transformStringToObject';

import {
  IExcelProvider,
  IExcelReadData,
  ITableSchema,
} from '../models/IExcelProvider.types';

const User = [
  {
    fname: 'Amir',
    lname: 'Mustafa',
    email: 'amir@gmail.com',
    gender: 'Male',
  },
  {
    fname: 'Ashwani',
    lname: 'Kumar',
    email: 'ashwani@gmail.com',
    gender: 'Male',
  },
  {
    fname: 'Nupur',
    lname: 'Shah',
    email: 'nupur@gmail.com',
    gender: 'Female',
  },
  {
    fname: 'Himanshu',
    lname: 'Mewari',
    email: 'himanshu@gmail.com',
    gender: 'Male',
  },
  {
    fname: 'Vankayala',
    lname: 'Sirisha',
    email: 'sirisha@gmail.com',
    gender: 'Female',
  },
];

class ExcelProvider implements IExcelProvider {
  async create() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Users');

    worksheet.columns = [
      { header: 'S no.', key: 's_no', width: 10 },
      { header: 'First Name', key: 'fname', width: 10 },
      { header: 'Last Name', key: 'lname', width: 10 },
      { header: 'Email Id', key: 'email', width: 10 },
      { header: 'Gender', key: 'gender', width: 10 },
    ];
    // Looping through User data
    User.forEach((user, index) => {
      worksheet.addRow({ s_no: index + 1, ...user }); // Add data in worksheet
    });
    // Making first line in excel bold
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    const buffer = await workbook.xlsx.writeBuffer({ filename: 'test.xlsx' });
    console.log(`buffer`, buffer);
    return;
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

  async transformToTableData(
    excelReadData: IExcelReadData,
    tableSchema: ITableSchema[],
  ) {
    const transformStep = {
      startMap: false,
      row: 0,
    };

    const databaseRows = [] as any[];
    let databaseRow = {} as any;

    excelReadData.data.forEach((excelRow, indexRow) => {
      const isArrayData = excelRow[0] === '-';
      const isNextArrayData =
        excelReadData.data[indexRow + 1] &&
        excelReadData.data[indexRow + 1][0] === '-';

      const saveIndexes = {
        hasSaved: false,
        indexDatabase: 0,
      };

      if (!isArrayData) databaseRow = {};
      if (!excelRow.length) return;

      if (transformStep.startMap) {
        tableSchema.forEach((tableSchemaCell, indexCell) => {
          const actualCell = `row ${indexRow + 1} column ${indexCell + 1}`;

          const excelCell = excelRow[indexCell];
          const isEmptyCell =
            excelCell === null || excelCell === undefined || excelCell === '-';

          const isMissingField =
            isEmptyCell && !isArrayData && tableSchemaCell.required;

          if (isMissingField)
            throw new BadRequestException(
              `Is missing an required field value on ${actualCell}`,
            );

          if (isArrayData && !tableSchemaCell.isArray && !isEmptyCell)
            throw new BadRequestException(
              `This is not an array property on ${actualCell}`,
            );

          if (isEmptyCell) return;

          const checkedData = tableSchemaCell.checkHandler(excelCell);

          if (!checkedData && excelCell != '-')
            throw new BadRequestException(`Invalid data on ${actualCell}`);

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
          console.log(indexRow, databaseRow);
          transformStep.row = transformStep.row + 1;
          return databaseRows.push(databaseRow);
        }
      }

      const excelHeader = tableSchema.map((row) => row.excelName);
      const sameLength = excelRow.length === excelHeader.length;

      if (!sameLength) return;

      const isTableHeader = excelHeader.every(
        (column, i) => excelRow[i] == column,
      );

      if (isTableHeader) transformStep.startMap = true;
    });

    return databaseRows;
  }
}

export { ExcelProvider };
