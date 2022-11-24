"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allCharacterizationSections = void 0;
const client_1 = require("@prisma/client");
const docx_1 = require("docx");
const string_sort_1 = require("../../../../../../shared/utils/sorts/string.sort");
const variables_enum_1 = require("../../../builders/pgr/enums/variables.enum");
const elements_types_1 = require("../../../builders/pgr/types/elements.types");
const hierarchyHomoOrg_table_1 = require("../../tables/hierarchyHomoOrg/hierarchyHomoOrg.table");
const all_characterization_converter_1 = require("./all-characterization.converter");
const CharacterizationRepository_1 = require("../../../../../../modules/company/repositories/implementations/CharacterizationRepository");
const getData = (hierarchiesTreeOrg, homoGroupTree, titleSection, convertToDocx, { variables, id, risks, considerations: cons, activities: ac, type, paragraphs }) => {
    const parameters = [];
    const riskFactors = [];
    const considerations = [];
    const offices = [];
    const activities = [];
    const paragraphSection = [];
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
            text: `Iluminância: ??${variables_enum_1.VariablesPGREnum.ENVIRONMENT_LUMINOSITY}?? LUX`,
        });
    }
    if (parameters.length) {
        parameters.unshift({
            type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
            text: '**Parâmetros ambientais:**',
            spacing: { after: 100 },
        });
    }
    risks.forEach((risk, index) => {
        if (index === 0)
            riskFactors.push({
                type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                text: '**Fatores de risco:**',
                spacing: { after: 100 },
            });
        riskFactors.push({
            type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
            level: 0,
            text: `${risk.name} (${risk.type})`,
            alignment: docx_1.AlignmentType.START,
        });
    });
    paragraphs.forEach((paragraph) => {
        paragraphSection.push(Object.assign({}, getSentenceType(paragraph)));
    });
    cons.forEach((consideration, index) => {
        if (index === 0)
            considerations.push({
                type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                text: '**Considerações:**',
                spacing: { after: 100 },
            });
        considerations.push(Object.assign({}, getSentenceType(consideration)));
    });
    ac.forEach((activity, index) => {
        if (index === 0)
            activities.push({
                type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                text: '**Descrição das Atividades:**',
                spacing: { after: 100 },
            });
        activities.push(Object.assign({}, getSentenceType(activity)));
    });
    const ProfileTitle = [
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
            text: `??${variables_enum_1.VariablesPGREnum.PROFILE_NAME}??`,
            size: 11,
            border: {
                bottom: {
                    color: 'auto',
                    space: 1,
                    style: docx_1.BorderStyle.SINGLE,
                    size: 6,
                },
            },
        },
    ];
    const { table: officesTable, missingBody } = (0, hierarchyHomoOrg_table_1.hierarchyHomoOrgTable)(hierarchiesTreeOrg, homoGroupTree, {
        showDescription: false,
        showHomogeneous: true,
        type: (0, CharacterizationRepository_1.getCharacterizationType)(type),
        groupIdFilter: id,
    });
    if (!missingBody) {
        const titleTable = [
            {
                type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
                text: `Cargos lotados no ${titleSection} ??${variables_enum_1.VariablesPGREnum.CHARACTERIZATION_NAME}??`,
            },
        ];
        offices.push(...convertToDocx(titleTable, variables));
        offices.push(officesTable);
    }
    const section = [
        ...convertToDocx([...ProfileTitle], variables),
        ...convertToDocx([
            {
                type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                text: `??${variables_enum_1.VariablesPGREnum.ENVIRONMENT_DESCRIPTION}??`,
                alignment: docx_1.AlignmentType.START,
                removeWithSomeEmptyVars: [variables_enum_1.VariablesPGREnum.ENVIRONMENT_DESCRIPTION],
            },
            ...paragraphSection,
            ...riskFactors,
            ...parameters,
            ...activities,
            ...considerations,
        ], variables),
        ...offices,
    ];
    return section;
};
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
const environmentTypes = [
    {
        title: 'Visão Geral',
        type: client_1.CharacterizationTypeEnum.GENERAL,
        desc: 'Geral',
    },
    {
        title: 'Ambientes Administrativos',
        desc: 'Ambiente Administrativo',
        type: client_1.CharacterizationTypeEnum.ADMINISTRATIVE,
    },
    {
        title: 'Ambientes Operacionais',
        desc: 'Ambiente Operacional',
        type: client_1.CharacterizationTypeEnum.OPERATION,
    },
    {
        title: 'Ambiente de Apoio',
        desc: 'Ambiente de Apoio',
        type: client_1.CharacterizationTypeEnum.SUPPORT,
    },
];
const characterizationTypes = [
    {
        title: 'Posto de Trabalho',
        desc: 'Posto de Trabalho',
        type: client_1.CharacterizationTypeEnum.WORKSTATION,
    },
    {
        title: 'Atividades',
        desc: 'Atividades',
        type: client_1.CharacterizationTypeEnum.ACTIVITIES,
    },
    {
        title: 'Equipamentos',
        desc: 'Equipamentos',
        type: client_1.CharacterizationTypeEnum.EQUIPMENT,
    },
];
const allCharacterizationSections = (environmentsData, hierarchiesTreeOrg, homoGroupTree, type = 'char', convertToDocx) => {
    const sections = [];
    const sectionProfiles = {};
    (type === 'char' ? characterizationTypes : environmentTypes).forEach(({ type, title: titleSection, desc }) => {
        const environments = environmentsData.filter((e) => e.type === type || !!e.profileParentId);
        if (!(environments === null || environments === void 0 ? void 0 : environments.length))
            return;
        const environmentData = (0, all_characterization_converter_1.environmentsConverter)(environments);
        let firstPass = true;
        environmentData
            .sort((a, b) => (0, string_sort_1.sortString)(b, a, 'profileParentId'))
            .forEach(({ variables, elements, id, risks, considerations: cons, breakPage, activities: ac, profileParentId, profiles, type, paragraphs }) => {
            const title = [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H3,
                    text: `${desc}: ??${variables_enum_1.VariablesPGREnum.ENVIRONMENT_NAME}??`,
                },
            ];
            const otherSections = getData(hierarchiesTreeOrg, homoGroupTree, titleSection, convertToDocx, {
                variables,
                id,
                risks,
                considerations: cons,
                activities: ac,
                type,
                paragraphs,
            });
            if (profileParentId) {
                otherSections.unshift(...convertToDocx([
                    {
                        type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                        text: ``,
                    },
                ], variables));
                sectionProfiles[id] = otherSections;
                return;
            }
            const section = [
                ...convertToDocx([...title], variables),
                ...elements,
                ...otherSections,
                ...profiles.map((profile) => sectionProfiles[profile.id]).reduce((acc, curr) => (curr ? [...acc, ...curr] : acc), []),
            ];
            if (firstPass) {
                section.unshift(...convertToDocx([
                    {
                        type: elements_types_1.PGRSectionChildrenTypeEnum.H2,
                        text: titleSection,
                    },
                ]));
                firstPass = false;
            }
            if (breakPage || sections.length === 0)
                sections.push(section);
            else {
                sections[sections.length - 1] = [...(sections[sections.length - 1] || []), ...section];
            }
        });
    });
    return sections.map((section) => ({
        footerText: `??${variables_enum_1.VariablesPGREnum.CHAPTER_2}??`,
        children: section,
    }));
};
exports.allCharacterizationSections = allCharacterizationSections;
//# sourceMappingURL=all-characterization.sections.js.map