"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signaturesIterable = void 0;
const docx_1 = require("docx");
const arrayChunks_1 = require("../../../../../../shared/utils/arrayChunks");
const variables_enum_1 = require("../../../builders/pgr/enums/variables.enum");
const elements_types_1 = require("../../../builders/pgr/types/elements.types");
const body_1 = require("./elements/body");
const signatures_converter_1 = require("./signatures.converter");
const signaturesIterable = (signatureEntity, workspace, convertToDocx) => {
    if (!(signatureEntity === null || signatureEntity === void 0 ? void 0 : signatureEntity.length))
        return [];
    const signaturesVariablesArray = (0, signatures_converter_1.SignaturesConverter)(signatureEntity, workspace);
    const iterableSections = signaturesVariablesArray.map((variables) => {
        const credentials = [];
        if (variables[variables_enum_1.VariablesPGREnum.PROFESSIONAL_NAME])
            credentials.push(`**??${variables_enum_1.VariablesPGREnum.PROFESSIONAL_NAME}??**`);
        if (variables[variables_enum_1.VariablesPGREnum.PROFESSIONAL_FORMATION])
            credentials.push(`??${variables_enum_1.VariablesPGREnum.PROFESSIONAL_FORMATION}??`);
        if (variables[variables_enum_1.VariablesPGREnum.PROFESSIONAL_CREA])
            credentials.push(`??${variables_enum_1.VariablesPGREnum.PROFESSIONAL_CREA}??`);
        if (variables[variables_enum_1.VariablesPGREnum.PROFESSIONAL_CPF])
            credentials.push(`CPF: ${variables[variables_enum_1.VariablesPGREnum.PROFESSIONAL_CPF]}`);
        return convertToDocx([
            ...credentials.map((credential) => ({
                type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                text: credential,
                align: docx_1.AlignmentType.CENTER,
                spacing: { after: 0, before: 0 },
                size: 8,
            })),
        ], variables);
    });
    const tableBodyElements = new body_1.TableBodyElements();
    const iterableSectionsChunks = (0, arrayChunks_1.arrayChunks)(iterableSections, 3, {
        balanced: true,
    });
    const emptyParagraph = tableBodyElements.tableCell({
        data: [new docx_1.Paragraph({})],
        empty: true,
    });
    const marginParagraph = tableBodyElements.tableCell({
        data: [new docx_1.Paragraph({})],
        empty: true,
        width: { size: 5, type: docx_1.WidthType.PERCENTAGE },
    });
    const getRows = (dataChuck) => {
        if (dataChuck.length == 0) {
            return [
                emptyParagraph,
                tableBodyElements.tableCell({
                    data: [new docx_1.Paragraph({ text: 'NOME DO ASSINANTE' })],
                }),
                emptyParagraph,
            ];
        }
        if (dataChuck.length == 1) {
            return [emptyParagraph, tableBodyElements.tableCell({ data: dataChuck[0] }), emptyParagraph];
        }
        if (dataChuck.length == 2) {
            return [
                marginParagraph,
                tableBodyElements.tableCell({ data: dataChuck[0] }),
                marginParagraph,
                tableBodyElements.tableCell({ data: dataChuck[1] }),
                marginParagraph,
            ];
        }
        if (dataChuck.length == 3) {
            return [
                marginParagraph,
                tableBodyElements.tableCell({ data: dataChuck[0] }),
                marginParagraph,
                tableBodyElements.tableCell({ data: dataChuck[1] }),
                marginParagraph,
                tableBodyElements.tableCell({ data: dataChuck[2] }),
                marginParagraph,
            ];
        }
    };
    const table = new docx_1.Table({
        width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
        rows: [tableBodyElements.tableRow([marginParagraph]), ...iterableSectionsChunks.map((dataChuck) => tableBodyElements.tableRow([...getRows(dataChuck)]))],
    });
    return [table];
};
exports.signaturesIterable = signaturesIterable;
//# sourceMappingURL=signatures.iterable.js.map