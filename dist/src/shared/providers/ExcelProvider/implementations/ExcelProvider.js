"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelProvider = void 0;
const common_1 = require("@nestjs/common");
const exceljs_1 = __importDefault(require("exceljs"));
const node_xlsx_1 = __importDefault(require("node-xlsx"));
const prisma_service_1 = require("../../../../prisma/prisma.service");
const errorMessage_1 = require("../../../../shared/constants/enum/errorMessage");
const sheet_styles_constant_1 = require("../../../../shared/constants/workbooks/styles/sheet-styles.constant");
const transformStringToObject_1 = require("../../../../shared/utils/transformStringToObject");
const addVersion = (worksheet, version, lastUpdate) => {
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
const addRules = (worksheet) => {
    worksheet.addRow(['Obrigarótio', 'Opcinal']);
    const row = worksheet.lastRow;
    row.height = 25;
    row.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    row.getCell(1).fill = sheet_styles_constant_1.sheetStylesConstant.fill.required;
    row.getCell(2).fill = sheet_styles_constant_1.sheetStylesConstant.fill.optional;
    row.getCell(3).value = `Possivel adicionar \n + abaixo`;
    row.getCell(3).border = sheet_styles_constant_1.sheetStylesConstant.border.addMore;
};
const addHeader = async (worksheet, columns, prisma, companyId) => {
    const rows = columns.map((row) => row.excelName);
    const columnsWidth = columns.map((row) => ({
        width: row.excelName.length > 20 ? row.excelName.length : 18,
    }));
    worksheet.addRow(rows);
    worksheet.columns = columnsWidth;
    const row = worksheet.lastRow;
    row.alignment = { vertical: 'middle', horizontal: 'center' };
    const notes = {};
    await Promise.all(columns.map(async (column) => {
        if (column.notes) {
            if (Array.isArray(column.notes)) {
                notes[column.excelName] = column.notes;
            }
            else {
                const notesCell = await column.notes(prisma, companyId);
                notes[column.excelName] = notesCell;
            }
        }
    }));
    row.eachCell(async (cell, colNumber) => {
        const excelName = columns[colNumber - 1].excelName;
        const isRequired = columns[colNumber - 1].required;
        const isArray = columns[colNumber - 1].isArray;
        if (isArray)
            cell.border = sheet_styles_constant_1.sheetStylesConstant.border.addMore;
        if (notes[excelName]) {
            cell.note = {
                editAs: 'oneCells',
                texts: [
                    {
                        font: {
                            size: 12,
                            bold: true,
                            color: { theme: 1 },
                            name: 'Calibri',
                        },
                        text: 'Opções de valores: \n',
                    },
                    ...notes[excelName].map((note) => {
                        return {
                            font: {
                                size: 12,
                                color: { theme: 1 },
                                name: 'Calibri',
                            },
                            text: note + '\n',
                        };
                    }),
                ],
            };
        }
        if (isRequired)
            cell.fill = sheet_styles_constant_1.sheetStylesConstant.fill.required;
        if (!isRequired)
            cell.fill = sheet_styles_constant_1.sheetStylesConstant.fill.optional;
    });
};
const addEmptyRow = (worksheet) => {
    worksheet.addRow([]);
};
let ExcelProvider = class ExcelProvider {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(workbookExcel, companyId) {
        const workbook = new exceljs_1.default.Workbook();
        await Promise.all(workbookExcel.sheets.map(async (sheet) => {
            const worksheet = workbook.addWorksheet(sheet.sheetName, {
                properties: { defaultColWidth: 18 },
            });
            if (workbookExcel.version) {
                addVersion(worksheet, workbookExcel.version, workbookExcel.lastUpdate);
                addEmptyRow(worksheet);
            }
            addRules(worksheet);
            addEmptyRow(worksheet);
            await addHeader(worksheet, sheet.tableHeader, this.prisma, companyId);
            sheet.rows.forEach((row) => {
                worksheet.addRow(row);
            });
        }));
        return {
            workbook,
            filename: `${workbookExcel.fileName}-${workbookExcel.version}.xlsx`,
        };
    }
    async read(buffer) {
        try {
            const workSheetsFromBuffer = node_xlsx_1.default.parse(buffer);
            return workSheetsFromBuffer;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error, 'Error occurred when reading the file');
        }
    }
    async transformToExcelData(databaseData, tableSchema) {
        const rowsData = [];
        databaseData.forEach((data) => {
            const rows = [];
            tableSchema.forEach((cellSchema, indexCell) => {
                const cellValue = data[cellSchema.databaseName.split('.')[0]];
                if (!rows[0])
                    rows[0] = [];
                if (cellSchema.isArray) {
                    cellValue.forEach((value, indexRow) => {
                        if (!rows[indexRow])
                            rows[indexRow] = [];
                        if (typeof value === 'object') {
                            if (indexRow !== 0)
                                rows[indexRow][0] = '-';
                            rows[indexRow][indexCell] = (0, transformStringToObject_1.getObjectValueFromString)(cellSchema.databaseName.split('.').slice(1).join('.'), value);
                        }
                        else {
                            rows[indexRow][indexCell] = value;
                        }
                    });
                }
                else {
                    rows[0][indexCell] = cellValue;
                }
            });
            rowsData.push(...rows.filter((i) => i));
        });
        return rowsData;
    }
    async transformToTableData(excelReadData, tableSchema, options) {
        const transformStep = {
            startMap: false,
            row: 0,
            version: 0,
        };
        const databaseRows = [];
        let databaseRow = {};
        excelReadData.data.forEach((excelRow, indexRow) => {
            const isArrayData = excelRow[0] === '-' ||
                (options && options.isArrayWithMissingFirstData && !excelRow[0]);
            const isNextArrayData = excelReadData.data[indexRow + 1] &&
                (excelReadData.data[indexRow + 1][0] === '-' ||
                    (options &&
                        options.isArrayWithMissingFirstData &&
                        excelReadData.data[indexRow + 1].some((row) => row)));
            const saveIndexes = {
                hasSaved: false,
                indexDatabase: 0,
            };
            if (!isArrayData)
                databaseRow = {};
            if (!excelRow.length)
                return;
            if (transformStep.startMap) {
                tableSchema.forEach((tableSchemaCell, indexCell) => {
                    const actualCell = ` spreadsheet ${excelReadData.name}, row ${indexRow + 1} and column ${indexCell + 1}`;
                    const excelCell = excelRow[indexCell];
                    const isEmptyCell = excelCell === null ||
                        excelCell === undefined ||
                        (excelCell === '-' && indexCell == 0);
                    const isMissingField = isEmptyCell && !isArrayData && tableSchemaCell.required;
                    const isMissingArrayField = isEmptyCell &&
                        isArrayData &&
                        tableSchemaCell.required &&
                        tableSchemaCell.isArray &&
                        !tableSchema.every((tCell, idxCell) => {
                            return (tCell.databaseName.split('.')[0] !==
                                tableSchemaCell.databaseName.split('.')[0] ||
                                excelRow[idxCell] === null ||
                                excelRow[idxCell] === undefined);
                        });
                    if (isMissingField || isMissingArrayField)
                        throw new common_1.BadRequestException(`Is missing an required field value on ${actualCell}`);
                    if (isArrayData && !tableSchemaCell.isArray && !isEmptyCell)
                        throw new common_1.BadRequestException(`This is not an array property on ${actualCell}`);
                    if (isEmptyCell)
                        return;
                    let checkedData = tableSchemaCell.checkHandler(excelCell);
                    if (checkedData === false && excelCell != '-')
                        throw new common_1.BadRequestException(`Invalid data on ${actualCell}`);
                    if (checkedData === 'false')
                        checkedData = false;
                    const nestedObject = (0, transformStringToObject_1.transformStringToObject)(tableSchemaCell.databaseName, checkedData);
                    const firstParam = tableSchemaCell.databaseName.split('.')[0];
                    const isMultipleParams = tableSchemaCell.databaseName.split('.').length > 1;
                    if (tableSchemaCell.isArray) {
                        if (!databaseRow[firstParam])
                            databaseRow[firstParam] = [];
                        if (saveIndexes.hasSaved === false) {
                            saveIndexes.indexDatabase = databaseRow[firstParam].length;
                            saveIndexes.hasSaved = true;
                        }
                        const indexRowArray = saveIndexes.indexDatabase;
                        if (isMultipleParams) {
                            if (!databaseRow[firstParam][indexRowArray])
                                databaseRow[firstParam][indexRowArray] = {};
                            return (databaseRow[firstParam][indexRowArray] = Object.assign(Object.assign({}, databaseRow[firstParam][indexRowArray]), nestedObject[firstParam]));
                        }
                        if (!isMultipleParams) {
                            return (databaseRow[firstParam][indexRowArray] =
                                nestedObject[firstParam]);
                        }
                    }
                    if (!tableSchemaCell.isArray) {
                        if (isMultipleParams) {
                            if (!databaseRow[firstParam])
                                databaseRow[firstParam] = {};
                            return (databaseRow[firstParam] = Object.assign(Object.assign({}, databaseRow[firstParam]), nestedObject[firstParam]));
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
            if (indexRow === 0)
                transformStep.version = Number(excelRow[1]);
            if (!sameLength)
                return;
            const isTableHeader = excelHeader.every((column, i) => excelRow[i] == column);
            if (isTableHeader)
                transformStep.startMap = true;
        });
        if (databaseRows.length === 0 && !transformStep.startMap)
            throw new common_1.BadRequestException(errorMessage_1.ErrorMessageEnum.FILE_WRONG_TABLE_HEAD);
        return { rows: databaseRows, version: transformStep.version };
    }
};
ExcelProvider = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExcelProvider);
exports.ExcelProvider = ExcelProvider;
//# sourceMappingURL=ExcelProvider.js.map