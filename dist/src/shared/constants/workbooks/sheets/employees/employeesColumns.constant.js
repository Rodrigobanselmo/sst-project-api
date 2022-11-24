"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeesColumnsConstant = void 0;
const client_1 = require("@prisma/client");
const excel_workspace_notes_1 = require("../../../../../modules/files/utils/notes/excel-workspace-notes");
const checkIsValidDate_1 = require("../../../../../shared/utils/validators/checkIsValidDate");
const checkIsEnum_1 = require("../../../../utils/validators/checkIsEnum");
const checkIsString_1 = require("../../../../utils/validators/checkIsString");
const sexType_translate_1 = require("./../../../../utils/translate/sexType.translate");
const checkIsValidCpf_1 = require("./../../../../utils/validators/checkIsValidCpf");
exports.employeesColumnsConstant = [
    {
        databaseName: 'cpf',
        excelName: 'CPF do empregado',
        isArray: false,
        required: true,
        checkHandler: checkIsValidCpf_1.checkIsValidCpf,
    },
    {
        databaseName: 'name',
        excelName: 'Nome do empregado',
        isArray: false,
        required: true,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'sex',
        excelName: 'Sexo',
        isEnum: sexType_translate_1.SexTypeEnumTranslatedList,
        isArray: false,
        notes: sexType_translate_1.SexTypeEnumTranslatedNotes,
        required: false,
        checkHandler: (value) => (0, checkIsEnum_1.checkIsEnum)((0, sexType_translate_1.SexTypeEnumTranslateBrToUs)(value), client_1.SexTypeEnum),
    },
    {
        databaseName: 'birthday',
        excelName: 'Nascimento',
        isArray: false,
        required: false,
        checkHandler: checkIsValidDate_1.checkIsValidDate,
    },
    {
        databaseName: 'birthday',
        excelName: 'Nascimento',
        isArray: false,
        required: false,
        checkHandler: checkIsValidDate_1.checkIsValidDate,
    },
    {
        databaseName: 'admissionDate',
        excelName: 'Admissão',
        isArray: false,
        required: true,
        checkHandler: checkIsValidDate_1.checkIsValidDate,
    },
    {
        databaseName: 'abbreviation',
        excelName: 'Estabelecimento (Área de trabalho)',
        isArray: true,
        required: true,
        notes: excel_workspace_notes_1.excelWorkspaceNotes,
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
        required: true,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'sub_sector',
        excelName: 'Sub Setor',
        isArray: false,
        required: false,
        checkHandler: checkIsString_1.checkIsString,
        notes: 'No caso de haver importação de dados de outra empresa, usar "//" para indicar nome de referecia (ex.: "Analista SR//Analista")',
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
        databaseName: 'ghoName',
        excelName: 'GSE',
        isArray: false,
        required: false,
        notes: ['somente conecta um GSE ao cargo, para remover-lo deve-se usar o sistema'],
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
        databaseName: 'esocialCode',
        excelName: 'Matricula eSocial',
        isArray: false,
        required: false,
        checkHandler: checkIsString_1.checkIsString,
    },
    {
        databaseName: 'lastExam',
        excelName: 'Data último exame',
        isArray: false,
        required: false,
        checkHandler: checkIsValidDate_1.checkIsValidDate,
    },
    {
        databaseName: 'updated_at',
        excelName: 'Última atualização',
        isArray: false,
        required: false,
        checkHandler: checkIsValidDate_1.checkIsValidDate,
    },
];
//# sourceMappingURL=employeesColumns.constant.js.map