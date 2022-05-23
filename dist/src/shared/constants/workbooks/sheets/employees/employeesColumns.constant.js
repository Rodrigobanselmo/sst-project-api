"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeesColumnsConstant = void 0;
const client_1 = require("@prisma/client");
const excel_workplace_notes_1 = require("../../../../../modules/files/utils/notes/excel-workplace-notes");
const statusEnum_translate_1 = require("../../../../utils/translate/statusEnum.translate");
const checkIsEnum_1 = require("../../../../utils/validators/checkIsEnum");
const checkIsString_1 = require("../../../../utils/validators/checkIsString");
exports.employeesColumnsConstant = [
    {
        databaseName: 'name',
        excelName: 'Nome do empregado',
        isArray: false,
        required: true,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'cpf',
        excelName: 'CPF do empregado',
        isArray: false,
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'abbreviation',
        excelName: 'Unidade (Área de trabalho)',
        isArray: false,
        required: true,
        notes: excel_workplace_notes_1.excelWorkplaceNotes,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'directory',
        excelName: 'Diretória',
        isArray: false,
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'management',
        excelName: 'Gereência',
        isArray: false,
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'sector',
        excelName: 'Setor',
        isArray: false,
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'sub_sector',
        excelName: 'Sub Setor',
        isArray: false,
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'office',
        excelName: 'Cargo',
        isArray: false,
        required: true,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'sub_office',
        excelName: 'Cargo desenvolvido',
        isArray: false,
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'status',
        excelName: 'Status',
        isEnum: [statusEnum_translate_1.StatusEnumTranslated.ACTIVE, statusEnum_translate_1.StatusEnumTranslated.INACTIVE],
        isArray: false,
        notes: [statusEnum_translate_1.StatusEnumTranslated.ACTIVE, statusEnum_translate_1.StatusEnumTranslated.INACTIVE],
        required: false,
        checkHandler: (value) => (0, checkIsEnum_1.checkIsEnum)((0, statusEnum_translate_1.statusEnumTranslateBrToUs)(value), client_1.StatusEnum),
    },
];
//# sourceMappingURL=employeesColumns.constant.js.map