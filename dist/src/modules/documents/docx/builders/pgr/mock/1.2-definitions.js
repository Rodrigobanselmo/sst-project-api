"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definitions2Section = void 0;
const docx_1 = require("docx");
const variables_enum_1 = require("../enums/variables.enum");
const elements_types_1 = require("../types/elements.types");
const section_types_1 = require("../types/section.types");
exports.definitions2Section = {
    footer: true,
    header: true,
    data: [
        {
            type: section_types_1.PGRSectionTypeEnum.SECTION,
            footerText: `??${variables_enum_1.VariablesPGREnum.CHAPTER_1}??`,
            children: [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '**Definição do Risco de Acidente**',
                    alignment: docx_1.AlignmentType.CENTER,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'Para melhor clareza se faz necessário se decompor o conceito, sendo assim vamos para as definições de risco e acidentes separadamente:',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '**Risco:** Exposição de pessoas a perigos. O risco pode ser dimensionado em função da probabilidade e da gravidade do dano possível.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '**(GUIA DE ANÁLISE ACIDENTES DE TRABALHO – MTE 2010)**',
                    alignment: docx_1.AlignmentType.END,
                    size: 8,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '**Acidente:**',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '1) acontecimento casual, fortuito, inesperado; ocorrência',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '2) qualquer acontecimento, desagradável ou infeliz, que envolva dano, perda, sofrimento ou morte.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '**(Dicionário Versão 2.3.0 (268) Copyright © 2005–2020 Apple Inc. Todos os direitos reservados.)**',
                    alignment: docx_1.AlignmentType.END,
                    size: 8,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'Vale ressaltar que a definição de acidente pode ser muito mais abrangente com diversos significados, mas iremos aqui restringi-lo as definições acima que se aplica adequadamente a uma de suas locuções: Acidente de Trabalho.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'Sendo assim, segue a definição de Acidente de Trabalho:',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '**ACIDENTE DE TRABALHO:** Ocorrência geralmente não planejada que resulta em dano à saúde ou integridade física de trabalhadores ou de indivíduos do publico. Exemplo: andaime cai sobre a perna de um trabalhador que sofre fratura da tíbia.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '**(GUIA DE ANÁLISE ACIDENTES DE TRABALHO – MTE 2010).**',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'É importante destacar que o Acidente do Trabalho também tem outras definições mais abrangentes, principalmente quando se refere a legislação previdenciária, mas ao aplicá-la com caráter prevencionista e didático a definição acima é mais adequada.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'Diante do apresentado podemos definir Risco de Acidente para efeito do PGR como:',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '**Risco de Acidente:** Ocorrência de qualquer evento que possa expor as pessoas (trabalhadores/público) a perigos independente da probabilidade de sua ocorrência e da magnitude dos seus possíveis danos. (Marins, Alex);',
                },
            ],
        },
    ],
};
//# sourceMappingURL=1.2-definitions.js.map