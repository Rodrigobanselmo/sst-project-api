"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environmentIterable = void 0;
const docx_1 = require("docx");
const variables_enum_1 = require("../../../builders/pgr/enums/variables.enum");
const elements_types_1 = require("../../../builders/pgr/types/elements.types");
const all_characterization_converter_1 = require("./all-characterization.converter");
const environmentIterable = (environments, convertToDocx) => {
    if (!(environments === null || environments === void 0 ? void 0 : environments.length))
        return [];
    const environmentData = (0, all_characterization_converter_1.environmentsConverter)(environments);
    const getSentenceType = (sentence) => {
        const splitSentence = sentence.split('{type}=');
        if (splitSentence.length == 2) {
            const value = splitSentence[1];
            if (elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH == value) {
                return {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: splitSentence[0],
                };
            }
            if (elements_types_1.PGRSectionChildrenTypeEnum.BULLET == value.split('-')[0]) {
                return {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: splitSentence[0],
                    level: value.split('-')[1] || 0,
                };
            }
        }
        return {
            type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
            text: splitSentence[0],
        };
    };
    const iterableSections = environmentData
        .map(({ variables, elements, risks, considerations: cons, breakPage }) => {
        const parameters = [];
        const riskFactors = [];
        const considerations = [];
        if (variables[variables_enum_1.VariablesPGREnum.ENVIRONMENT_NOISE]) {
            parameters.push({
                type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                level: 0,
                text: `Ruído ambiente (Maior Valor Medido): ??${variables_enum_1.VariablesPGREnum.ENVIRONMENT_NOISE}?? dB(A)`,
            });
        }
        if (variables[variables_enum_1.VariablesPGREnum.ENVIRONMENT_TEMPERATURE]) {
            parameters.push({
                type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                level: 0,
                text: `Temperatura do ar: ??${variables_enum_1.VariablesPGREnum.ENVIRONMENT_TEMPERATURE}?? ºC`,
            });
        }
        if (variables[variables_enum_1.VariablesPGREnum.ENVIRONMENT_MOISTURE]) {
            parameters.push({
                type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                level: 0,
                text: `Umidade do ar: ??${variables_enum_1.VariablesPGREnum.ENVIRONMENT_MOISTURE}??%`,
            });
        }
        if (variables[variables_enum_1.VariablesPGREnum.ENVIRONMENT_LUMINOSITY]) {
            parameters.push({
                type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                level: 0,
                text: `Umidade do ar: ??${variables_enum_1.VariablesPGREnum.ENVIRONMENT_LUMINOSITY}??%`,
            });
        }
        if (parameters.length) {
            parameters.unshift({
                type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                text: '**Parâmetros ambientais:**',
            });
        }
        risks.forEach((risk, index) => {
            if (index === 0)
                riskFactors.push({
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '**Fatores de risco:**',
                });
            riskFactors.push({
                type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                level: 0,
                text: `${risk.name} (${risk.type})`,
                alignment: docx_1.AlignmentType.START,
            });
            if (index === risks.length - 1)
                riskFactors.push({
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '',
                    removeWithSomeEmptyVars: [variables_enum_1.VariablesPGREnum.ENVIRONMENT_DESCRIPTION],
                });
        });
        cons.forEach((consideration, index) => {
            if (index === 0)
                considerations.push({
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '**Considerações:**',
                });
            considerations.push(Object.assign({}, getSentenceType(consideration)));
        });
        const title = [
            {
                type: elements_types_1.PGRSectionChildrenTypeEnum.H2,
                text: `??${variables_enum_1.VariablesPGREnum.ENVIRONMENT_NAME}??`,
            },
        ];
        if (breakPage)
            title.unshift({ type: elements_types_1.PGRSectionChildrenTypeEnum.BREAK });
        return [
            ...convertToDocx([...title], variables),
            ...elements,
            ...convertToDocx([
                ...riskFactors,
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: `??${variables_enum_1.VariablesPGREnum.ENVIRONMENT_DESCRIPTION}??`,
                    alignment: docx_1.AlignmentType.START,
                    removeWithSomeEmptyVars: [variables_enum_1.VariablesPGREnum.ENVIRONMENT_DESCRIPTION],
                },
                ...parameters,
                ...considerations,
            ], variables),
        ];
    })
        .reduce((acc, curr) => {
        return [...acc, ...curr];
    }, []);
    return iterableSections;
};
exports.environmentIterable = environmentIterable;
//# sourceMappingURL=all-characterization.iterable.js.map