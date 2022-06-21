"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSection = void 0;
const elements_types_1 = require("../types/elements.types");
const section_types_1 = require("../types/section.types");
exports.initSection = {
    footer: true,
    header: true,
    data: [
        {
            type: section_types_1.PGRSectionTypeEnum.COVER,
        },
        {
            type: section_types_1.PGRSectionTypeEnum.TOC,
        },
        {
            type: section_types_1.PGRSectionTypeEnum.CHAPTER,
            text: '??NOME_DO_CAPITULO_1??',
        },
        {
            type: section_types_1.PGRSectionTypeEnum.SECTION,
            footerText: '??NOME_DO_CAPITULO_1??',
            children: [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.TITLE,
                    text: '??NOME_DO_CAPITULO_1??',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H1,
                    text: 'INTRODUÇÃO',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'O Documento Base do PGR tem como finalidade sintetizar todos os aspectos estruturais do programa e definir as diretrizes relativas ao gerenciamento dos riscos ambientais, que possam afetar a saúde e a integridade física dos trabalhadores da **??NOME_DA_EMPRESA??**. e de suas Contratadas (NR-01 Item 1.5.1).',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H2,
                    text: 'Objetivo',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'O PROGRAMA DE GERENCIAMENTO DE RISCO – PGR visa disciplinar os preceitos a serem observados na organização e no ambiente de trabalho, de forma a tornar compatível o planejamento e o desenvolvimento da atividade da empresa com a busca permanente da segurança e saúde dos trabalhadores em consonância com a NR-01 Subitem 1.5 Gerenciamento de Riscos Ocupacionais (GRO) em cumprimento ao determinado no subitem 1.5.3.1.1 que institui o PGR como ferramenta de Gerenciamento de Riscos Ocupacionais.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'O PGR deve:',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    level: 0,
                    text: 'Contemplar Riscos Físicos, Químicos, Biológicos, de Acidentes e Ergonômicos;',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    level: 0,
                    text: 'Providências quanto à eliminação ou minimização na maior extensão possível dos riscos ambientais;',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    level: 0,
                    text: 'Inspeções periódicas para identificar, avaliar e controlar os riscos à saúde e segurança;',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    level: 0,
                    text: 'Incluir a participação dos colaboradores no reconhecimento dos riscos e proposição de medidas preventivas;',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    level: 0,
                    text: 'Acionar de forma imediata e completa de todo acidente ou doença ocupacional para encontrar a causa e corrigir o problema de forma a evitar a reincidência (NR-01 Item 1.4.1, Alínea e).',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'Esse programa é parte integrante do GRO (Gerenciamento de Riscos Ocupacionais) e está articulado com todas as Normas Regulamentadoras instituídas pela Portaria MTb n° 3.214, de 08 de junho de 1978.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'O PGR não substitui os programas/ações listados a seguir, mas deve a pontar quando necessário do desenvolvimento dos mesmos:',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    level: 0,
                    text: 'Programa de Treinamento para todos os empregados e contratados em boas práticas de saúde, segurança e preservação ambiental – INFORMAÇÃO, QUALIFICAÇÃO E TREINAMENTO (NR-01 Item 1.4.4);',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    level: 0,
                    text: 'Desenvolvimento de normas e procedimentos de saúde e segurança e a exigência de que os colaboradores cooperem no cumprimento das mesmas;',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    level: 0,
                    text: 'CONTROLE DE ATMOSFERAS EXPLOSIVA – Quando Aplicável; (NR-22 Item 22.3.7 alíneas b);',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    level: 0,
                    text: 'CONTROLE DA DEFICIÊNCIA DE OXIGÊNIO – Quando Aplicável; (NR-22 Item 22.3.7 alíneas c);',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    level: 0,
                    text: 'CONTROLE DA VENTILAÇÃO – Quando Aplicável; (NR-22 Item 22.3.7 alíneas d);',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    level: 0,
                    text: 'PROGRAMA DE PROTEÇÃO RESPIRATÓRIA – Quando Aplicável; (A Instrução Normativa – IN No 1 da Secretaria de Segurança e Saúde no Trabalho, datada de 11 de abril de 1994);',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    level: 0,
                    text: 'INVESTIGAÇÃO E ANÁLISE DE ACIDENTES DO TRABALHO – Quando Aplicável (NR-01 Item 1.4.1, Alínea e);',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    level: 0,
                    text: 'AET – ANÁLISE ERGONÔMICA DO TRABALHO – NR 17 – Quando Aplicável (NR-01 Item 1.5.3.2.1);',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    level: 0,
                    text: 'RISCOS DECORRENTES DO TRABALHO EM ALTURA – NR 35 – Quando Aplicável; (NR-22 Item 22.3.7alíneas h);',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    level: 0,
                    text: 'RISCOS DECORRENTES DO TRABALHO EM PROFUNDIDADE E EM ESPAÇOS CONFINADOS NR 33 – Quando Aplicável; (NR-22 Item 22.3.7 alíneas h);',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    level: 0,
                    text: 'RISCOS DECORRENTES DA UTILIZAÇÃO DE ENERGIA ELÉTRICA NR 10 – Quando Aplicável; (NR-22 Item 22.3.7 alíneas i);',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    level: 0,
                    text: 'RISCOS DECORRENTES DE MÁQUINAS E EQUIPAMENTOS (NR-12) – Quando Aplicável; (NR-22 Item 22.3.7 alíneas i);',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    level: 0,
                    text: 'RISCOS DECORRENTES DE VEÍCULOS – Quando Aplicável; (NR-22 Item 22.3.7 alíneas i);',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    level: 0,
                    text: 'EPI’s (NR-06)',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    level: 0,
                    text: 'ESTABILIDADE DO MACIÇO (NR-22) – Quando Aplicável; (NR-22 Item 22.3.7 alíneas l);',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    level: 0,
                    text: 'PLANO DE ATENDIMENTO E RESPOSTA A EMERGÊNCIAS (NR-01 Item 1.5.6.);',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    level: 0,
                    text: 'SINALIZAÇÃO DE ÁREA DE TRABALHO E DE CIRCULAÇÃO – Quando Aplicável; (NR-22 Item 22.19);',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    level: 0,
                    text: 'PLANO DE TRÂNSITO – Quando Aplicável; (NR-22 Item 22.7.1);',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    level: 0,
                    text: 'GESTÃO DE MUDANÇAS.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H2,
                    text: 'Identificação da Empresa',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '**Razão Social**: {{RAZAO_SOCIAL}}',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '**Endereço**: {{LOGRADOURO_EMPRESA}}, {{NUMERO_EMPRESA}}, {{BAIRRO_EMPRESA}} - {{CIDADE_EMPRESA}}/{{UF_EMPRESA}}, CEP: {{CEP_EMPRESA}}',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '**TELEFONE**: {{TELEPHONE_EMPRESA}}',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '**E-mail**: {{EMAIL_EMPRESA}}',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '**CNPJ**: {{CNPJ_EMPRESA}}',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '**Horário de Trabalho**: {{HORARIO_DE_TRABALHO}}',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H2,
                    text: 'Abrangência',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'A critério da organização, o PGR pode ser implementado por unidade operacional, setor ou atividade. \n**(NR-01 Item 1.5.3.1.1.1)**',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'Este PGR compreende todo Estabelecimento inscrito no CNPJ: {{CNPJ_ESTABELECIMENTO}}.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BREAK,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H2,
                    text: 'RESPONSÁVEIS PELA ELABORAÇÃO DO PGR',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '**SIMPLESST**',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '**Profissionais:**',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: '',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H2,
                    text: ' REVISÕES DO DOCUMENTO',
                },
            ],
        },
    ],
};
//# sourceMappingURL=0-init.js.map