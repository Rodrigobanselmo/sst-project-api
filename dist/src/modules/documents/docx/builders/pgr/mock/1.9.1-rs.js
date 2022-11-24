"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rs = void 0;
const variables_enum_1 = require("../enums/variables.enum");
const elements_types_1 = require("../types/elements.types");
const section_types_1 = require("../types/section.types");
exports.rs = {
    footer: true,
    header: true,
    data: [
        {
            type: section_types_1.PGRSectionTypeEnum.SECTION,
            footerText: `??${variables_enum_1.VariablesPGREnum.CHAPTER_1}??`,
            removeWithSomeEmptyVars: [variables_enum_1.VariablesPGREnum.IS_RS],
            children: [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H4,
                    text: 'Comunicação e Registro do Acidente de Trabalho – SES-RS',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'A Secretaria Estadual da Saúde do Rio Grande do Sul – SES-RS – através do Decreto 40.222/2000, implantou o Sistema de Informação em Saúde do Trabalhador – SIST/RS – visando estabelecer a notifica- ção compulsória de todos os acidentes e doenças relacionadas ao trabalho no Rio Grande do Sul. Para viabilizar o fluxo de informação das notificações foram elaborados os formulários em papel do RINA (Re- latório Individual de Notificação de Agravos) e uma base de dados em EPINFO onde estes formulários em papel deveriam ser digitados. Agora o Sistema de Informação em Saúde do Trabalhador avançou, já se encontra disponível a notificação pela rede de Internet. O endereço é <link>http://www.sist.saude.rs.gov.br|www.sist.saude.rs.gov.br<link>.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'Para a formalização da comunicação e registro, bem como da investigação do Acidente de Trabalho, poderá ser utilizado o modelo de formulário abaixo, customizado de acordo com as características da empresa:',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.RS_IMAGE,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_FIGURE,
                    text: 'Exemplo de relatório de investigação de acidents',
                },
            ],
        },
    ],
};
//# sourceMappingURL=1.9.1-rs.js.map