"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.professionalsIterable = void 0;
const elements_types_1 = require("../../../builders/pgr/types/elements.types");
const variables_enum_1 = require("../../../builders/pgr/enums/variables.enum");
const professionals_converter_1 = require("./professionals.converter");
const docx_1 = require("docx");
const professionalsIterable = (professionalEntity, workspace, convertToDocx) => {
    if (!(professionalEntity === null || professionalEntity === void 0 ? void 0 : professionalEntity.length))
        return [];
    const professionalsVariablesArray = (0, professionals_converter_1.ProfessionalsConverter)(professionalEntity, workspace);
    const baseSection = [
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
            text: '**Profissionais:**',
        },
    ];
    const iterableSections = professionalsVariablesArray
        .map((variables) => {
        let text = '';
        if (variables[variables_enum_1.VariablesPGREnum.PROFESSIONAL_FORMATION])
            text = `??${variables_enum_1.VariablesPGREnum.PROFESSIONAL_FORMATION}??\n`;
        if (variables[variables_enum_1.VariablesPGREnum.PROFESSIONAL_CREA])
            text = `${text}??${variables_enum_1.VariablesPGREnum.PROFESSIONAL_CREA}??\n`;
        if (variables[variables_enum_1.VariablesPGREnum.PROFESSIONAL_CPF])
            text = `${text}CPF: ${variables[variables_enum_1.VariablesPGREnum.PROFESSIONAL_CPF]}\n`;
        if (variables[variables_enum_1.VariablesPGREnum.PROFESSIONAL_CERTIFICATIONS])
            text = `${text}${variables[variables_enum_1.VariablesPGREnum.PROFESSIONAL_CERTIFICATIONS]}`;
        return convertToDocx([
            {
                type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                text: `**??${variables_enum_1.VariablesPGREnum.PROFESSIONAL_NAME}??**`,
            },
            {
                type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                text,
                align: docx_1.AlignmentType.START,
            },
        ], variables);
    })
        .reduce((acc, curr) => {
        return [...acc, ...curr];
    }, []);
    return [...convertToDocx(baseSection), ...iterableSections];
};
exports.professionalsIterable = professionalsIterable;
//# sourceMappingURL=professionals.iterable.js.map