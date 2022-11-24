"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environmentSection = void 0;
const variables_enum_1 = require("../enums/variables.enum");
const elements_types_1 = require("../types/elements.types");
const section_types_1 = require("../types/section.types");
exports.environmentSection = {
    footer: true,
    header: true,
    data: [
        {
            type: section_types_1.PGRSectionTypeEnum.CHAPTER,
            text: `??${variables_enum_1.VariablesPGREnum.CHAPTER_2}??`,
        },
        {
            type: section_types_1.PGRSectionTypeEnum.SECTION,
            footerText: `??${variables_enum_1.VariablesPGREnum.CHAPTER_2}??`,
            children: [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.TITLE,
                    text: `??${variables_enum_1.VariablesPGREnum.CHAPTER_2}?? (NR-01 ‘itens’ 1.5.4.2 e 1.5.4.3)`,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H1,
                    text: 'CARACTERIZAÇÃO DOS PROCESSOS E AMBIENTES DE TRABALHO (NR-01 ‘itens’ 1.5.4.2 e 1.5.7.3.2 alínea a)',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: `A caracterização dos ambientes de trabalho é uma ferramenta importante na graduação do Risco Ocupacional dos empregados, pois fornece uma visão geral dos processos, dos riscos presentes e das fontes geradoras desses riscos. Através da análise de fluxogramas, layouts, diagramas e da própria descrição de cada processo de trabalho, podemos identificar oportunidades de implantação de medidas de controle capazes de minimizar ou até mesmo eliminar os riscos de exposição para os trabalhadores. Os ambientes de trabalho são classificados nas categorias a seguir:`,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Ambientes Gerais:** Nos ambientes considerados gerais são aqueles que não possuem uma destinação específica e certamente são isentos de riscos próprios, envolve áreas comuns de circulação e normalmente sem restrição de acesso ao público, tais como: Fachada da empresa, Roll de entrada, ambientes de espera, pátios, áreas de recreação, etc.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Ambientes Administrativos:** Nos ambientes administrativos são executadas atividades diversas sem relação direta com o processo produtivo e pouco relacionadas com riscos físicos, químicos e biológicos, mas é possível encontrar alguns fatores de riscos ergonômicos e até mesmo de acidentes, no entanto de baixa severidade.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Ambientes de Apoio:** Nos ambientes de apoio são executadas atividades que dão suporte às atividades operacionais da empresa, normalmente envolvem Fatores de Riscos e Perigos característicos ao que é executado nos seus postos de trabalho gerando exposições primárias, são exemplos os seguintes ambientes: Oficinas diversa, laboratórios, estações de tratamento (efluentes), pátios de resíduos, etc.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Ambientes Operacionais:** Nos ambientes operacionais são executadas atividades que resultam no produto ou serviço fim da empresa, ou seja, onde ocorre o processo produtivo, normalmente são os ambientes de maior concentração de Fatores de Riscos e Perigos envolvendo quase sempre exposições primárias e secundárias.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: `A seguir é apresentada uma relação dos diversos ambientes que compreendem a **??${variables_enum_1.VariablesPGREnum.COMPANY_SHORT_NAME}??** com suas respectivas atribuições e descrição dos seus respectivos processos produtivos.`,
                },
            ],
        },
        {
            type: section_types_1.PGRSectionTypeEnum.ITERABLE_ENVIRONMENTS,
        },
    ],
};
//# sourceMappingURL=2.0-envronment.js.map