"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endSection = void 0;
const docx_1 = require("docx");
const DayJSProvider_1 = require("../../../../../../shared/providers/DateProvider/implementations/DayJSProvider");
const variables_enum_1 = require("../enums/variables.enum");
const elements_types_1 = require("../types/elements.types");
const section_types_1 = require("../types/section.types");
exports.endSection = {
    footer: true,
    header: true,
    data: [
        {
            type: section_types_1.PGRSectionTypeEnum.SECTION,
            footerText: `??${variables_enum_1.VariablesPGREnum.CHAPTER_3}??`,
            children: [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H1,
                    text: 'ENCERRAMENTO',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'Este trabalho tem a validade legal para as condições analisadas, onde quaisquer alterações que venham a ocorrer no âmbito da distribuição física ao processo de trabalho da empresa, tornarão este Programa sem validade, isentando o profissional de qualquer responsabilidade. Neste caso, haverá necessidade de realizar-se novo estudo e um novo documento.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'Na certeza de que, através de o referido trabalho tenha atendido aos objetivos de um PGR de que fora incumbido, submeto este à apreciação de quem possa interessar.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: `??${variables_enum_1.VariablesPGREnum.COMPANY_SIGNER_CITY}??, ${(0, DayJSProvider_1.dayjs)().format('D [de] MMMM [de] YYYY')}`,
                    alignment: docx_1.AlignmentType.RIGHT,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PROFESSIONALS_SIGNATURES,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '**Notas:**',
                    size: 8,
                    spacing: { after: 0, before: 0 },
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'Essa assinatura digital está conforme regulamentação da ICP-Brasil e pode ser validada através do seguinte link: <link>https://verificador.iti.br|www.verificador.iti.br<link>',
                    size: 8,
                    spacing: { after: 0, before: 0 },
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'O Verificador de Conformidade do Padrão de Assinatura Digital mantido pelo Instituto Nacional de Tecnologia da Informação, objetiva aferir a conformidade de assinaturas eletrônicas qualificadas e avançadas existentes em um arquivo assinado em relação à regulamentação da ICP-Brasil e às definições contidas na Medida Provisória n.º 2.200-2, de 24 de agosto de 2001, na Lei n.º 14.063, de 23 de setembro de 2020 e no Decreto n.º 10.543, de 13 de novembro de 2020.',
                    size: 8,
                    spacing: { after: 0, before: 0 },
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'Assinaturas com certificados digitais de outras infraestruturas que não sejam da ICP-Brasil ou GOV.BR não são objetos alvos desse verificador e serão recusados para verificação.',
                    size: 8,
                    spacing: { after: 0, before: 0 },
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'São passíveis de verificação os arquivos produzidos nos formatos CAdES, XAdES e PAdES, nas modalidades embarcadas ou destacadas, previstos na Resolução CG ICP-Brasil n.º 182, de 18 de fevereiro de 2021, que traz uma visão geral sobre assinaturas digitais, define os principais conceitos e lista os demais documentos que compõem as normas da ICP-Brasil sobre o assunto, e a Portaria Conjunta ITI/CC/PR SGD/SEDGG/ME n.º 1, de 8 de setembro de 2021, que estabelece os padrões criptográficos referenciais para as assinaturas eletrônicas avançadas nas comunicações que envolvam a administração pública federal direta, autárquica e fundacional.',
                    size: 8,
                    spacing: { after: 0, before: 0 },
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'O resultado bem-sucedido da verificação de arquivo assinado digitalmente com certificado ICP-Brasil ou GOV.BR, quando submetido ao Verificador de Conformidade, resultará nas seguintes situações: Aprovado, Reprovado ou Indeterminado, conforme a norma ETSI EN 319 102-1 V1.1.1. (2016-05), aprovada quando atender a regulamentação da ICP-Brasil, no caso de assinaturas eletrônicas qualificadas ou em conformidade à regulamentação GOV.BR para assinaturas eletrônicas avançadas.',
                    size: 8,
                    spacing: { after: 0, before: 0 },
                },
            ],
        },
    ],
};
//# sourceMappingURL=2.9-end.js.map