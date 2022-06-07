"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hierarchiesColumnsConstant = void 0;
const client_1 = require("@prisma/client");
const excel_workspace_notes_1 = require("../../../../../modules/files/utils/notes/excel-workspace-notes");
const statusEnum_translate_1 = require("../../../../utils/translate/statusEnum.translate");
const checkIsEnum_1 = require("../../../../utils/validators/checkIsEnum");
const checkIsString_1 = require("../../../../utils/validators/checkIsString");
exports.hierarchiesColumnsConstant = [
    {
        databaseName: 'abbreviation',
        excelName: 'Estabelecimento (Área de trabalho)',
        isArray: true,
        required: true,
        notes: excel_workspace_notes_1.excelWorkspaceNotes,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'ghoName',
        excelName: 'GSE',
        isArray: false,
        required: false,
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
        databaseName: 'description',
        excelName: 'Descrição do cargo',
        isArray: false,
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'realDescription',
        excelName: 'Descrição real do cargo (entrevista com trabalhador)',
        isArray: false,
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'ghoDescription',
        excelName: 'Descrição do GSE',
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
//# sourceMappingURL=hierarchiesColumns.constant.js.map