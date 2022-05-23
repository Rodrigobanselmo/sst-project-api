"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyUniqueColumnsConstant = void 0;
const client_1 = require("@prisma/client");
const excel_workplace_notes_1 = require("../../../../../modules/files/utils/notes/excel-workplace-notes");
const statusEnum_translate_1 = require("../../../../../shared/utils/translate/statusEnum.translate");
const checkIdNumber_1 = require("../../../../../shared/utils/validators/checkIdNumber");
const checkIsEnum_1 = require("../../../../../shared/utils/validators/checkIsEnum");
const checkIsString_1 = require("../../../../../shared/utils/validators/checkIsString");
const checkIsValidCnpj_1 = require("../../../../../shared/utils/validators/checkIsValidCnpj");
exports.companyUniqueColumnsConstant = [
    {
        databaseName: 'id',
        isId: true,
        excelName: 'ID',
        required: true,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'cnpj',
        excelName: 'CNPJ',
        required: true,
        checkHandler: checkIsValidCnpj_1.checkIsValidCnpj,
    },
    {
        databaseName: 'name',
        excelName: 'Nome',
        required: true,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'fantasy',
        excelName: 'Nome fantasia',
        required: true,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'employees.id',
        isId: true,
        excelName: 'ID (Empregado)',
        isArray: true,
        required: false,
        checkHandler: checkIdNumber_1.checkIsNumber,
    },
    {
        databaseName: 'employees.name',
        excelName: 'Nome do empregado',
        isArray: true,
        required: true,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'employees.cpf',
        excelName: 'CPF do empregado',
        isArray: true,
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'employees.workplaceId',
        excelName: 'Área de trabalho (ID)',
        isArray: true,
        required: true,
        notes: excel_workplace_notes_1.excelWorkplaceNotes,
        checkHandler: checkIdNumber_1.checkIsNumber,
    },
    {
        databaseName: 'employees.directory',
        excelName: 'Diretória',
        isArray: true,
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'employees.management',
        excelName: 'Gereência',
        isArray: true,
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'employees.sector',
        excelName: 'Setor',
        isArray: true,
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'employees.sub_sector',
        excelName: 'Sub Setor',
        isArray: true,
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'employees.office',
        excelName: 'Cargo',
        isArray: true,
        required: true,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'employees.sub_office',
        excelName: 'Cargo desenvolvido',
        isArray: true,
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'employees.status',
        excelName: 'Status',
        isEnum: [statusEnum_translate_1.StatusEnumTranslated.ACTIVE, statusEnum_translate_1.StatusEnumTranslated.INACTIVE],
        isArray: true,
        notes: [statusEnum_translate_1.StatusEnumTranslated.ACTIVE, statusEnum_translate_1.StatusEnumTranslated.INACTIVE],
        required: false,
        checkHandler: (value) => (0, checkIsEnum_1.checkIsEnum)((0, statusEnum_translate_1.statusEnumTranslateBrToUs)(value), client_1.StatusEnum),
    },
];
//# sourceMappingURL=companyUniqueColumns.constant.js.map